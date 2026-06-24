import { createInvitation as createInvitationApi } from "@/schema/api";

export const createInvitation = async ({ mail }: { mail: string }) => {
  await createInvitationApi({ emailAddress: mail });
};
