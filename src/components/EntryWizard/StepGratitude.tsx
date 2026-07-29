import { VoiceInputButton } from '../shared/VoiceInputButton';

const MIN_ITEMS = 5;
const MAX_ITEMS = 10;

interface StepGratitudeProps {
  items: string[];
  onChange: (items: string[]) => void;
}

export function StepGratitude({ items, onChange }: StepGratitudeProps) {
  const filledCount = items.filter((i) => i.trim()).length;

  function setItem(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  function addItem() {
    if (items.length < MAX_ITEMS) onChange([...items, '']);
  }

  function removeItem(index: number) {
    if (items.length <= MIN_ITEMS) return;
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-ink mb-1">Практика благодарности</h2>
      <p className="text-sm text-ink-soft mb-1">
        Запиши 5–10 вещей, за которые ты благодарна прямо сейчас — это переключает фокус на
        ощущение достатка.
      </p>
      <p className="text-xs font-medium text-sage mb-4">Заполнено: {filledCount} из {MIN_ITEMS}</p>

      <div className="flex flex-col gap-2.5">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <span className="grid place-items-center size-8 shrink-0 rounded-full bg-sage-light text-sage text-sm font-semibold">
              {index + 1}
            </span>
            <input
              value={item}
              onChange={(e) => setItem(index, e.target.value)}
              placeholder="Я благодарна за..."
              className="flex-1 rounded-xl border border-black/10 bg-cream px-4 py-2.5 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-sage"
            />
            <VoiceInputButton onResult={(text) => setItem(index, item ? `${item} ${text}` : text)} />
            {items.length > MIN_ITEMS && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                aria-label="Удалить пункт"
                className="shrink-0 grid place-items-center size-8 rounded-full text-ink-soft/50 hover:bg-coral-light hover:text-coral transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {items.length < MAX_ITEMS && (
        <button
          type="button"
          onClick={addItem}
          className="mt-3 text-sm font-medium text-sage hover:underline"
        >
          + Добавить ещё пункт
        </button>
      )}
    </div>
  );
}
