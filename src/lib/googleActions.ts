// Minimal Gmail and Calendar helpers for executing agent actions via Google REST APIs

export type EmailReadFilter = 'most_recent' | 'unread' | 'all';

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  from?: string;
  subject?: string;
  date?: string;
  snippet?: string;
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function base64UrlEncode(utf8: string): string {
  const bytes = new TextEncoder().encode(utf8);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function getHeader(headers: Array<{ name: string; value: string }>, name: string): string | undefined {
  const found = headers?.find((h) => h?.name?.toLowerCase() === name.toLowerCase());
  return found?.value;
}

export async function readEmails(token: string, filter: EmailReadFilter = 'most_recent'): Promise<GmailMessageSummary[]> {
  const params = new URLSearchParams();
  params.set('labelIds', 'INBOX');
  params.set('includeSpamTrash', 'false');
  if (filter === 'most_recent') params.set('maxResults', '1');
  if (filter === 'all') params.set('maxResults', '5');
  if (filter === 'unread') {
    params.set('maxResults', '5');
    params.set('q', 'is:unread');
  }
  const listRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`, {
    headers: authHeaders(token),
  });
  if (!listRes.ok) {
    const text = await listRes.text();
    throw new Error(`Gmail list failed ${listRes.status}: ${text}`);
  }
  const list = await listRes.json();
  const messages: Array<{ id: string; threadId: string }> = list?.messages || [];
  if (!Array.isArray(messages) || messages.length === 0) return [];

  const detailed = await Promise.all(
    messages.map(async (m) => {
      const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`, {
        headers: authHeaders(token),
      });
      if (!msgRes.ok) {
        return { id: m.id, threadId: m.threadId } as GmailMessageSummary;
      }
      const msg = await msgRes.json();
      const headers = msg?.payload?.headers || [];
      return {
        id: msg?.id || m.id,
        threadId: msg?.threadId || m.threadId,
        from: getHeader(headers, 'From'),
        subject: getHeader(headers, 'Subject'),
        date: getHeader(headers, 'Date'),
        snippet: msg?.snippet,
      } as GmailMessageSummary;
    })
  );
  return detailed;
}

export async function sendEmail(token: string, recipient: string, subject: string, content: string): Promise<{ id: string; threadId?: string }> {
  const raw = `To: ${recipient}\r\nSubject: ${subject}\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${content}`;
  const body = { raw: base64UrlEncode(raw) };
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gmail send failed ${res.status}: ${text}`);
  }
  return res.json();
}

async function fetchThreadFromAddress(token: string, threadId: string): Promise<string | undefined> {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}`, { headers: authHeaders(token) });
  if (!res.ok) return undefined;
  const data = await res.json();
  const msgs: any[] = data?.messages || [];
  const last = msgs[msgs.length - 1];
  const headers = last?.payload?.headers || [];
  const from = getHeader(headers, 'From');
  if (!from) return undefined;
  // Extract email address from formats like "Name <email@x.com>"
  const match = from.match(/<([^>]+)>/);
  return match ? match[1] : from;
}

export async function replyEmail(token: string, threadId: string, messageId: string | undefined, content: string): Promise<{ id: string; threadId?: string }> {
  let toAddress: string | undefined;
  if (messageId) {
    const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=metadata&metadataHeaders=From&metadataHeaders=Message-Id`, {
      headers: authHeaders(token),
    });
    if (msgRes.ok) {
      const msg = await msgRes.json();
      const headers = msg?.payload?.headers || [];
      const from = getHeader(headers, 'From');
      const match = from?.match(/<([^>]+)>/);
      toAddress = match ? match[1] : from;
    }
  }
  if (!toAddress) {
    toAddress = await fetchThreadFromAddress(token, threadId);
  }
  const to = toAddress || 'undisclosed-recipients:;';
  const raw = `To: ${to}\r\nSubject: Re:\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${content}`;
  const body: any = { raw: base64UrlEncode(raw), threadId };
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gmail reply failed ${res.status}: ${text}`);
  }
  return res.json();
}

export interface CreateEventInput {
  title: string;
  start: string; // RFC3339
  end: string;   // RFC3339
  description?: string;
  attendees?: string[];
}

export async function createCalendarEvent(token: string, input: CreateEventInput): Promise<{ id: string }> {
  const event: any = {
    summary: input.title,
    description: input.description || '',
    start: { dateTime: input.start },
    end: { dateTime: input.end },
  };
  if (input.attendees && input.attendees.length > 0) {
    event.attendees = input.attendees.map((email) => ({ email }));
  }
  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendar create failed ${res.status}: ${text}`);
  }
  return res.json();
}

export async function deleteCalendarEvent(token: string, eventId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendar delete failed ${res.status}: ${text}`);
  }
}

export interface ListEventsParams {
  timeMin?: string; // RFC3339
  timeMax?: string; // RFC3339
  maxResults?: number;
  q?: string;
}

export async function listCalendarEvents(token: string, params: ListEventsParams = {}): Promise<any[]> {
  const query = new URLSearchParams();
  query.set('calendarId', 'primary');
  query.set('singleEvents', 'true');
  query.set('orderBy', 'startTime');
  if (params.timeMin) query.set('timeMin', params.timeMin);
  if (params.timeMax) query.set('timeMax', params.timeMax);
  if (params.maxResults) query.set('maxResults', String(params.maxResults));
  if (params.q) query.set('q', params.q);
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${query.toString()}` , {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Calendar list failed ${res.status}: ${text}`);
  }
  const data = await res.json();
  return Array.isArray(data?.items) ? data.items : [];
}


