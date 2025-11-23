import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL || "");
export const db: DbClient = drizzle(sql, { schema });

export type DbClient = PgDatabase<PgQueryResultHKT, typeof schema>;
