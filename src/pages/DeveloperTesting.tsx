import TopNav from "@/components/layout/TopNav";
import DevTestPanel from "@/components/common/DevTestPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Inbox as InboxIcon, RefreshCw, Folder, CheckSquare, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getGoogleAccessToken } from "@/lib/firebase";
import { readEmails, readEmailBody, replyEmail, type GmailMessageSummary, listCalendarEvents, listDriveFiles, type DriveFileSummary, listTasks, type TaskItemSummary } from "@/lib/googleActions";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DeveloperTesting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gmailError, setGmailError] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [emails, setEmails] = useState<GmailMessageSummary[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [files, setFiles] = useState<DriveFileSummary[]>([]);
  const [tasks, setTasksState] = useState<TaskItemSummary[]>([]);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [agentOpen, setAgentOpen] = useState(true);
  const [rankingIds, setRankingIds] = useState<string[] | null>(null);
  const [rankingError, setRankingError] = useState<string | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedEmailBody, setSelectedEmailBody] = useState<string>("");
  const [emailBodyLoading, setEmailBodyLoading] = useState(false);
  const [replyForEmailId, setReplyForEmailId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState<string>("");
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Agent (ADK) helpers reused from DevTestPanel
  const base = (import.meta.env.VITE_ADK_BASE as string) || "/adk";
  const adkAgent = (import.meta.env.VITE_ADK_AGENT as string) || "email_agent";
  const userId = (currentUser?.uid as string) || (import.meta.env.VITE_ADK_USER_ID as string) || "butler-dev";
  const invokePathEnv = (import.meta.env.VITE_ADK_INVOKE_PATH as string) || "/run";
  const adkUrl = `${base}${invokePathEnv.replace(":agent", adkAgent)}`;
  const [adkSessionId, setAdkSessionId] = useState<string | null>(null);

  function parseAdkText(data: any): string {
    if (!data) return "";
    if (Array.isArray(data)) {
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
      return "";
    }
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

  async function ensureAdkSession(): Promise<string> {
    if (adkSessionId) return adkSessionId;
    const res = await fetch(`${base}/apps/${adkAgent}/users/${userId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Failed to create agent session: ${res.status} ${t}`);
    }
    const data = await res.json();
    setAdkSessionId(data.id as string);
    return data.id as string;
  }

  useEffect(() => {
    document.title = "Butler Docs • Developer Testing";
  }, []);

  const timeMinNow = useMemo(() => new Date().toISOString(), []);

  async function fetchData() {
    setIsLoading(true);
    setGmailError(null);
    setCalendarError(null);
    setDriveError(null);
    setTasksError(null);
    try {
      const token = await getGoogleAccessToken([
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/tasks",
      ]);
      const results = await Promise.allSettled([
        readEmails(token, "all", { maxResults: 20 }),
        listCalendarEvents(token, { timeMin: timeMinNow, maxResults: 10 }),
        listDriveFiles(token, 10),
        listTasks(token, { showCompleted: false, maxResults: 10 }),
      ]);
      const [emailsRes, eventsRes, filesRes, tasksRes] = results;
      if (emailsRes.status === "fulfilled") {
        const list = emailsRes.value || [];
        setEmails(list);
        // Ask the agent to rank the last 20 by importance; expect a JSON array of messageIds
        try {
          const sid = await ensureAdkSession();
          const payload = {
            app_name: adkAgent,
            user_id: userId,
            session_id: sid,
            new_message: {
              role: "user",
              parts: [
                { text: "Rank these Gmail message IDs by importance from highest to lowest and return ONLY a JSON array of ids." },
                { text: JSON.stringify(list.slice(0, 20).map((m: any) => ({ id: m.id, from: m.from, subject: m.subject, date: m.date, snippet: m.snippet }))) }
              ]
            },
            streaming: false
          };
          const res = await fetch(adkUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
          if (res.ok) {
            const data = await res.json();
            const text = parseAdkText(data);
            try {
              const arr = JSON.parse(text);
              if (Array.isArray(arr)) setRankingIds(arr.filter((x: any) => typeof x === 'string'));
            } catch {
              // ignore parse error
            }
          }
        } catch (e: any) {
          setRankingError(e?.message || String(e));
        }
      }
      else setGmailError(emailsRes.reason?.message || String(emailsRes.reason));
      if (eventsRes.status === "fulfilled") setEvents(Array.isArray(eventsRes.value) ? eventsRes.value : []);
      else setCalendarError(eventsRes.reason?.message || String(eventsRes.reason));
      if (filesRes.status === "fulfilled") setFiles(filesRes.value || []);
      else setDriveError(filesRes.reason?.message || String(filesRes.reason));
      if (tasksRes.status === "fulfilled") setTasksState(tasksRes.value || []);
      else setTasksError(tasksRes.reason?.message || String(tasksRes.reason));
    } catch (err: any) {
      const msg = err?.message || String(err);
      setGmailError(prev => prev || msg);
      setCalendarError(prev => prev || msg);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Load on first mount; user can refresh if consent is required
    fetchData().catch(() => {});
  }, []);

  function formatTime(dt?: string) {
    if (!dt) return "";
    try {
      const d = new Date(dt);
      return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return dt;
    }
  }

  const importantEmails = useMemo(() => {
    const pool = [...emails].sort((a, b) => (new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())).slice(0, 20);
    if (rankingIds && rankingIds.length > 0) {
      const byId = new Map(pool.map(e => [e.id, e] as const));
      const ranked = rankingIds.map(id => byId.get(id)).filter(Boolean) as GmailMessageSummary[];
      return ranked.slice(0, 5);
    }
    return pool.slice(0, 5);
  }, [emails, rankingIds]);

  async function openEmail(id: string) {
    setSelectedEmailId(id);
    setSelectedEmailBody("");
    setEmailBodyLoading(true);
    try {
      const token = await getGoogleAccessToken(["https://www.googleapis.com/auth/gmail.readonly"]);
      const body = await readEmailBody(token, id);
      setSelectedEmailBody(body);
    } catch (e: any) {
      setSelectedEmailBody(e?.message || String(e));
    } finally {
      setEmailBodyLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto max-w-7xl px-4">
        <div>
          <main className="pb-20">
            <header className="pt-10">
              <p className="text-sm font-medium text-accent">Developer</p>
              <div className="flex items-center justify-between">
                <h1 className="mt-2 text-4xl font-bold tracking-tight">Developer Testing</h1>
                <Button variant="outline" size="sm" onClick={fetchData} disabled={isLoading}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isLoading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
              <p className="mt-3 text-lg text-muted-foreground">View your recent Gmail and Calendar data and send a prompt to your agent.</p>
            </header>

            <section className="mt-10 grid gap-6 xl:grid-cols-3">
              <div className="space-y-6 xl:col-span-1">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className="flex items-center gap-2">
                      <InboxIcon className="h-5 w-5 text-accent" />
                      <CardTitle className="text-base">Inbox (Top 5 from last 20)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-[480px] pr-4">
                      {gmailError && (
                        <p className="text-sm text-red-500">{gmailError}</p>
                      )}
                      {!gmailError && importantEmails.length === 0 && (
                        <p className="text-sm text-muted-foreground">No recent messages found.</p>
                      )}
                      <div className="space-y-3">
                        {importantEmails.map((m) => (
                          <div key={m.id} className="rounded border p-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate max-w-[70%]">{m.subject || "(no subject)"}</p>
                              <span className="text-xs text-muted-foreground ml-2">{m.date ? new Date(m.date).toLocaleDateString() : ""}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">{m.from || ""}</p>
                            {m.snippet && (
                              <p className="text-sm mt-2 line-clamp-2">{m.snippet}</p>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => openEmail(m.id)}>View</Button>
                              <Button size="sm" onClick={async () => {
                                setReplyError(null);
                                setIsGeneratingReply(true);
                                setReplyForEmailId(m.id);
                                setReplyDraft("");
                                try {
                                  const sid = await ensureAdkSession();
                                  const payload = {
                                    app_name: adkAgent,
                                    user_id: userId,
                                    session_id: sid,
                                    new_message: {
                                      role: "user",
                                      parts: [
                                        { text: "Draft a short, professional reply to this email. Return only the reply body text." },
                                        { text: `Subject: ${m.subject || ''}` },
                                        { text: `From: ${m.from || ''}` },
                                        { text: selectedEmailBody || '' }
                                      ]
                                    },
                                    streaming: false
                                  };
                                  // Ensure we have the email body for better drafts
                                  if (!selectedEmailId || selectedEmailId !== m.id) {
                                    try {
                                      const token = await getGoogleAccessToken(["https://www.googleapis.com/auth/gmail.readonly"]);
                                      const body = await readEmailBody(token, m.id);
                                      payload.new_message.parts[payload.new_message.parts.length - 1] = { text: body };
                                    } catch {}
                                  }
                                  const res = await fetch(adkUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
                                  if (res.ok) {
                                    const data = await res.json();
                                    const text = parseAdkText(data);
                                    setReplyDraft(text || "");
                                  } else {
                                    const t = await res.text();
                                    setReplyError(t);
                                  }
                                } catch (e: any) {
                                  setReplyError(e?.message || String(e));
                                } finally {
                                  setIsGeneratingReply(false);
                                }
                              }}>Reply</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-accent" />
                      <CardTitle className="text-base">Drive (Recent)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-[480px] pr-4">
                      {driveError && (
                        <div className="text-sm text-red-500 space-y-2">
                          <p>{driveError}</p>
                        </div>
                      )}
                      {!driveError && (
                        <div className="space-y-3">
                          {files.length === 0 && (
                            <p className="text-sm text-muted-foreground">No recent files.</p>
                          )}
                          {files.map((f) => (
                            <details key={f.id} className="rounded border p-3 group">
                              <summary className="list-none cursor-pointer">
                                <p className="text-sm font-medium truncate group-open:whitespace-normal group-open:truncate-none">
                                  {f.name}
                                </p>
                              </summary>
                              <div className="mt-2 space-y-1">
                                {f.thumbnailLink && (
                                  <img src={f.thumbnailLink} alt="Preview" className="max-h-40 rounded border" />
                                )}
                                <p className="text-xs text-muted-foreground">{f.mimeType || ''}</p>
                                <p className="text-xs text-muted-foreground">{f.modifiedTime ? new Date(f.modifiedTime).toLocaleString() : ''}</p>
                                {f.webViewLink && (
                                  <a className="text-xs underline" href={f.webViewLink} target="_blank" rel="noreferrer">Open in Drive</a>
                                )}
                                {f.size && (
                                  <p className="text-xs text-muted-foreground">Size: {f.size} bytes</p>
                                )}
                              </div>
                            </details>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6 xl:col-span-1">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-accent" />
                      <CardTitle className="text-base">Upcoming Events</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-[480px] pr-4">
                      {calendarError && (
                        <p className="text-sm text-red-500">{calendarError}</p>
                      )}
                      {!calendarError && events.length === 0 && (
                        <p className="text-sm text-muted-foreground">No upcoming events.</p>
                      )}
                      <div className="space-y-3">
                        {events.map((evt: any) => {
                          const start = evt?.start?.dateTime || evt?.start?.date; // all-day events may use date
                          const end = evt?.end?.dateTime || evt?.end?.date;
                          return (
                            <div key={evt.id} className="rounded border p-3">
                              <p className="text-sm font-medium">{evt.summary || "(no title)"}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTime(start)}{end ? ` – ${formatTime(end)}` : ""}
                              </p>
                              {evt.location && (
                                <p className="text-xs text-muted-foreground mt-1">{evt.location}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6 xl:col-span-1">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-accent" />
                      <CardTitle className="text-base">Tasks</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-[480px] pr-4">
                      {tasksError && (
                        <div className="text-sm text-red-500 space-y-2">
                          <p>{tasksError}</p>
                          <p className="text-xs">If this mentions the Tasks API is disabled, enable it in Google Cloud Console and try again.</p>
                        </div>
                      )}
                      {!tasksError && (
                        <div className="space-y-3">
                          {tasks.length === 0 && (
                            <p className="text-sm text-muted-foreground">No tasks found.</p>
                          )}
                          {tasks.map((t) => (
                            <div key={t.id} className="rounded border p-3">
                              <p className="text-sm font-medium truncate">{t.title || '(untitled task)'}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t.status}</p>
                              {t.due && (<p className="text-xs text-muted-foreground">Due {formatTime(t.due)}</p>)}
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Right collapsible agent sidebar */}
              <div className={`fixed right-0 top-16 bottom-0 w-full sm:w-[420px] bg-background/95 border-l transition-transform duration-200 ${agentOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-10 flex items-center justify-between px-3 border-b">
                  <p className="text-sm font-medium">Agent</p>
                  <Button size="icon" variant="ghost" onClick={() => setAgentOpen(false)} aria-label="Close agent">
                    <PanelRightClose className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3">
                  <DevTestPanel context="Developer Testing" placeholder="Type a prompt for your agent..." />
                </div>
              </div>

              {/* Toggle opener button */}
              {!agentOpen && (
                <Button className="fixed right-3 bottom-4 shadow" onClick={() => setAgentOpen(true)} aria-label="Open agent sidebar">
                  <PanelRightOpen className="mr-2 h-4 w-4" /> Open Agent
                </Button>
              )}
            </section>
            {/* Email content dialog */}
            {selectedEmailId && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" role="dialog" aria-modal="true" onClick={() => setSelectedEmailId(null)}>
                <div className="bg-background rounded-md shadow-xl w-[90vw] max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between border-b px-4 py-2">
                    <p className="text-sm font-medium">Email content</p>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedEmailId(null)}>Close</Button>
                  </div>
                  <div className="p-4">
                    {emailBodyLoading ? (
                      <p className="text-sm text-muted-foreground">Loading…</p>
                    ) : (
                      <ScrollArea className="max-h-[60vh]">
                        <pre className="whitespace-pre-wrap text-sm">{selectedEmailBody}</pre>
                      </ScrollArea>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reply composer */}
            {replyForEmailId && (
              <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" role="dialog" aria-modal="true" onClick={() => setReplyForEmailId(null)}>
                <div className="bg-background rounded-md shadow-xl w-[90vw] max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between border-b px-4 py-2">
                    <p className="text-sm font-medium">Reply Draft</p>
                    <Button variant="ghost" size="sm" onClick={() => setReplyForEmailId(null)}>Close</Button>
                  </div>
                  <div className="p-4 space-y-3">
                    {isGeneratingReply ? (
                      <p className="text-sm text-muted-foreground">Generating reply…</p>
                    ) : (
                      <textarea className="w-full h-56 border rounded p-2 text-sm" value={replyDraft} onChange={(e) => setReplyDraft(e.target.value)} />
                    )}
                    {replyError && <p className="text-sm text-red-500">{replyError}</p>}
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setReplyForEmailId(null)}>Cancel</Button>
                      <Button disabled={isSendingReply || !replyDraft.trim()} onClick={async () => {
                        setIsSendingReply(true);
                        try {
                          const token = await getGoogleAccessToken([
                            "https://www.googleapis.com/auth/gmail.send",
                            "https://www.googleapis.com/auth/gmail.readonly",
                          ]);
                          await replyEmail(token, replyForEmailId as string, undefined, replyDraft);
                          setReplyForEmailId(null);
                          setReplyDraft("");
                          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                          (toast && toast({ title: "Reply sent" }));
                        } catch (e: any) {
                          setReplyError(e?.message || String(e));
                        } finally {
                          setIsSendingReply(false);
                        }
                      }}>Send</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTesting;


