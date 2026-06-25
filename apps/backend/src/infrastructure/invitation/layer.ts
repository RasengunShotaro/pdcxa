import { Layer } from "effect";
import { InvitationServiceLive } from "../clerk/invitation";

export const InvitationLayer = Layer.mergeAll(InvitationServiceLive);
