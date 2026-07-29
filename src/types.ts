export type Mood = 'overjoyed' | 'happy' | 'neutral' | 'sad' | 'angry';

export interface GoalAction {
  goal: string;
  action: string;
}

export interface Goal {
  id: string;
  text: string;
  createdAt: string; // ISO timestamp
  achievedAt: string | null; // ISO timestamp, null while active
}

export interface Entry {
  id: string;
  date: string; // YYYY-MM-DD
  createdAt: string; // ISO timestamp
  mood: Mood | null;
  brainDump: string;
  gratitude: string[];
  goals: GoalAction[];
}

export const MOOD_ORDER: Mood[] = ['sad', 'angry', 'neutral', 'happy', 'overjoyed'];

export const MOOD_LABELS: Record<Mood, string> = {
  overjoyed: 'В восторге',
  happy: 'Хорошо',
  neutral: 'Нормально',
  sad: 'Грустно',
  angry: 'Злюсь',
};

export const MOOD_EMOJI: Record<Mood, string> = {
  overjoyed: '🤩',
  happy: '😊',
  neutral: '😐',
  sad: '😔',
  angry: '😠',
};
