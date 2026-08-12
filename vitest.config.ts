import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.ts"],
    env: {
      NODE_ENV: "test",
    },

    /* 
      Optional: Isolation configuration for database integration queries.
      If using postgres, this config keeps from running tests in parallel 
      tor prevent race conditions.
    */
    /* >>> Uncomment if using postgres */
    /* fileParallelism: false,
    maxWorkers: 1,
    isolate: false, */
    /* <<< */
  },
});
