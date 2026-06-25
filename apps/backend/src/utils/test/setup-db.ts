import { getTableName, is, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { DbClient } from "#/lib/db";
import * as schema from "../../db/schema";
import { テスト用データベースURL } from "./database-url";

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
  if (testDb) {
    return testDb;
  }

  client = postgres(テスト用データベースURL());
  testDb = テストDBを作成する(client);

  return testDb;
};

export const テストDBをリセットする = async (db: DbClient) => {
  const tableNames = Object.values(schema)
    .filter((table) => is(table, PgTable))
    .map((table) => getTableName(table));

  for (const tableName of tableNames) {
    await db.execute(sql.raw(`TRUNCATE TABLE "${tableName}" CASCADE`));
  }
};

export const テストDBを削除する = async () => {
  if (client) {
    await client.end();
    client = null;
    testDb = null;
  }
};
