import { fetchNotificationUnreadCount as fetchNotificationUnreadCountApi } from "@/schema/api";

export const fetchUnreadCount = async () => {
  return (await fetchNotificationUnreadCountApi()).data;
};
