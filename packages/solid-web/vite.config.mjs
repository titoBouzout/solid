/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import codspeedPlugin from "@codspeed/vitest-plugin";
import { resolve } from "path";

const rootDir = resolve(__dirname);

// Bench mode under CodSpeed's Valgrind instrumentation runs each iteration
// 10-100× slower than normal, which can stall the threads-pool RPC heartbeat
// past its timeout. Use forks+singleFork for benches; threads stays for tests.
const isBench = process.argv.includes("bench");

export default defineConfig({
  plugins: [solidPlugin(), codspeedPlugin()],
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
    pool: isBench ? "forks" : "threads",
    poolOptions: isBench ? { forks: { singleFork: true } } : undefined,
    testTimeout: isBench ? 120_000 : 5_000,
    hookTimeout: isBench ? 120_000 : 10_000,
    teardownTimeout: isBench ? 120_000 : 10_000,
    globals: true,
    exclude: ["**/node_modules/**", "wip_tests/**", "test/server/**", "test/hydration/**"],
    // Bench mode reads `benchmark.exclude` separately from `test.exclude`.
    // Without this, `pnpm bench` would pick up the SSR Tier-1 benches under
    // the jsdom env + client-build aliases, which silently produces wrong
    // numbers (server build is loaded as client). SSR benches run via
    // `pnpm bench:server` against `vite.config.server-bench.mjs` instead.
    benchmark: {
      exclude: ["**/node_modules/**", "test/server/**", "test/hydration/**"]
    }
  },
  resolve: {
    conditions: ["development", "browser"],
    alias: {
      rxcore: [resolve(rootDir, "../../packages/solid-web/src/core")],
    }
  }
});
