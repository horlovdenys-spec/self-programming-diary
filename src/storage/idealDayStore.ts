const STORAGE_KEY = 'spd_ideal_day_v1';

export function getIdealDay(): string {
  return localStorage.getItem(STORAGE_KEY) ?? '';
}

export function saveIdealDay(text: string): void {
  localStorage.setItem(STORAGE_KEY, text);
}
