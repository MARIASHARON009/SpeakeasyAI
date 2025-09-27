export type Speaker = {
  id: number;
  name: string;
  email: string;
  bio?: string;
};

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: number;
  speakerId: number;
  title: string;
  abstract: string;
  track: string;
  status: SubmissionStatus;
  createdAt: string;
};

export type AgendaItem = {
  id: number;
  submissionId: number;
  room: string;
  start: string; // ISO datetime
  end: string;   // ISO datetime
};

const KEYS = {
  speakers: "speakeasy:speakers",
  submissions: "speakeasy:submissions",
  agenda: "speakeasy:agenda",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    console.warn("storage read error", e);
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("storage write error", e);
  }
}

export function getSpeakers(): Speaker[] {
  return read<Speaker[]>(KEYS.speakers, []);
}

export function saveSpeaker(s: Omit<Speaker, "id">): Speaker {
  const list = getSpeakers();
  const next: Speaker = { id: Date.now(), ...s };
  list.push(next);
  write(KEYS.speakers, list);
  return next;
}

export function getSubmissions(): Submission[] {
  return read<Submission[]>(KEYS.submissions, []);
}

export function saveSubmission(s: Omit<Submission, "id" | "status" | "createdAt">): Submission {
  const list = getSubmissions();
  const next: Submission = {
    id: Date.now(),
    status: "pending",
    createdAt: new Date().toISOString(),
    ...s,
  };
  list.push(next);
  write(KEYS.submissions, list);
  return next;
}

export function setSubmissionStatus(id: number, status: SubmissionStatus) {
  const list = getSubmissions();
  const idx = list.findIndex((x) => x.id === id);
  if (idx >= 0) {
    list[idx].status = status;
    write(KEYS.submissions, list);
  }
}

export function getAgenda(): AgendaItem[] {
  return read<AgendaItem[]>(KEYS.agenda, []);
}

export function setAgenda(items: AgendaItem[]) {
  write(KEYS.agenda, items);
}

export function addAgendaItem(item: Omit<AgendaItem, "id">): AgendaItem {
  const list = getAgenda();
  const next: AgendaItem = { id: Date.now(), ...item };
  list.push(next);
  setAgenda(list);
  return next;
}