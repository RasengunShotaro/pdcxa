import { markNotificationsSeen as markNotificationsSeenApi } from "@/schema/api";

export const markNotificationsSeen = async () => {
  await markNotificationsSeenApi();
};
