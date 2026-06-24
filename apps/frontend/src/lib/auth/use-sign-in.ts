"use client";

import { useSignIn as useClerkSignIn } from "@clerk/nextjs";
import { AUTH_MOCKING } from "./mocking";
import type { SignInFlow } from "./types";

const ok = async () => ({ error: null });

const mockSignIn: SignInFlow = {
  status: "complete",
  password: ok,
  create: ok,
  finalize: async ({ navigate }) => {
    navigate({ decorateUrl: (url) => url });
  },
  resetPasswordEmailCode: {
    sendCode: ok,
    verifyCode: ok,
    submitPassword: ok,
  },
};

const useMockSignInFlow = (): { signIn: SignInFlow } => ({
  signIn: mockSignIn,
});

const useClerkSignInFlow = (): { signIn: SignInFlow } => {
  const { signIn } = useClerkSignIn();
  const flow: SignInFlow = {
    get status() {
      return signIn.status;
    },
    password: (params) => signIn.password(params),
    create: (params) => signIn.create(params),
    finalize: (params) => signIn.finalize(params),
    resetPasswordEmailCode: {
      sendCode: () => signIn.resetPasswordEmailCode.sendCode(),
      verifyCode: (params) => signIn.resetPasswordEmailCode.verifyCode(params),
      submitPassword: (params) =>
        signIn.resetPasswordEmailCode.submitPassword(params),
    },
  };
  return { signIn: flow };
};

export const useSignInFlow = AUTH_MOCKING
  ? useMockSignInFlow
  : useClerkSignInFlow;
