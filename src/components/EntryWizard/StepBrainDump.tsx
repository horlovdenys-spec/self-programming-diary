import { VoiceInputButton } from '../shared/VoiceInputButton';

interface StepBrainDumpProps {
  value: string;
  onChange: (value: string) => void;
}

export function StepBrainDump({ value, onChange }: StepBrainDumpProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-ink mb-1">Разгрузка мыслей</h2>
      <p className="text-sm text-ink-soft mb-4">
        Выпиши всё, что крутится в голове: тревоги, страхи, навязчивые мысли — или просто их
        отсутствие. Это очищает голову перед тем, как формулировать желания.
      </p>
      <div className="flex gap-2 items-start">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Сегодня я думаю о..."
          rows={6}
          className="flex-1 resize-none rounded-2xl border border-black/10 bg-cream p-4 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-lavender"
        />
        <VoiceInputButton
          onResult={(text) => onChange(value ? `${value} ${text}` : text)}
        />
      </div>
    </div>
  );
}
