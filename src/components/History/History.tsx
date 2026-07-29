import { useState } from 'react';
import type { Entry } from '../../types';
import { MOOD_EMOJI } from '../../types';
import { Card } from '../shared/Card';

interface HistoryProps {
  entries: Entry[];
  onOpenEntry: (id: string) => void;
  onBack: () => void;
}

function formatDateRu(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function History({ entries, onOpenEntry, onBack }: HistoryProps) {
  const [query, setQuery] = useState('');

  const filtered = entries.filter((e) => {
    if (!query.trim()) return true;
    const haystack = [e.brainDump, ...e.gratitude, ...e.goals.flatMap((g) => [g.goal, g.action])]
      .join(' ')
      .toLowerCase();
    return haystack.includes(query.trim().toLowerCase()) || e.date.includes(query.trim());
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <button type="button" onClick={onBack} className="text-sm text-ink-soft hover:text-ink">
            ← Дашборд
          </button>
          <h1 className="text-2xl font-bold text-ink mt-1">История записей</h1>
        </div>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск по записям..."
        className="rounded-xl border border-black/10 bg-card px-4 py-2.5 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-lavender"
      />

      {filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-soft">Ничего не найдено.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onOpenEntry(entry.id)}
              className="text-left"
            >
              <Card className="hover:bg-cream transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none mt-0.5">
                    {entry.mood ? MOOD_EMOJI[entry.mood] : '📝'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink capitalize">
                      {formatDateRu(entry.date)}
                    </span>
                    <span className="block text-sm text-ink-soft truncate mt-0.5">
                      {entry.brainDump || entry.gratitude[0] || 'Запись без текста'}
                    </span>
                    <span className="block text-xs text-ink-soft/70 mt-1">
                      {entry.gratitude.length} благодарностей ·{' '}
                      {entry.goals.filter((g) => g.goal).length} целей
                    </span>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
