import type { Entry } from '../../types';
import { MOOD_EMOJI } from '../../types';
import { Card } from '../shared/Card';

interface RecentEntriesProps {
  entries: Entry[];
  onOpenEntry: (id: string) => void;
  onOpenHistory: () => void;
}

function formatDateRu(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export function RecentEntries({ entries, onOpenEntry, onOpenHistory }: RecentEntriesProps) {
  const recent = entries.slice(0, 4);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-ink">Последние записи</h3>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={onOpenHistory}
            className="text-sm text-peach hover:underline"
          >
            Все записи →
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-ink-soft">
          Пока нет ни одной записи. Начни первую прямо сейчас — это займёт всего 10 минут.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recent.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => onOpenEntry(entry.id)}
                className="w-full text-left flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-cream transition-colors"
              >
                <span className="text-xl leading-none mt-0.5">
                  {entry.mood ? MOOD_EMOJI[entry.mood] : '📝'}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink capitalize">
                    {formatDateRu(entry.date)}
                  </span>
                  <span className="block text-sm text-ink-soft truncate">
                    {entry.brainDump || entry.gratitude[0] || 'Запись без текста'}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
