// Tells the local dev server (see vite.config.ts) that this tab is still
// open. Stops firing the moment the tab is closed, refreshed away from, or
// the browser crashes/loses power — the server notices the silence and
// shuts itself down. No-op in a production build.
const HEARTBEAT_INTERVAL_MS = 2000;

if (import.meta.env.DEV) {
  const sendHeartbeat = () => fetch('/__heartbeat').catch(() => {});
  sendHeartbeat();
  setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
}
