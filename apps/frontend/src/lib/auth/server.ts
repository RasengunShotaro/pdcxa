import { currentUser } from "@clerk/nextjs/server";
import { MOCK_USER } from "./mock-user";
import { AUTH_MOCKING } from "./mocking";

export const getCurrentUser = async (): Promise<{ id: string } | null> => {
  if (AUTH_MOCKING) {
    return { id: MOCK_USER.id };
  }
  return currentUser();
};
