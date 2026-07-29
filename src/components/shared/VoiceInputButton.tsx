import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface VoiceInputButtonProps {
  onResult: (text: string) => void;
}

export function VoiceInputButton({ onResult }: VoiceInputButtonProps) {
  const { supported, listening, toggle } = useSpeechRecognition({
    onFinalResult: onResult,
  });

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Голосовой ввод не поддерживается в этом браузере. Попробуйте Chrome."
        className="shrink-0 grid place-items-center size-9 rounded-full bg-cream-dark text-ink-soft/50 cursor-not-allowed"
      >
        <MicIcon />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={listening ? 'Остановить запись' : 'Надиктовать голосом'}
      aria-pressed={listening}
      className={`shrink-0 grid place-items-center size-9 rounded-full transition-colors ${
        listening
          ? 'bg-coral text-white animate-pulse'
          : 'bg-lavender-light text-lavender hover:bg-lavender hover:text-white'
      }`}
    >
      <MicIcon />
    </button>
  );
}

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19 11a7 7 0 0 1-14 0M12 18v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
