import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Vite does not apply tsconfig paths, so map the `src/*` alias explicitly
    alias: { src: fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    // Unit tests only; browser specs live in e2e/ and run under Playwright
    include: ["src/**/*.test.ts"],
  },
});
