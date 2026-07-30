import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const HEARTBEAT_TIMEOUT_MS = 15000;
const CHECK_INTERVAL_MS = 3000;

// Personal local tool: once the browser tab stops sending heartbeats
// (closed, crashed, laptop put to sleep, ...) the dev server shuts itself
// down so it never lingers and locks the project folder on Windows.
function shutdownWhenTabCloses(): Plugin {
  let lastHeartbeat: number | null = null;

  return {
    name: 'shutdown-when-tab-closes',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__heartbeat', (_req, res) => {
        lastHeartbeat = Date.now();
        res.statusCode = 204;
        res.end();
      });

      const checkTimer = setInterval(() => {
        if (lastHeartbeat !== null && Date.now() - lastHeartbeat > HEARTBEAT_TIMEOUT_MS) {
          clearInterval(checkTimer);
          server.httpServer?.close(() => process.exit(0));
          setTimeout(() => process.exit(0), 500);
        }
      }, CHECK_INTERVAL_MS);

      server.httpServer?.once('close', () => clearInterval(checkTimer));
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), shutdownWhenTabCloses()],
})
