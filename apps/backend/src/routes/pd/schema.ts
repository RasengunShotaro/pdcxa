import { z } from "@hono/zod-openapi";

export const fetchPdQuerySchema = z.object({
  pdId: z
    .string()
    .optional()
    .openapi({ example: "0190d2c0-0000-7000-8000-000000000001" }),
  userName: z.string().optional().openapi({ example: "taro" }),
  cursor: z
    .string()
    .optional()
    .openapi({ example: "0190d2c0-0000-7000-8000-000000000002" }),
});

export const createPdFormSchema = z.object({
  content: z
    .string()
    .min(1, "PDを入力してください")
    .max(200, "PDが長すぎます。200文字以内で入力してください")
    .openapi({ example: "今日学んだことを共有します" }),
  image: z
    .union([z.instanceof(File), z.literal("undefined")])
    .optional()
    .transform((input) => (input === "undefined" ? undefined : input))
    .openapi({ type: "string", format: "binary" }),
});

export const createGifPdFormSchema = z.object({
  content: z
    .string()
    .min(1, "PDを入力してください")
    .max(200, "PDが長すぎます。200文字以内で入力してください")
    .openapi({ example: "GIF付きで共有します" }),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.type === "image/gif",
      "GIFファイルのみ対応しています",
    )
    .openapi({ type: "string", format: "binary" }),
});

export const mutatePdLikeSchema = z.object({
  pdId: z.string().openapi({ example: "0190d2c0-0000-7000-8000-000000000001" }),
});

export const fetchPdImageParamSchema = z.object({
  fileName: z.string().openapi({
    param: { name: "fileName", in: "path" },
    example: "user_2abc-1700000000000.jpeg",
  }),
});

export const pdImageBinarySchema = z
  .any()
  .openapi({ type: "string", format: "binary" });

const pdLikeExample = { userId: "user_2abc" };
const pdLikeSchema = z
  .object({
    userId: z.string().openapi({ example: pdLikeExample.userId }),
  })
  .openapi({ example: pdLikeExample });

const pdItemExample = {
  isMyPd: false,
  likeCount: 3,
  replyCount: 1,
  likes: [pdLikeExample],
  id: "0190d2c0-0000-7000-8000-000000000001",
  content: "今日学んだことを共有します",
  createdAt: "2026-06-24T00:00:00.000Z",
  userId: "user_2abc",
  imageFileName: null as string | null,
};
const pdItemSchema = z
  .object({
    isMyPd: z.boolean().openapi({ example: pdItemExample.isMyPd }),
    likeCount: z.number().openapi({ example: pdItemExample.likeCount }),
    replyCount: z.number().openapi({ example: pdItemExample.replyCount }),
    likes: z.array(pdLikeSchema).openapi({ example: pdItemExample.likes }),
    id: z.string().openapi({ example: pdItemExample.id }),
    content: z.string().openapi({ example: pdItemExample.content }),
    createdAt: z.string().openapi({ example: pdItemExample.createdAt }),
    userId: z.string().openapi({ example: pdItemExample.userId }),
    imageFileName: z
      .string()
      .nullable()
      .openapi({ example: pdItemExample.imageFileName }),
  })
  .openapi({ example: pdItemExample });

export const pdDetailSchema = z
  .object({
    items: z.array(pdItemSchema).openapi({ example: [pdItemExample] }),
    nextCursor: z
      .string()
      .optional()
      .openapi({ example: "0190d2c0-0000-7000-8000-000000000002" }),
  })
  .openapi({ example: { items: [pdItemExample], nextCursor: undefined } });

const dailyExample = {
  date: "2026-06-24",
  pdCount: 5,
  rePdCount: 8,
  likeCount: 12,
};
const rankingExample = {
  userId: "user_2abc",
  pdCount: 5,
  rePdCount: 8,
  likeCount: 12,
};
const weeklyStatsExample = {
  range: { start: "2026-06-18", end: "2026-06-24" },
  totals: {
    pdCount: 20,
    rePdCount: 30,
    likeCount: 50,
    activeAuthorCount: 4,
    averagePdPerAuthor: 5,
  },
  daily: [dailyExample],
  rankings: [rankingExample],
};

export const weeklyStatsSchema = z
  .object({
    range: z
      .object({
        start: z.string().openapi({ example: weeklyStatsExample.range.start }),
        end: z.string().openapi({ example: weeklyStatsExample.range.end }),
      })
      .openapi({ example: weeklyStatsExample.range }),
    totals: z
      .object({
        pdCount: z
          .number()
          .openapi({ example: weeklyStatsExample.totals.pdCount }),
        rePdCount: z
          .number()
          .openapi({ example: weeklyStatsExample.totals.rePdCount }),
        likeCount: z
          .number()
          .openapi({ example: weeklyStatsExample.totals.likeCount }),
        activeAuthorCount: z
          .number()
          .openapi({ example: weeklyStatsExample.totals.activeAuthorCount }),
        averagePdPerAuthor: z
          .number()
          .openapi({ example: weeklyStatsExample.totals.averagePdPerAuthor }),
      })
      .openapi({ example: weeklyStatsExample.totals }),
    daily: z
      .array(
        z
          .object({
            date: z.string().openapi({ example: dailyExample.date }),
            pdCount: z.number().openapi({ example: dailyExample.pdCount }),
            rePdCount: z.number().openapi({ example: dailyExample.rePdCount }),
            likeCount: z.number().openapi({ example: dailyExample.likeCount }),
          })
          .openapi({ example: dailyExample }),
      )
      .openapi({ example: weeklyStatsExample.daily }),
    rankings: z
      .array(
        z
          .object({
            userId: z.string().openapi({ example: rankingExample.userId }),
            pdCount: z.number().openapi({ example: rankingExample.pdCount }),
            rePdCount: z
              .number()
              .openapi({ example: rankingExample.rePdCount }),
            likeCount: z
              .number()
              .openapi({ example: rankingExample.likeCount }),
          })
          .openapi({ example: rankingExample }),
      )
      .openapi({ example: weeklyStatsExample.rankings }),
  })
  .openapi({ example: weeklyStatsExample });
