import { defineConfig } from "vitest/config";
import codspeedPlugin from "@codspeed/vitest-plugin";

// Bench mode under CodSpeed's Valgrind instrumentation runs each iteration
// 10-100× slower than normal. The default threads-pool worker-to-main RPC
// heartbeat times out before the next `onTaskUpdate` ping fires, surfacing
// as a noisy (but non-fatal) "Timeout calling onTaskUpdate" unhandled error.
// Forks pool with a single fork uses child_process IPC instead, which has
// no such heartbeat constraint.
const isBench = process.argv.includes("bench");

export default defineConfig({
  plugins: [codspeedPlugin()],
  define: {
    __DEV__: "true",
    __TEST__: "true"
  },
  test: {
    globals: true,
    dir: "./tests",
    pool: isBench ? "forks" : "threads",
    poolOptions: isBench ? { forks: { singleFork: true } } : undefined,
    testTimeout: isBench ? 120_000 : 5_000,
    hookTimeout: isBench ? 120_000 : 10_000,
    teardownTimeout: isBench ? 120_000 : 10_000
  }
});
