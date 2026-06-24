import { MOCK_USER_ID } from "@/lib/auth/mock-user";
import { getPdcxaApiMock } from "@/schema/api.msw";

const base64Url = (value: object): string =>
  btoa(JSON.stringify(value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

export { MOCK_USER_ID };

export const MOCK_ID_TOKEN = [
  base64Url({ alg: "none", typ: "JWT" }),
  base64Url({ sub: MOCK_USER_ID, exp: 4070908800 }),
  "mock",
].join(".");

export const handlers = getPdcxaApiMock();
