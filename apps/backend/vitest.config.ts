import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "#": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    env: {
      DATABASE_URL: "postgres://test:test@localhost:5432/test",
    },
    globalSetup: ["./src/utils/test/global-setup.ts"],
    fileParallelism: false,
    exclude: [...configDefaults.exclude, "**/__fixtures__/**"],
  },
});
