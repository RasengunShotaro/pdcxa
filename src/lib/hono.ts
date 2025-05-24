import type { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

const absoluteUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : "";

export const client = hc<AppType>(absoluteUrl);
