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
        operations: {
          fetchPdImage: {
            mock: {
              data: () =>
                Uint8Array.from(
                  atob(
                    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                  ),
                  (char) => char.charCodeAt(0),
                ).buffer,
            },
          },
        },
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
