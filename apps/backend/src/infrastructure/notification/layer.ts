import { Layer } from "effect";
import { NotificationRepositoryLive } from "../postgres/notification-repo";

export const NotificationLayer = Layer.mergeAll(NotificationRepositoryLive);
