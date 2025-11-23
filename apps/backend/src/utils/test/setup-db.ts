import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { DbClient } from "#/lib/db";
import * as schema from "../../db/schema";

let container: StartedPostgreSqlContainer | null = null;
let testDb: DbClient | null = null;
let client: ReturnType<typeof postgres> | null = null;

const テストDBを作成する = (pgClient: ReturnType<typeof postgres>) => {
  const baseDb = drizzle(pgClient, { schema });

  return Object.assign(baseDb, {
    $withAuth: () => baseDb,
    batch: async () => {
      throw new Error("バッチ処理は非対応だよ");
    },
  });
};

export const テストDBを起動する = async () => {
  if (container && testDb) {
    return testDb;
  }

  container = await new PostgreSqlContainer("postgres:16-alpine")
    .withExposedPorts(5432)
    .start();

  client = postgres(container.getConnectionUri());

  const migrationsDir = join(__dirname, "../db/migrations");
  const migrationFiles = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const sqlContent = await readFile(join(migrationsDir, file), "utf-8");
    await client.unsafe(sqlContent);
  }

  return テストDBを作成する(client);
};

export const テストDBをリセットする = async (db: DbClient) => {
  const tableNames = Object.values(schema)
    .filter((table) => table && typeof table === "object" && "dbName" in table)
    .map((table) => table.dbName);

  for (const tableName of tableNames) {
    await db.execute(sql.raw(`TRUNCATE TABLE "${tableName}" CASCADE`));
  }
};

export const テストDBを削除する = async () => {
  if (container) {
    await container.stop();
    container = null;
    testDb = null;
    client = null;
  }
};
