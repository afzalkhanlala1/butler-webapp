import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getGoogleAccessToken } from "@/lib/firebase";
import {
  readEmails as gmailRead,
  sendEmail as gmailSend,
  replyEmail as gmailReply,
  createCalendarEvent,
  deleteCalendarEvent,
  listCalendarEvents,
  type EmailReadFilter,
} from "@/lib/googleActions";

interface DevTestPanelProps {
  context: string;
  placeholder?: string;
}

const DevTestPanel = ({ context, placeholder }: DevTestPanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const base = (import.meta.env.VITE_ADK_BASE as string) || "/adk";
  const agent = (import.meta.env.VITE_ADK_AGENT as string) || "email_agent";
  const { currentUser } = useAuth();
  const userId = (currentUser?.uid as string) || (import.meta.env.VITE_ADK_USER_ID as string) || "butler-dev";
  // Default to ADK's generic run endpoint; can be overridden via env
  const invokePathEnv = (import.meta.env.VITE_ADK_INVOKE_PATH as string) || "/run";
  const url = `${base}${invokePathEnv.replace(":agent", agent)}`;

  async function ensureSession(): Promise<string> {
    if (sessionId) return sessionId;
    const res = await fetch(`${base}/apps/${agent}/users/${userId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to create session: ${res.status} ${text}`);
    }
    const data = await res.json();
    // Expect an object with an "id" field
    if (!data?.id) {
      throw new Error("Invalid session response: missing id");
    }
    setSessionId(data.id);
    return data.id as string;
  }

  function parseAdkResponse(data: any): string {
    if (!data) return "";
    // New ADK /run returns an array of Event objects
    if (Array.isArray(data)) {
      // Find the last non-user event with content text
      for (let i = data.length - 1; i >= 0; i -= 1) {
        const evt = data[i];
        if (evt?.author && evt?.author !== "user") {
          const parts = evt?.content?.parts;
          if (Array.isArray(parts)) {
            const textPart = parts.find((p: any) => typeof p?.text === "string" && p.text.trim().length > 0);
            if (textPart?.text) return textPart.text as string;
          }
        }
      }
      // Fallback to any text part
      for (let i = data.length - 1; i >= 0; i -= 1) {
        const parts = data[i]?.content?.parts;
        if (Array.isArray(parts)) {
          const textPart = parts.find((p: any) => typeof p?.text === "string" && p.text.trim().length > 0);
          if (textPart?.text) return textPart.text as string;
        }
      }
      return "";
    }
    // Backward compatibility fallbacks
    if (typeof data === "string") return data;
    if (data.output?.text) return data.output.text;
    if (data.output?.content?.text) return data.output.content.text;
    if (data.message?.content?.text) return data.message.content.text;
    if (Array.isArray(data.messages)) {
      const last = data.messages[data.messages.length - 1];
      if (last?.content?.text) return last.content.text;
      if (typeof last === "string") return last;
    }
    if (data.text) return data.text;
    return "";
  }

  function parseMaybeJsonAction(text: string): any | null {
    if (!text) return null;
    let candidate = text.trim();
    // 1) Strip markdown code fences if present
    if (candidate.startsWith("```")) {
      const firstNewline = candidate.indexOf("\n");
      if (firstNewline !== -1) {
        const afterFence = candidate.slice(firstNewline + 1);
        const closingIdx = afterFence.lastIndexOf("```");
        candidate = (closingIdx >= 0 ? afterFence.slice(0, closingIdx) : afterFence).trim();
      }
    }
    // 2) If the entire content is a JSON object, parse directly
    if (candidate.startsWith("{") && candidate.endsWith("}")) {
      try {
        const obj = JSON.parse(candidate);
        return obj && typeof obj.action === "string" ? obj : null;
      } catch { /* fallthrough */ }
    }
    // 3) Fallback: try to locate a JSON object within the text
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const inner = candidate.slice(start, end + 1);
      try {
        const obj = JSON.parse(inner);
        return obj && typeof obj.action === "string" ? obj : null;
      } catch { /* ignore */ }
    }
    return null;
  }

  async function sendActionResultToAgent(sid: string, result: any): Promise<string> {
    const payload = {
      app_name: agent,
      user_id: userId,
      session_id: sid,
      new_message: {
        role: "user",
        parts: [
          { text: "ActionResult:" },
          { text: JSON.stringify(result) }
        ]
      },
      streaming: false
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`ADK error ${res.status}: ${text}`);
    }
    const data = await res.json();
    return parseAdkResponse(data) || JSON.stringify(data);
  }

  async function tryHandleAgentAction(sid: string, actionObj: any): Promise<string> {
    const action = String(actionObj.action || "");
    // Determine required scopes
    let scopes: string[] = [];
    if (action === "READ_EMAILS") scopes = ["https://www.googleapis.com/auth/gmail.readonly"]; 
    if (action === "SEND_EMAIL" || action === "REPLY_EMAIL") scopes = [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
    ];
    if (action === "CREATE_EVENT" || action === "DELETE_EVENT" || action === "LIST_EVENTS") scopes = ["https://www.googleapis.com/auth/calendar.events"]; 
    if (action === "LIST_DRIVE_FILES") scopes = ["https://www.googleapis.com/auth/drive.metadata.readonly"]; 
    if (action === "CREATE_TASK" || action === "LIST_TASKS" || action === "COMPLETE_TASK" || action === "DELETE_TASK") scopes = ["https://www.googleapis.com/auth/tasks"]; 

    if (scopes.length === 0) {
      // Unknown action; just return the original text
      return JSON.stringify({ ok: false, error: `Unknown action: ${action}` });
    }

    const token = await getGoogleAccessToken(scopes);

    try {
      if (action === "READ_EMAILS") {
        const filter = (actionObj.filter as EmailReadFilter) || "most_recent";
        const msgs = await gmailRead(token, filter);
        const result = { ok: true, action, filter, messages: msgs };
        return await sendActionResultToAgent(sid, result);
      }
      if (action === "LIST_DRIVE_FILES") {
        const { pageSize } = actionObj;
        const files = await (await import("@/lib/googleActions")).listDriveFiles(token, typeof pageSize === 'number' ? pageSize : 10);
        const result = { ok: true, action, count: files.length, files };
        return await sendActionResultToAgent(sid, result);
      }
      if (action === "LIST_TASKS") {
        const { showCompleted, maxResults } = actionObj;
        const tasks = await (await import("@/lib/googleActions")).listTasks(token, {
          showCompleted: typeof showCompleted === 'boolean' ? showCompleted : undefined,
          maxResults: typeof maxResults === 'number' ? maxResults : 10,
        });
        const result = { ok: true, action, count: tasks.length, tasks };
        return await sendActionResultToAgent(sid, result);
      }
      if (action === "CREATE_TASK") {
        const { title, due, notes } = actionObj;
        if (!title) throw new Error("Missing title for CREATE_TASK");
        const created = await (await import("@/lib/googleActions")).createTask(token, String(title), due ? String(due) : undefined, notes ? String(notes) : undefined);
        const result = { ok: true, action, taskId: created.id };
        return await sendActionResultToAgent(sid, result);
      }
      if (action === "COMPLETE_TASK") {
        const { taskId } = actionObj;
        if (!taskId) throw new Error("Missing taskId for COMPLETE_TASK");
        const updated = await (await import("@/lib/googleActions")).completeTask(token, String(taskId));
        const result = { ok: true, action, taskId: updated.id };
        return await sendActionResultToAgent(sid, result);
      }
      if (action === "DELETE_TASK") {
        const { taskId } = actionObj;
        if (!taskId) throw new Error("Missing taskId for DELETE_TASK");
        await (await import("@/lib/googleActions")).deleteTask(token, String(taskId));
        const result = { ok: true, action, taskId };
        return await sendActionResultToAgent(sid, result);
      }
      if (action === "SEND_EMAIL") {
        const { recipient, subject, content } = actionObj;
        if (!recipient || !subject || !content) throw new Error("Missing fields for SEND_EMAIL");
        const sent = await gmailSend(token, String(recipient), String(subject), String(content));
        const result = { ok: true, action, id: sent.id, threadId: sent.threadId };
        return await sendActionResultToAgent(sid, result);
      }
      if (action === "REPLY_EMAIL") {
        const { threadId, messageId, content } = actionObj;
        if (!threadId || !content) throw new Error("Missing fields for REPLY_EMAIL");
        const sent = await gmailReply(token, String(threadId), messageId ? String(messageId) : undefined, String(content));
        const result = { ok: true, action, id: sent.id, threadId: sent.threadId };
        return await sendActionResultToAgent(sid, result);
      }
      if (action === "CREATE_EVENT") {
        const { title, start, end, attendees, description } = actionObj;
        if (!title || !start || !end) throw new Error("Missing fields for CREATE_EVENT");
        const created = await createCalendarEvent(token, {
          title: String(title),
          start: String(start),
          end: String(end),
          description: description ? String(description) : undefined,
          attendees: Array.isArray(attendees) ? attendees.map(String) : undefined,
        });
        const result = { ok: true, action, eventId: created.id };
        return await sendActionResultToAgent(sid, result);
      }
      if (action === "DELETE_EVENT") {
        const { eventId } = actionObj;
        if (!eventId) throw new Error("Missing eventId for DELETE_EVENT");
        await deleteCalendarEvent(token, String(eventId));
        const result = { ok: true, action, eventId };
        return await sendActionResultToAgent(sid, result);
      }
      if (action === "LIST_EVENTS") {
        const { timeMin, timeMax, q, maxResults } = actionObj;
        const events = await listCalendarEvents(token, {
          timeMin: timeMin ? String(timeMin) : undefined,
          timeMax: timeMax ? String(timeMax) : undefined,
          q: q ? String(q) : undefined,
          maxResults: typeof maxResults === 'number' ? maxResults : 10,
        });
        const result = { ok: true, action, count: events.length, events };
        return await sendActionResultToAgent(sid, result);
      }
      return JSON.stringify({ ok: false, error: `Unhandled action ${action}` });
    } catch (err: any) {
      const errorResult = { ok: false, action, error: err?.message || String(err) };
      return await sendActionResultToAgent(sid, errorResult);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setReply(null);
    if (!prompt.trim()) {
      toast({
        title: "Enter a prompt",
        description: "Type a prompt to test your agent integration.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const sid = await ensureSession();
      // ADK /run expects AgentRunRequest
      const payload = {
        app_name: agent,
        user_id: userId,
        session_id: sid,
        new_message: {
          role: "user",
          parts: [
            { text: `Context: ${context}` },
            { text: prompt }
          ]
        },
        streaming: false
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`ADK error ${res.status}: ${text}`);
      }
      const data = await res.json();
      const text = parseAdkResponse(data) || JSON.stringify(data);
      // If the agent emitted an action as pure JSON, execute it and then send the result back to the agent for continuation.
      const maybeAction = parseMaybeJsonAction(text);
      if (maybeAction?.action) {
        const continued = await tryHandleAgentAction(sid, maybeAction);
        setReply(continued);
      } else {
        setReply(text);
      }
      toast({ title: "Agent responded" });
      setPrompt("");
    } catch (err: any) {
      setError(err?.message || "Request failed");
      toast({ title: "Request failed", description: err?.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const computedPlaceholder =
    placeholder || `Enter a test prompt for ${context} (this will be sent to your agent webhook later) ...`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Developer Testing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={`devtest-${context}`}>Prompt for {context}</Label>
            <Textarea
              id={`devtest-${context}`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={computedPlaceholder}
              className="min-h-[90px]"
            />
          </div>
          <div className="flex items-center gap-3 justify-end">
            {isLoading && <span className="text-sm text-muted-foreground">Sending…</span>}
            <Button type="submit" disabled={isLoading}>Run Test</Button>
          </div>
        </form>
        {error && (
          <div className="mt-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {reply && (
          <div className="mt-4">
            <Label>Agent reply</Label>
            <div className="mt-1 rounded border p-3 text-sm whitespace-pre-wrap">
              {reply}
            </div>
          </div>
        )}

        {!reply && !error && (
          <p className="mt-3 text-xs text-muted-foreground">
            This panel sends your prompt to the Google ADK agent endpoint defined in your env.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DevTestPanel;


