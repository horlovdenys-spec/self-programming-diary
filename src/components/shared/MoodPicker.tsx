import { MOOD_EMOJI, MOOD_LABELS, MOOD_ORDER, type Mood } from '../../types';

interface MoodPickerProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {MOOD_ORDER.map((mood) => {
        const active = value === mood;
        return (
          <button
            key={mood}
            type="button"
            onClick={() => onChange(mood)}
            className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-2 min-w-[68px] border transition-colors ${
              active
                ? 'bg-sage-light border-sage text-ink'
                : 'bg-cream border-transparent text-ink-soft hover:bg-cream-dark'
            }`}
          >
            <span className="text-2xl leading-none">{MOOD_EMOJI[mood]}</span>
            <span className="text-xs font-medium">{MOOD_LABELS[mood]}</span>
          </button>
        );
      })}
    </div>
  );
}
