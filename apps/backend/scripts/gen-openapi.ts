import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

process.env.DATABASE_URL ||= "postgresql://user:password@localhost:5432/pdcxa";

const { openApiDocument } = await import("../src/index");

const outputPath = fileURLToPath(new URL("../openapi.json", import.meta.url));

writeFileSync(outputPath, `${JSON.stringify(openApiDocument(), null, 2)}\n`);

console.info(`openapi.json written to ${outputPath}`);
