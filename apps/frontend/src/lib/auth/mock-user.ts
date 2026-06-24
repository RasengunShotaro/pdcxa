import type { AuthUser } from "./types";

export const MOCK_USER_ID = "user_2abc";

export const MOCK_USER: AuthUser = {
  id: MOCK_USER_ID,
  firstName: "Dev",
  lastName: "User",
  fullName: "Dev User",
  imageUrl: "",
  update: async () => undefined,
  setProfileImage: async () => undefined,
};
