import { hc } from "hono/client";
import type { ルート } from ".";

type AppType = typeof ルート;
type ClientType = typeof hc<AppType>;

export const createClient = (
  ...args: Parameters<ClientType>
): ReturnType<ClientType> => {
  return hc<AppType>(...args);
};
