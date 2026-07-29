import { useState } from 'react';
import type { Entry, Mood } from './types';
import { deleteEntry, getAllEntries } from './storage/entriesStore';
import { Dashboard } from './components/Dashboard/Dashboard';
import { EntryWizard } from './components/EntryWizard/EntryWizard';
import { History } from './components/History/History';
import { EntryDetail } from './components/History/EntryDetail';

type Screen = 'dashboard' | 'wizard' | 'history' | 'detail';

function App() {
  const [entries, setEntries] = useState<Entry[]>(() => getAllEntries());
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [wizardMood, setWizardMood] = useState<Mood | undefined>(undefined);
  const [editEntryId, setEditEntryId] = useState<string | undefined>(undefined);
  const [detailEntryId, setDetailEntryId] = useState<string | null>(null);

  function refresh() {
    setEntries(getAllEntries());
  }

  function goToDashboard() {
    setScreen('dashboard');
    setWizardMood(undefined);
    setEditEntryId(undefined);
  }

  function startEntry(presetMood?: Mood) {
    setWizardMood(presetMood);
    setEditEntryId(undefined);
    setScreen('wizard');
  }

  function editEntry(id: string) {
    setEditEntryId(id);
    setWizardMood(undefined);
    setScreen('wizard');
  }

  function openEntry(id: string) {
    setDetailEntryId(id);
    setScreen('detail');
  }

  function handleSaved(id: string) {
    refresh();
    setDetailEntryId(id);
    setScreen('detail');
  }

  function handleDelete(id: string) {
    deleteEntry(id);
    refresh();
    goToDashboard();
  }

  const detailEntry = detailEntryId ? entries.find((e) => e.id === detailEntryId) : undefined;

  return (
    <div className="min-h-svh bg-cream">
      <header className="border-b border-black/5 bg-card/60 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <span className="text-xl">📔</span>
          <button
            type="button"
            onClick={goToDashboard}
            className="font-semibold text-ink hover:opacity-80 transition-opacity"
          >
            Дневник самопрограммирования
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {screen === 'dashboard' && (
          <Dashboard
            entries={entries}
            onStartEntry={startEntry}
            onOpenEntry={openEntry}
            onOpenHistory={() => setScreen('history')}
          />
        )}

        {screen === 'wizard' && (
          <EntryWizard
            presetMood={wizardMood}
            editEntryId={editEntryId}
            onCancel={goToDashboard}
            onSaved={handleSaved}
          />
        )}

        {screen === 'history' && (
          <History entries={entries} onOpenEntry={openEntry} onBack={goToDashboard} />
        )}

        {screen === 'detail' && detailEntry && (
          <EntryDetail
            entry={detailEntry}
            onBack={() => setScreen('history')}
            onEdit={() => editEntry(detailEntry.id)}
            onDelete={() => handleDelete(detailEntry.id)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
