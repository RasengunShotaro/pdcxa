import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";
import { fetchRawPds } from "./utils/fetch-raw-pds";

const fetchPdSchema = v.object({
  pdId: v.optional(v.string()),
  userName: v.optional(v.string()),
  cursor: v.optional(v.string()),
});

export const pdApp = new Hono().get(
  "/",
  vValidator("json", fetchPdSchema),
  async (c) => {
    const clerkClient = c.get("clerk");
    const { pdId, userName, cursor } = c.req.valid("json");

    const PD詳細 = await fetchRawPds({
      pdId,
      userName,
      cursor,
      clerkClient,
    });

    return c.json(PD詳細, 200);
  }
);
