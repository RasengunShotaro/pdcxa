declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      } | null;
    };
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const parseJsonBody = (body: string): unknown => {
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
};

const getToken = async (): Promise<string | null> => {
  if (typeof window === "undefined") {
    return null;
  }
  const session = window.Clerk?.session;
  if (!session) {
    return null;
  }
  return session.getToken();
};

export const handleOrvalResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
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
    credentials: "include",
  });

  return handleOrvalResponse<T>(res);
};
