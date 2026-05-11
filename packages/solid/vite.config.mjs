/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import { resolve } from "path";

const rootDir = resolve(__dirname);

export default defineConfig({
  server: {
    port: 3000
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["**/*.d.ts", "src/server/*.ts"]
    },
    environment: "jsdom",
    pool: "threads",
    globals: true,
    exclude: ["**/node_modules/**", "archived_tests/**"]
  },
  resolve: {
    conditions: ["development", "browser"],
    alias: {
      "solid-js": [resolve(rootDir, "../../packages/solid/src")]
    }
  }
});
