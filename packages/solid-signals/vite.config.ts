import { defineConfig } from "vitest/config";
import codspeedPlugin from "@codspeed/vitest-plugin";

export default defineConfig({
  plugins: [codspeedPlugin()],
  define: {
    __DEV__: "true",
    __TEST__: "true"
  },
  test: {
    globals: true,
    dir: "./tests"
  }
});
