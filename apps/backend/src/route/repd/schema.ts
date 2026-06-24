import { z } from "@hono/zod-openapi";

export const fetchRePdQuerySchema = z.object({
  pdId: z.string().openapi({ example: "0190d2c0-0000-7000-8000-000000000001" }),
});

export const createRePdSchema = z.object({
  pdId: z.string().openapi({ example: "0190d2c0-0000-7000-8000-000000000001" }),
  content: z
    .string()
    .min(1, "RePDを入力してください")
    .max(200, "RePDが長すぎます。200文字以内で入力してください")
    .openapi({ example: "とても参考になりました" }),
});

export const mutateRePdLikeSchema = z.object({
  rePdId: z
    .string()
    .openapi({ example: "0190d2c0-0000-7000-8000-000000000003" }),
});

const rePdLikeExample = { userId: "user_2abc" };
const rePdLikeSchema = z
  .object({
    userId: z.string().openapi({ example: rePdLikeExample.userId }),
  })
  .openapi({ example: rePdLikeExample });

const rePdItemExample = {
  isMyRePd: false,
  likeCount: 2,
  likes: [rePdLikeExample],
  id: "0190d2c0-0000-7000-8000-000000000003",
  content: "とても参考になりました",
  createdAt: "2026-06-24T00:00:00.000Z",
  userId: "user_2abc",
  pdId: "0190d2c0-0000-7000-8000-000000000001",
};
const rePdItemSchema = z
  .object({
    isMyRePd: z.boolean().openapi({ example: rePdItemExample.isMyRePd }),
    likeCount: z.number().openapi({ example: rePdItemExample.likeCount }),
    likes: z.array(rePdLikeSchema).openapi({ example: rePdItemExample.likes }),
    id: z.string().openapi({ example: rePdItemExample.id }),
    content: z.string().openapi({ example: rePdItemExample.content }),
    createdAt: z.string().openapi({ example: rePdItemExample.createdAt }),
    userId: z.string().openapi({ example: rePdItemExample.userId }),
    pdId: z.string().openapi({ example: rePdItemExample.pdId }),
  })
  .openapi({ example: rePdItemExample });

export const rePdDetailSchema = z
  .array(rePdItemSchema)
  .openapi({ example: [rePdItemExample] });
