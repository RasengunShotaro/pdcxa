import {
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const pds = pgTable("pds", {
  id: uuid("id").primaryKey().$defaultFn(uuidv7),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").notNull(),
  userId: varchar("user_id").notNull(),
  imageFileName: varchar("image_file_name"),
});

export const rePds = pgTable("repds", {
  id: uuid("id").primaryKey().$defaultFn(uuidv7),
  pdId: uuid("pd_id")
    .notNull()
    .references(() => pds.id),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").notNull(),
  userId: varchar("user_id").notNull(),
});

export const pdLikes = pgTable(
  "pd_likes",
  {
    targetPdId: uuid("target_pd_id")
      .notNull()
      .references(() => pds.id),
    userId: varchar("user_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.targetPdId, table.userId] })],
);

export const rePdLikes = pgTable(
  "repd_likes",
  {
    targetRePdId: uuid("target_repd_id")
      .notNull()
      .references(() => rePds.id),
    userId: varchar("user_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.targetRePdId, table.userId] })],
);

export const notificationSeen = pgTable("notification_seen", {
  userId: varchar("user_id").primaryKey(),
  lastSeenAt: timestamp("last_notifications_seen_at").notNull(),
});
