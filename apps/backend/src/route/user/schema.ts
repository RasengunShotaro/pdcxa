import { z } from "@hono/zod-openapi";

export const userDetailQuerySchema = z.object({
  userName: z.string().openapi({ example: "taro" }),
});

export const userDetailsQuerySchema = z.object({
  userIds: z
    .preprocess(
      (value) =>
        value === undefined || Array.isArray(value)
          ? value
          : String(value).split(","),
      z.array(z.string()),
    )
    .openapi({ example: ["user_2abc", "user_2def"] }),
});

const userDetailExample = {
  id: "user_2abc",
  firstName: "太郎" as string | null,
  lastName: "田中" as string | null,
  imageUrl: "https://img.clerk.com/example.png",
  userName: "taro" as string | null,
};

export const userDetailSchema = z
  .object({
    id: z.string().openapi({ example: userDetailExample.id }),
    firstName: z
      .string()
      .nullable()
      .openapi({ example: userDetailExample.firstName }),
    lastName: z
      .string()
      .nullable()
      .openapi({ example: userDetailExample.lastName }),
    imageUrl: z.string().openapi({ example: userDetailExample.imageUrl }),
    userName: z
      .string()
      .nullable()
      .openapi({ example: userDetailExample.userName }),
  })
  .openapi({ example: userDetailExample });

export const userDetailsSchema = z
  .array(userDetailSchema)
  .openapi({ example: [userDetailExample] });
