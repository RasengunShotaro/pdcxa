import { ManagedRuntime } from "effect";
import { AppLive } from "./layers";

export const runtime = ManagedRuntime.make(AppLive);
