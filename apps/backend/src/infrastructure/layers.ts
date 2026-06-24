import { Layer } from "effect";
import { InvitationLayer } from "./invitation/layer";
import { PdLayer } from "./pd/layer";
import { DbClientLive } from "./postgres/client";
import { RePdLayer } from "./repd/layer";
import { UserLayer } from "./user/layer";

export const AppLive = Layer.mergeAll(
  PdLayer,
  RePdLayer,
  UserLayer,
  InvitationLayer,
).pipe(Layer.provide(DbClientLive));
