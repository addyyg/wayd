import { defineConfig } from "vitest/config";

export default defineConfig({
  build: { outDir: "build" },
  server: { host: "127.0.0.1", port: 3000, proxy: { "/api": "http://127.0.0.1:3001" } },
  test: { environment: "jsdom", globals: true },
});
