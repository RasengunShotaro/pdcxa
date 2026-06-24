import { Context, Layer } from "effect";
import { type DbClient as DrizzleDb, db } from "#/lib/db";

export class DbClient extends Context.Tag("DbClient")<DbClient, DrizzleDb>() {}

export const DbClientLive = Layer.succeed(DbClient, db);
