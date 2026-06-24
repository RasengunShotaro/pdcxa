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
    exclude: [...configDefaults.exclude, "**/__fixtures__/**"],
  },
});
