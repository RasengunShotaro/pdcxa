import type { ClerkClient } from "@clerk/backend";
import { Context } from "effect";

export class ClerkClientPort extends Context.Tag("ClerkClientPort")<
  ClerkClientPort,
  ClerkClient
>() {}
