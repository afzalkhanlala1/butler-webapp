import TopNav from "@/components/layout/TopNav";
import DevTestPanel from "@/components/common/DevTestPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar as CalendarIcon, Inbox as InboxIcon, RefreshCw, Folder, CheckSquare, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getGoogleAccessToken } from "@/lib/firebase";
import { readEmails, readEmailBody, type GmailMessageSummary, listCalendarEvents, listDriveFiles, type DriveFileSummary, listTasks, type TaskItemSummary } from "@/lib/googleActions";

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
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedEmailBody, setSelectedEmailBody] = useState<string>("");
  const [emailBodyLoading, setEmailBodyLoading] = useState(false);

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
      if (emailsRes.status === "fulfilled") setEmails(emailsRes.value || []);
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
    // Simple heuristic: prefer UNREAD, STARRED, IMPORTANT labels when present, then by date desc
    const score = (m: GmailMessageSummary): number => {
      const labels = new Set(m.labelIds || []);
      let s = 0;
      if (labels.has('UNREAD')) s += 3;
      if (labels.has('STARRED')) s += 2;
      if (labels.has('IMPORTANT')) s += 2;
      if (m.subject && /urgent|asap|important|action required/i.test(m.subject)) s += 1;
      if (m.from && /ceo|founder|client|vip/i.test(m.from)) s += 1;
      return s;
    };
    const sorted = [...emails]
      .sort((a, b) => (new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()))
      .slice(0, 20)
      .sort((a, b) => score(b) - score(a));
    return sorted.slice(0, 5);
  }, [emails]);

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
                    <ScrollArea className="max-h-[420px] pr-4">
                      {gmailError && (
                        <p className="text-sm text-red-500">{gmailError}</p>
                      )}
                      {!gmailError && importantEmails.length === 0 && (
                        <p className="text-sm text-muted-foreground">No recent messages found.</p>
                      )}
                      <div className="space-y-3">
                        {importantEmails.map((m) => (
                          <button key={m.id} onClick={() => openEmail(m.id)} className="w-full text-left rounded border p-3 hover:bg-muted/50">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate max-w-[70%]">{m.subject || "(no subject)"}</p>
                              <span className="text-xs text-muted-foreground ml-2">{m.date ? new Date(m.date).toLocaleDateString() : ""}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 truncate">{m.from || ""}</p>
                            {m.snippet && (
                              <p className="text-sm mt-2 line-clamp-2">{m.snippet}</p>
                            )}
                          </button>
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
                    <ScrollArea className="max-h-[420px] pr-4">
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
                            <div key={f.id} className="rounded border p-3">
                              <p className="text-sm font-medium truncate">{f.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{f.mimeType || ''}</p>
                              <p className="text-xs text-muted-foreground">{f.modifiedTime ? new Date(f.modifiedTime).toLocaleString() : ''}</p>
                            </div>
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
                    <ScrollArea className="max-h-[420px] pr-4">
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
                    <ScrollArea className="max-h-[420px] pr-4">
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default DeveloperTesting;


