import type { Entry } from '../../types';
import { computeCurrentStreak, computeWeekStatus } from '../../storage/entriesStore';
import { Card } from '../shared/Card';

const CHALLENGE_GOAL = 21;

interface StreakTrackerProps {
  entries: Entry[];
}

export function StreakTracker({ entries }: StreakTrackerProps) {
  const streak = computeCurrentStreak(entries);
  const week = computeWeekStatus(entries);
  const progress = Math.min(100, Math.round((streak / CHALLENGE_GOAL) * 100));

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ink">Серия дней</h3>
        <span className="text-sm text-ink-soft">Цель: {CHALLENGE_GOAL} дней</span>
      </div>

      <div className="flex items-end gap-3 mb-4">
        <span className="text-4xl">🔥</span>
        <div>
          <div className="text-3xl font-bold text-peach leading-none">{streak}</div>
          <div className="text-sm text-ink-soft mt-1">
            {streak === 1 ? 'день подряд' : 'дней подряд'}
          </div>
        </div>
      </div>

      <div className="h-2 rounded-full bg-cream-dark overflow-hidden mb-4">
        <div
          className="h-full bg-peach rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between">
        {week.map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-1.5">
            <span className="text-xs text-ink-soft">{day.label}</span>
            <span
              className={`grid place-items-center size-7 rounded-full text-sm ${
                day.hasEntry
                  ? 'bg-sage text-white'
                  : day.isToday
                    ? 'border-2 border-dashed border-peach text-peach'
                    : 'bg-cream-dark text-ink-soft/40'
              }`}
            >
              {day.hasEntry ? '✓' : ''}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
