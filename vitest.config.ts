import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    env: {
      SESSION_SECRET: "test-secret-used-only-by-the-test-suite",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "server-only" lancia un errore fuori da un vero request Next.js: nei
      // test lo sostituiamo con un modulo vuoto (vedi tests/stubs/server-only.ts).
      "server-only": path.resolve(__dirname, "./tests/stubs/server-only.ts"),
    },
  },
});
