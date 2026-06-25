import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import postgres from "postgres";
import { テスト用データベースURL } from "./database-url";

export default async function setup(): Promise<void> {
  const client = postgres(テスト用データベースURL(), { max: 1 });

  try {
    await client.unsafe(
      "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;",
    );

    const migrationsDir = join(process.cwd(), "src/db/migrations");
    const migrationFiles = (await readdir(migrationsDir))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const sqlContent = await readFile(join(migrationsDir, file), "utf-8");
      await client.unsafe(sqlContent);
    }
  } finally {
    await client.end();
  }
}
