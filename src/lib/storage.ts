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

// New: Ticketing & Shows
export type Show = {
  id: number;
  title: string;
  date: string; // ISO datetime or date
  totalSeats: number;
};

export type Booking = {
  id: number;
  showId: number;
  qty: number;
  createdAt: string;
};

const KEYS = {
  speakers: "speakeasy:speakers",
  submissions: "speakeasy:submissions",
  agenda: "speakeasy:agenda",
  // New keys
  shows: "speakeasy:shows",
  bookings: "speakeasy:bookings",
  managerPin: "speakeasy:manager:pin",
  managerAuthed: "speakeasy:manager:authed",
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

// ------------------------------
// Manager PIN demo auth helpers
// ------------------------------
export function getManagerPin(): string | null {
  return read<string | null>(KEYS.managerPin, null);
}

export function setManagerPin(pin: string) {
  write<string | null>(KEYS.managerPin, pin);
}

export function isManagerAuthed(): boolean {
  return read<boolean>(KEYS.managerAuthed, false);
}

export function setManagerAuthed(v: boolean) {
  write<boolean>(KEYS.managerAuthed, v);
}

// ------------------------------
// Shows & Bookings
// ------------------------------
export function getShows(): Show[] {
  return read<Show[]>(KEYS.shows, []);
}

export function saveShow(s: Omit<Show, "id">): Show {
  const list = getShows();
  const next: Show = { id: Date.now(), ...s };
  list.push(next);
  write(KEYS.shows, list);
  return next;
}

export function deleteShow(id: number) {
  const list = getShows().filter((s) => s.id !== id);
  write(KEYS.shows, list);
  // Also remove related bookings
  const bookings = getAllBookings().filter((b) => b.showId !== id);
  write(KEYS.bookings, bookings);
}

function getAllBookings(): Booking[] {
  return read<Booking[]>(KEYS.bookings, []);
}

function setAllBookings(list: Booking[]) {
  write(KEYS.bookings, list);
}

export function getBookingsByShow(showId: number): Booking[] {
  return getAllBookings().filter((b) => b.showId === showId);
}

export function getBookedSeats(showId: number): number {
  return getBookingsByShow(showId).reduce((sum, b) => sum + b.qty, 0);
}

export function getAvailableSeats(showId: number): number {
  const show = getShows().find((s) => s.id === showId);
  if (!show) return 0;
  return Math.max(0, show.totalSeats - getBookedSeats(showId));
}

export function bookSeats(showId: number, qty: number): { ok: boolean; error?: string; booking?: Booking } {
  const shows = getShows();
  const show = shows.find((s) => s.id === showId);
  if (!show) return { ok: false, error: "Show not found" };
  if (qty <= 0) return { ok: false, error: "Quantity must be positive" };
  const available = getAvailableSeats(showId);
  if (qty > available) return { ok: false, error: `Only ${available} seats left` };
  const list = getAllBookings();
  const next: Booking = { id: Date.now(), showId, qty, createdAt: new Date().toISOString() };
  list.push(next);
  setAllBookings(list);
  return { ok: true, booking: next };
}

export function refundSeats(bookingId: number): { ok: boolean; error?: string } {
  const list = getAllBookings();
  const idx = list.findIndex((b) => b.id === bookingId);
  if (idx < 0) return { ok: false, error: "Booking not found" };
  list.splice(idx, 1);
  setAllBookings(list);
  return { ok: true };
}