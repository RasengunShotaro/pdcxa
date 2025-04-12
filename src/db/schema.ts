import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const pds = pgTable("pds", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").notNull(),
  userId: varchar("user_id").notNull(),
});

export const rePds = pgTable("repds", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  pdId: integer("pd_id")
    .notNull()
    .references(() => pds.id),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").notNull(),
  userId: varchar("user_id").notNull(),
});

export const pdLikes = pgTable("pd_likes", {
  targetPdId: integer("target_pd_id")
    .notNull()
    .references(() => pds.id)
    .primaryKey(),
  userId: varchar("user_id").notNull(),
});

export const rePdLikes = pgTable("repd_likes", {
  targetRePdId: integer("target_repd_id")
    .notNull()
    .references(() => rePds.id)
    .primaryKey(),
  userId: varchar("user_id").notNull(),
});
