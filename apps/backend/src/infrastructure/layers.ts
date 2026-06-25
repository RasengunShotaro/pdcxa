import { Layer } from "effect";
import { InvitationLayer } from "./invitation/layer";
import { NotificationLayer } from "./notification/layer";
import { PdLayer } from "./pd/layer";
import { DbClientLive } from "./postgres/client";
import { RePdLayer } from "./repd/layer";
import { UserLayer } from "./user/layer";

export const AppLive = Layer.mergeAll(
  PdLayer,
  RePdLayer,
  UserLayer,
  InvitationLayer,
  NotificationLayer,
).pipe(Layer.provide(DbClientLive));
