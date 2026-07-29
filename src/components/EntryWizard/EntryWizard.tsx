import { useState } from 'react';
import type { Entry, GoalAction, Mood } from '../../types';
import { createEntryId, getEntryById, saveEntry, todayStr } from '../../storage/entriesStore';
import { Card } from '../shared/Card';
import { MoodPicker } from '../shared/MoodPicker';
import { StepBrainDump } from './StepBrainDump';
import { StepGratitude } from './StepGratitude';
import { StepGoalsAndActions } from './StepGoalsAndActions';

const STEP_TITLES = ['Настроение', 'Мысли', 'Благодарность', 'Цели и действия'];
const EMPTY_GOALS: GoalAction[] = Array.from({ length: 5 }, () => ({ goal: '', action: '' }));
const EMPTY_GRATITUDE: string[] = Array.from({ length: 5 }, () => '');

interface EntryWizardProps {
  presetMood?: Mood;
  editEntryId?: string;
  onCancel: () => void;
  onSaved: (id: string) => void;
}

export function EntryWizard({ presetMood, editEntryId, onCancel, onSaved }: EntryWizardProps) {
  const existing = editEntryId ? getEntryById(editEntryId) : undefined;

  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<Mood | null>(existing?.mood ?? presetMood ?? null);
  const [brainDump, setBrainDump] = useState(existing?.brainDump ?? '');
  const [gratitude, setGratitude] = useState<string[]>(existing?.gratitude ?? EMPTY_GRATITUDE);
  const [goals, setGoals] = useState<GoalAction[]>(existing?.goals ?? EMPTY_GOALS);

  const isLastStep = step === STEP_TITLES.length - 1;
  const canGoNext =
    step === 0
      ? mood !== null
      : step === 2
        ? gratitude.some((g) => g.trim())
        : step === 3
          ? goals.some((g) => g.goal.trim())
          : true;

  function handleNext() {
    if (isLastStep) {
      handleSave();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleSave() {
    const entry: Entry = {
      id: existing?.id ?? createEntryId(),
      date: existing?.date ?? todayStr(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      mood,
      brainDump: brainDump.trim(),
      gratitude: gratitude.map((g) => g.trim()).filter(Boolean),
      goals: goals
        .map((g) => ({ goal: g.goal.trim(), action: g.action.trim() }))
        .filter((g) => g.goal || g.action),
    };
    saveEntry(entry);
    onSaved(entry.id);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-ink-soft hover:text-ink"
          >
            ← Отмена
          </button>
          <span className="text-sm text-ink-soft">
            Шаг {step + 1} из {STEP_TITLES.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-cream-dark overflow-hidden">
          <div
            className="h-full bg-lavender rounded-full transition-all"
            style={{ width: `${((step + 1) / STEP_TITLES.length) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold text-ink mb-1">Как ты себя чувствуешь?</h2>
            <p className="text-sm text-ink-soft mb-4">
              Отметь своё сегодняшнее настроение — это поможет увидеть закономерности со временем.
            </p>
            <MoodPicker value={mood} onChange={setMood} />
          </div>
        )}
        {step === 1 && <StepBrainDump value={brainDump} onChange={setBrainDump} />}
        {step === 2 && <StepGratitude items={gratitude} onChange={setGratitude} />}
        {step === 3 && <StepGoalsAndActions goals={goals} onChange={setGoals} />}
      </Card>

      <div className="flex justify-between">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="px-5 py-2.5 rounded-xl font-medium text-ink-soft disabled:opacity-0 hover:bg-cream-dark transition-colors"
        >
          Назад
        </button>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl font-semibold bg-peach text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {isLastStep ? 'Сохранить запись' : 'Далее'}
        </button>
      </div>
    </div>
  );
}
