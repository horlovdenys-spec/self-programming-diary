import type { Entry } from '../types';

const STORAGE_KEY = 'spd_entries_v1';

export function todayStr(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getAllEntries(): Entry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Entry[];
    return parsed.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

function persist(entries: Entry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntryById(id: string): Entry | undefined {
  return getAllEntries().find((e) => e.id === id);
}

export function getEntryByDate(date: string): Entry | undefined {
  return getAllEntries().find((e) => e.date === date);
}

export function saveEntry(entry: Entry): void {
  const entries = getAllEntries();
  const existingIndex = entries.findIndex((e) => e.id === entry.id);
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  persist(entries);
}

export function deleteEntry(id: string): void {
  const entries = getAllEntries().filter((e) => e.id !== id);
  persist(entries);
}

export function createEntryId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Consecutive days with an entry, counting back from today (allows today to be missing so far). */
export function computeCurrentStreak(entries: Entry[]): number {
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const cursor = new Date();

  if (!dates.has(todayStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dates.has(todayStr(cursor))) {
      return 0;
    }
  }

  while (dates.has(todayStr(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export interface WeekDayStatus {
  label: string;
  date: string;
  hasEntry: boolean;
  isToday: boolean;
}

/** Mon-Sun status for the current week. */
export function computeWeekStatus(entries: Entry[]): WeekDayStatus[] {
  const dates = new Set(entries.map((e) => e.date));
  const now = new Date();
  const dayIndex = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayIndex);

  const today = todayStr(now);

  return WEEK_DAYS.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = todayStr(d);
    return {
      label,
      date: dateStr,
      hasEntry: dates.has(dateStr),
      isToday: dateStr === today,
    };
  });
}

export interface MonthDay {
  date: string;
  day: number;
  mood: Entry['mood'];
  hasEntry: boolean;
}

/** Days of the given month (defaults to current) with mood for heatmap rendering. */
export function computeMonthHeatmap(
  entries: Entry[],
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth(),
): MonthDay[] {
  const byDate = new Map(entries.map((e) => [e.date, e]));
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: MonthDay[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = todayStr(new Date(year, month, day));
    const entry = byDate.get(date);
    result.push({
      date,
      day,
      mood: entry?.mood ?? null,
      hasEntry: Boolean(entry),
    });
  }
  return result;
}
