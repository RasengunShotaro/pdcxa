import { defineConfig } from "orval";

export default defineConfig({
  pdcxa: {
    input: {
      target: "../backend/openapi.json",
    },
    output: {
      mode: "split",
      target: "src/schema/api.ts",
      schemas: "src/schema/models",
      tsconfig: "./tsconfig.json",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/lib/orval-fetcher.ts",
          name: "orvalFetch",
        },
        header: false,
      },
      mock: {
        generators: [
          {
            type: "msw",
            useExamples: true,
          },
        ],
      },
      clean: true,
    },
  },
});
