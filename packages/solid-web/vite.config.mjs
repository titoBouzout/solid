/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";
import { resolve } from "path";

const rootDir = resolve(__dirname);

export default defineConfig({
  plugins: [solidPlugin()],
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
    transformMode: { web: [/\.[jt]sx?$/] },
    // otherwise, solid would be loaded twice:
    deps: { registerNodeLoader: true },
    // if you have few tests, try commenting one
    // or both out to improve performance:
    threads: false,
    isolate: false,
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
