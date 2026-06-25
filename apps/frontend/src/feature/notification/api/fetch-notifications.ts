import { fetchNotifications as fetchNotificationsApi } from "@/schema/api";

export const fetchNotifications = async ({ cursor }: { cursor?: string }) => {
  return (await fetchNotificationsApi({ cursor })).data;
};
