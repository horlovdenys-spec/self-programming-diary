import { useState } from 'react';
import { getIdealDay, saveIdealDay } from '../../storage/idealDayStore';
import { Card } from '../shared/Card';
import { VoiceInputButton } from '../shared/VoiceInputButton';

export function IdealDayCard() {
  const [savedText, setSavedText] = useState(() => getIdealDay());
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(savedText);

  function startEditing() {
    setDraft(savedText);
    setIsEditing(true);
  }

  function handleSave() {
    const trimmed = draft.trim();
    saveIdealDay(trimmed);
    setSavedText(trimmed);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  return (
    <Card className="bg-peach-light/40 border-none">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-ink">Мой идеальный день</h3>
        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="text-sm font-medium text-peach hover:underline"
          >
            {savedText ? 'Редактировать' : 'Написать'}
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <div className="flex gap-2 items-start">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Опиши, каким выглядит твой идеальный день — во всех деталях, будто он уже наступил..."
              rows={5}
              autoFocus
              className="flex-1 resize-none rounded-xl border border-black/10 bg-card px-3.5 py-2.5 text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-peach"
            />
            <VoiceInputButton
              onResult={(text) => setDraft((prev) => (prev ? `${prev} ${text}` : text))}
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl text-sm font-medium text-ink-soft hover:bg-cream-dark transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-peach text-white hover:opacity-90 transition-opacity"
            >
              Сохранить
            </button>
          </div>
        </>
      ) : savedText ? (
        <p className="text-ink whitespace-pre-wrap">{savedText}</p>
      ) : (
        <p className="text-sm text-ink-soft">
          Опиши, каким выглядит твой идеальный день — и возвращайся сюда, чтобы не терять фокус.
        </p>
      )}
    </Card>
  );
}
