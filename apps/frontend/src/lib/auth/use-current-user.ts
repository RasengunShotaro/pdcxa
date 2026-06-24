"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";
import { MOCK_USER } from "./mock-user";
import { AUTH_MOCKING } from "./mocking";
import type { AuthUser } from "./types";

const useMockCurrentUser = (): { user: AuthUser | null } => ({
  user: MOCK_USER,
});

const useClerkCurrentUser = (): { user: AuthUser | null } => {
  const { user } = useClerkUser();
  return { user: user ?? null };
};

export const useCurrentUser = AUTH_MOCKING
  ? useMockCurrentUser
  : useClerkCurrentUser;
