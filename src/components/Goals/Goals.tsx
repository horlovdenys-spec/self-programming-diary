import { useState } from 'react';
import type { Goal } from '../../types';
import {
  addGoal,
  deleteGoal,
  getAllGoals,
  markGoalAchieved,
  unmarkGoalAchieved,
} from '../../storage/goalsStore';
import { Card } from '../shared/Card';
import { VoiceInputButton } from '../shared/VoiceInputButton';

interface GoalsProps {
  onBack: () => void;
}

function formatDateRu(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function Goals({ onBack }: GoalsProps) {
  const [goals, setGoals] = useState<Goal[]>(() => getAllGoals());
  const [newText, setNewText] = useState('');

  function refresh() {
    setGoals(getAllGoals());
  }

  function handleAdd() {
    if (!newText.trim()) return;
    addGoal(newText);
    setNewText('');
    refresh();
  }

  const active = goals.filter((g) => !g.achievedAt);
  const achieved = goals
    .filter((g) => g.achievedAt)
    .sort((a, b) => (b.achievedAt ?? '').localeCompare(a.achievedAt ?? ''));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <button type="button" onClick={onBack} className="text-sm text-ink-soft hover:text-ink">
          ← Дашборд
        </button>
        <h1 className="text-2xl font-bold text-ink mt-1">Мои цели</h1>
      </div>

      <Card>
        <h3 className="font-semibold text-ink mb-3">Добавить новую цель — реальность</h3>
        <div className="flex gap-2 items-start">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Я живу в..., я делаю..., у меня есть..."
            rows={2}
            className="flex-1 resize-none rounded-xl border border-black/10 bg-cream px-3.5 py-2.5 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-lavender"
          />
          <VoiceInputButton
            onResult={(text) => setNewText((prev) => (prev ? `${prev} ${text}` : text))}
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="mt-3 px-5 py-2 rounded-xl font-semibold bg-lavender text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          + Добавить цель
        </button>
      </Card>

      <Card>
        <h3 className="font-semibold text-ink mb-3">Мои цели ({active.length})</h3>
        {active.length === 0 ? (
          <p className="text-sm text-ink-soft">Пока нет активных целей — добавь первую выше.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {active.map((goal) => (
              <div
                key={goal.id}
                className="rounded-xl bg-cream p-3.5 flex items-start justify-between gap-3"
              >
                <p className="text-ink flex-1">{goal.text}</p>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      markGoalAchieved(goal.id);
                      refresh();
                    }}
                    title="Отметить как достигнутую"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-sage-light text-sage hover:bg-sage hover:text-white transition-colors"
                  >
                    🎉 Сбылось
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteGoal(goal.id);
                      refresh();
                    }}
                    title="Удалить"
                    className="grid place-items-center size-8 rounded-lg text-ink-soft/50 hover:bg-coral-light hover:text-coral transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="bg-sage-light border-none">
        <h3 className="font-semibold text-ink mb-3">Достигнутая реальность 🎉 ({achieved.length})</h3>
        {achieved.length === 0 ? (
          <p className="text-sm text-ink-soft">
            Здесь будут собираться цели, которые уже сбылись — отмечай их выше.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {achieved.map((goal) => (
              <div key={goal.id} className="rounded-xl bg-card p-3.5">
                <p className="text-ink">{goal.text}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-ink-soft">
                    Сбылось {goal.achievedAt && formatDateRu(goal.achievedAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      unmarkGoalAchieved(goal.id);
                      refresh();
                    }}
                    className="text-xs text-ink-soft hover:text-ink underline"
                  >
                    Вернуть в активные
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
