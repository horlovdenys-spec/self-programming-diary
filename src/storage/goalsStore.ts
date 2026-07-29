import type { Goal } from '../types';
import { createEntryId } from './entriesStore';

const STORAGE_KEY = 'spd_goals_v1';

export function getAllGoals(): Goal[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Goal[];
  } catch {
    return [];
  }
}

function persist(goals: Goal[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

export function addGoal(text: string): void {
  const trimmed = text.trim();
  if (!trimmed) return;
  const goals = getAllGoals();
  goals.unshift({
    id: createEntryId(),
    text: trimmed,
    createdAt: new Date().toISOString(),
    achievedAt: null,
  });
  persist(goals);
}

export function markGoalAchieved(id: string): void {
  persist(
    getAllGoals().map((g) => (g.id === id ? { ...g, achievedAt: new Date().toISOString() } : g)),
  );
}

export function unmarkGoalAchieved(id: string): void {
  persist(getAllGoals().map((g) => (g.id === id ? { ...g, achievedAt: null } : g)));
}

export function deleteGoal(id: string): void {
  persist(getAllGoals().filter((g) => g.id !== id));
}
