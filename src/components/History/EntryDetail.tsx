import type { Entry } from '../../types';
import { MOOD_EMOJI, MOOD_LABELS } from '../../types';
import { Card } from '../shared/Card';

interface EntryDetailProps {
  entry: Entry;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDateRu(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function EntryDetail({ entry, onBack, onEdit, onDelete }: EntryDetailProps) {
  function handleDelete() {
    if (window.confirm('Удалить эту запись? Это действие нельзя отменить.')) {
      onDelete();
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm text-ink-soft hover:text-ink">
          ← Назад
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-lavender-light text-lavender hover:bg-lavender hover:text-white transition-colors"
          >
            Редактировать
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-coral-light text-coral hover:bg-coral hover:text-white transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-ink capitalize">{formatDateRu(entry.date)}</h1>
        {entry.mood && (
          <p className="text-ink-soft mt-1">
            {MOOD_EMOJI[entry.mood]} {MOOD_LABELS[entry.mood]}
          </p>
        )}
      </div>

      {entry.brainDump && (
        <Card>
          <h3 className="font-semibold text-ink mb-2">Разгрузка мыслей</h3>
          <p className="text-ink-soft whitespace-pre-wrap">{entry.brainDump}</p>
        </Card>
      )}

      {entry.gratitude.length > 0 && (
        <Card>
          <h3 className="font-semibold text-ink mb-3">Благодарность</h3>
          <ul className="flex flex-col gap-2">
            {entry.gratitude.map((item, i) => (
              <li key={i} className="flex gap-2 text-ink-soft">
                <span className="text-sage">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {entry.goals.length > 0 && (
        <Card>
          <h3 className="font-semibold text-ink mb-3">Цели и действия на сегодня</h3>
          <div className="flex flex-col gap-4">
            {entry.goals.map((g, i) => (
              <div key={i} className="rounded-xl bg-cream p-3.5">
                {g.goal && <p className="text-ink">{g.goal}</p>}
                {g.action && (
                  <p className="text-sm text-peach mt-1.5 flex gap-1.5">
                    <span>→</span>
                    {g.action}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
