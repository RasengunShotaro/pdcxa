import { Context, Layer } from "effect";
import { type DbClient as DrizzleDb, db } from "#/lib/db";

export class DbClient extends Context.Service<DbClient, DrizzleDb>()(
  "DbClient",
) {}

export const DbClientLive = Layer.succeed(DbClient, db);
