"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AUTH_MOCKING } from "./mocking";

export interface SignOut {
  signOut: () => Promise<void>;
}

const useMockSignOut = (): SignOut => {
  const router = useRouter();
  return {
    signOut: async () => {
      router.push("/signin");
    },
  };
};

const useClerkSignOut = (): SignOut => {
  const { signOut } = useClerk();
  return {
    signOut: async () => {
      await signOut({ redirectUrl: "/signin" });
    },
  };
};

export const useSignOut: () => SignOut = AUTH_MOCKING
  ? useMockSignOut
  : useClerkSignOut;
