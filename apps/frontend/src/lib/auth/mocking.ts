export const AUTH_MOCKING =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "enabled";
