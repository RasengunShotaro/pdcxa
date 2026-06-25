import { ApiError } from "./api-error";

declare global {
  interface Window {
    Clerk?: {
      loaded?: boolean;
      session?: {
        getToken: () => Promise<string | null>;
      } | null;
    };
  }
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

const parseJsonBody = (body: string): unknown => {
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const MOCKING_ENABLED = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

const getToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") {
    return null;
  }

  if (MOCKING_ENABLED) {
    return null;
  }

  for (let i = 0; i < 50; i++) {
    const session = window.Clerk?.session;
    if (session) {
      return session.getToken();
    }
    if (window.Clerk?.loaded) {
      return null;
    }
    await sleep(100);
  }

  return null;
};

const isBinaryResponse = (res: Response): boolean => {
  const contentType = res.headers.get("content-type") ?? "";
  return (
    contentType.includes("application/octet-stream") ||
    contentType.startsWith("image/")
  );
};

export const handleOrvalResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    throw new ApiError(res.status);
  }

  if (isBinaryResponse(res)) {
    return {
      data: await res.blob(),
      status: res.status,
      headers: res.headers,
    } as T;
  }

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data = body ? parseJsonBody(body) : {};

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as T;
};

export const orvalFetch = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const token = await getToken();
  const headers = new Headers(options?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  return handleOrvalResponse<T>(res);
};
