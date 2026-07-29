import type { GoalAction } from '../../types';
import { VoiceInputButton } from '../shared/VoiceInputButton';

interface StepGoalsAndActionsProps {
  goals: GoalAction[];
  onChange: (goals: GoalAction[]) => void;
}

export function StepGoalsAndActions({ goals, onChange }: StepGoalsAndActionsProps) {
  function setGoal(index: number, field: keyof GoalAction, value: string) {
    const next = goals.map((g, i) => (i === index ? { ...g, [field]: value } : g));
    onChange(next);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink mb-1">Дневник самопрограммирования</h2>
      <p className="text-sm text-ink-soft mb-4">
        Опиши 5 своих желаний в настоящем времени, будто они уже сбылись (горизонт 1–3 года). Под
        каждым — конкретное действие, которое приблизит тебя к этому уже сегодня.
      </p>

      <div className="flex flex-col gap-4">
        {goals.map((goal, index) => (
          <div key={index} className="rounded-2xl border border-black/10 bg-cream p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="grid place-items-center size-7 shrink-0 rounded-full bg-lavender-light text-lavender text-sm font-semibold">
                {index + 1}
              </span>
              <label className="text-sm font-medium text-ink">Моя реальность</label>
            </div>
            <div className="flex gap-2 items-start mb-3">
              <textarea
                value={goal.goal}
                onChange={(e) => setGoal(index, 'goal', e.target.value)}
                placeholder="Я живу в..., я делаю..., у меня есть..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-black/10 bg-card px-3.5 py-2.5 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-lavender"
              />
              <VoiceInputButton
                onResult={(text) =>
                  setGoal(index, 'goal', goal.goal ? `${goal.goal} ${text}` : text)
                }
              />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-peach">→</span>
              <label className="text-sm font-medium text-ink">Что сделаю сегодня</label>
            </div>
            <div className="flex gap-2 items-start">
              <textarea
                value={goal.action}
                onChange={(e) => setGoal(index, 'action', e.target.value)}
                placeholder="Конкретный шаг на сегодня..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-black/10 bg-peach-light/40 px-3.5 py-2.5 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-peach"
              />
              <VoiceInputButton
                onResult={(text) =>
                  setGoal(index, 'action', goal.action ? `${goal.action} ${text}` : text)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
