import { defineConfig } from "@playwright/test";

const PORT = 3123;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  // Own port so the run never collides with a dev server already open
  use: { baseURL: BASE_URL },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    // Direct binary call so Playwright can kill the whole server on any exit
    command: `./node_modules/.bin/next dev --turbopack --port ${PORT}`,
    url: BASE_URL,
    // Never attach to someone else's server
    reuseExistingServer: false,
    stdout: "pipe",
    stderr: "pipe",
    gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
    env: {
      // Own build dir so the user's `.next` is never touched
      NEXT_DIST_DIR: ".next-e2e",
      NEXT_TELEMETRY_DISABLED: "1",
    },
    timeout: 120_000,
  },
});
