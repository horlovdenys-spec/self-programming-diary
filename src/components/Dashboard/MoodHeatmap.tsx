import type { Entry, Mood } from '../../types';
import { computeMonthHeatmap } from '../../storage/entriesStore';
import { Card } from '../shared/Card';

const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

function moodClass(mood: Mood | null): string {
  switch (mood) {
    case 'overjoyed':
    case 'happy':
      return 'bg-sage text-white';
    case 'neutral':
      return 'bg-peach-light text-peach';
    case 'sad':
    case 'angry':
      return 'bg-coral text-white';
    default:
      return 'bg-cream-dark text-ink-soft/40';
  }
}

interface MoodHeatmapProps {
  entries: Entry[];
}

export function MoodHeatmap({ entries }: MoodHeatmapProps) {
  const now = new Date();
  const days = computeMonthHeatmap(entries, now.getFullYear(), now.getMonth());
  const firstDayOffset = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7;
  const leadingBlanks = Array.from({ length: firstDayOffset });

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ink">Настроение за месяц</h3>
        <span className="text-sm text-ink-soft">
          {MONTH_NAMES[now.getMonth()]} {now.getFullYear()}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {leadingBlanks.map((_, i) => (
          <div key={`b-${i}`} />
        ))}
        {days.map((d) => (
          <div
            key={d.date}
            title={d.date}
            className={`aspect-square rounded-md grid place-items-center text-[11px] font-medium ${moodClass(d.mood)}`}
          >
            {d.day}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-ink-soft">
        <LegendDot className="bg-sage" label="Хорошо" />
        <LegendDot className="bg-peach-light" label="Нормально" />
        <LegendDot className="bg-coral" label="Тяжело" />
        <LegendDot className="bg-cream-dark" label="Нет записи" />
      </div>
    </Card>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}
