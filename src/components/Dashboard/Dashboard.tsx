import type { Entry, Mood } from '../../types';
import { USER_NAME } from '../../constants';
import { todayStr } from '../../storage/entriesStore';
import { Card } from '../shared/Card';
import { MoodPicker } from '../shared/MoodPicker';
import { StreakTracker } from './StreakTracker';
import { MoodHeatmap } from './MoodHeatmap';
import { RecentEntries } from './RecentEntries';
import { IdealDayCard } from './IdealDayCard';

interface DashboardProps {
  entries: Entry[];
  onStartEntry: (presetMood?: Mood) => void;
  onOpenEntry: (id: string) => void;
  onOpenHistory: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}

export function Dashboard({ entries, onStartEntry, onOpenEntry, onOpenHistory }: DashboardProps) {
  const today = todayStr();
  const todayEntry = entries.find((e) => e.date === today);
  const dateLabel = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold text-ink">
          {getGreeting()}, {USER_NAME} ☀️
        </h1>
        <p className="text-ink-soft mt-1 capitalize">{dateLabel}</p>
      </div>

      <IdealDayCard />

      <Card className="bg-lavender-light border-none">
        {todayEntry ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-ink">Сегодняшняя запись уже сохранена 🎉</p>
              <p className="text-sm text-ink-soft mt-1">Можешь посмотреть или дополнить её.</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenEntry(todayEntry.id)}
              className="px-4 py-2 rounded-xl bg-lavender text-white font-medium hover:opacity-90 transition-opacity"
            >
              Открыть запись
            </button>
          </div>
        ) : (
          <>
            <p className="font-semibold text-ink mb-3">Как ты себя чувствуешь сегодня?</p>
            <MoodPicker value={null} onChange={(mood) => onStartEntry(mood)} />
            <button
              type="button"
              onClick={() => onStartEntry()}
              className="mt-4 w-full px-4 py-2.5 rounded-xl bg-peach text-white font-semibold hover:opacity-90 transition-opacity"
            >
              + Новая запись за 10 минут
            </button>
          </>
        )}
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <StreakTracker entries={entries} />
        <MoodHeatmap entries={entries} />
      </div>

      <RecentEntries entries={entries} onOpenEntry={onOpenEntry} onOpenHistory={onOpenHistory} />
    </div>
  );
}
