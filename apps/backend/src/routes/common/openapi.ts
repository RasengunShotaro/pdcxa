import { z } from "@hono/zod-openapi";

export const messageSchema = (message: string) =>
  z
    .object({
      message: z.string().openapi({ example: message }),
    })
    .openapi({ example: { message } });

export const jsonContent = <T extends z.ZodTypeAny>(
  schema: T,
  description: string,
) => ({
  content: {
    "application/json": {
      schema,
    },
  },
  description,
});
