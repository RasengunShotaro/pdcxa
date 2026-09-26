import { cors } from "hono/cors";

export const CORSMiddleware = cors({
  origin: "*",
  maxAge: 7200,
});
