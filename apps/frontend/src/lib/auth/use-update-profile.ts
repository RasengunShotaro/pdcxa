"use client";

import { useUser as useClerkUser } from "@clerk/nextjs";
import { AUTH_MOCKING } from "./mocking";

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
