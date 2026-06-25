import { z } from "@hono/zod-openapi";

export const notificationListQuerySchema = z.object({
  cursor: z
    .string()
    .optional()
    .openapi({ example: "2026-06-24T00:00:00.000Z" }),
});

export const unreadCountSchema = z
  .object({
    count: z.number().openapi({ example: 3 }),
  })
  .openapi({ example: { count: 3 } });

export const markSeenSchema = z
  .object({
    ok: z.boolean().openapi({ example: true }),
  })
  .openapi({ example: { ok: true } });

const actorExample = {
  id: "user_2abc",
  firstName: "太郎" as string | null,
  lastName: "田中" as string | null,
  imageUrl: "https://img.clerk.com/example.png",
  userName: "taro" as string | null,
};
const actorSchema = z
  .object({
    id: z.string().openapi({ example: actorExample.id }),
    firstName: z
      .string()
      .nullable()
      .openapi({ example: actorExample.firstName }),
    lastName: z.string().nullable().openapi({ example: actorExample.lastName }),
    imageUrl: z.string().openapi({ example: actorExample.imageUrl }),
    userName: z.string().nullable().openapi({ example: actorExample.userName }),
  })
  .openapi({ example: actorExample });

const notificationItemExample = {
  kind: "pdLike" as "pdLike" | "rePdLike" | "rePd",
  actor: actorExample,
  pdId: "0190d2c0-0000-7000-8000-000000000001",
  rePdId: null as string | null,
  excerpt: "今日学んだことを共有します",
  createdAt: "2026-06-24T00:00:00.000Z",
};
const notificationItemSchema = z
  .object({
    kind: z
      .enum(["pdLike", "rePdLike", "rePd"])
      .openapi({ example: notificationItemExample.kind }),
    actor: actorSchema,
    pdId: z.string().openapi({ example: notificationItemExample.pdId }),
    rePdId: z
      .string()
      .nullable()
      .openapi({ example: notificationItemExample.rePdId }),
    excerpt: z.string().openapi({ example: notificationItemExample.excerpt }),
    createdAt: z
      .string()
      .openapi({ example: notificationItemExample.createdAt }),
  })
  .openapi({ example: notificationItemExample });

export const notificationListSchema = z
  .object({
    items: z
      .array(notificationItemSchema)
      .openapi({ example: [notificationItemExample] }),
    nextCursor: z
      .string()
      .optional()
      .openapi({ example: "2026-06-23T00:00:00.000Z" }),
  })
  .openapi({
    example: { items: [notificationItemExample], nextCursor: undefined },
  });
