"use client";

import { useUser as useClerkUser, useReverification } from "@clerk/nextjs";
import {
  isClerkAPIResponseError,
  isReverificationCancelledError,
} from "@clerk/nextjs/errors";
import { AUTH_MOCKING } from "./mocking";
import {
  clerkCodesToHandleFailureReason,
  type UpdateProfileHandleFailureReason,
} from "./profile-handle-failure";

export interface UpdateProfileNameInput {
  firstName: string;
  lastName: string;
}

export interface UpdateProfileName {
  updateProfileName: (input: UpdateProfileNameInput) => Promise<void>;
}

export interface UpdateProfilePicture {
  updateProfilePicture: (file: Blob | File) => Promise<void>;
}

export type UpdateProfileHandleResult =
  | { ok: true }
  | { ok: false; reason: UpdateProfileHandleFailureReason };

export interface UpdateProfileHandle {
  updateProfileHandle: (handle: string) => Promise<UpdateProfileHandleResult>;
}

const toHandleFailureReason = (
  error: unknown,
): UpdateProfileHandleFailureReason =>
  isClerkAPIResponseError(error)
    ? clerkCodesToHandleFailureReason(error.errors.map((e) => e.code))
    : "unknown";

const useMockUpdateProfileName = (): UpdateProfileName => ({
  updateProfileName: async () => undefined,
});

const useClerkUpdateProfileName = (): UpdateProfileName => {
  const { user } = useClerkUser();
  return {
    updateProfileName: async ({ firstName, lastName }) => {
      if (!user) {
        throw new Error("ユーザーが見つかりません");
      }
      await user.update({ firstName, lastName });
    },
  };
};

export const useUpdateProfileName: () => UpdateProfileName = AUTH_MOCKING
  ? useMockUpdateProfileName
  : useClerkUpdateProfileName;

const useMockUpdateProfilePicture = (): UpdateProfilePicture => ({
  updateProfilePicture: async () => undefined,
});

const useClerkUpdateProfilePicture = (): UpdateProfilePicture => {
  const { user } = useClerkUser();
  return {
    updateProfilePicture: async (file) => {
      if (!user) {
        throw new Error("ユーザーが見つかりません");
      }
      await user.setProfileImage({ file });
    },
  };
};

export const useUpdateProfilePicture: () => UpdateProfilePicture = AUTH_MOCKING
  ? useMockUpdateProfilePicture
  : useClerkUpdateProfilePicture;

const useMockUpdateProfileHandle = (): UpdateProfileHandle => ({
  updateProfileHandle: async () => ({ ok: true }),
});

const useClerkUpdateProfileHandle = (): UpdateProfileHandle => {
  const { user } = useClerkUser();
  const updateUsername = useReverification((username: string) => {
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }
    return user.update({ username });
  });
  return {
    updateProfileHandle: async (handle) => {
      if (!user) {
        return { ok: false, reason: "unknown" };
      }
      try {
        await updateUsername(handle);
        return { ok: true };
      } catch (error) {
        if (isReverificationCancelledError(error)) {
          return { ok: false, reason: "cancelled" };
        }
        return { ok: false, reason: toHandleFailureReason(error) };
      }
    },
  };
};

export const useUpdateProfileHandle: () => UpdateProfileHandle = AUTH_MOCKING
  ? useMockUpdateProfileHandle
  : useClerkUpdateProfileHandle;
