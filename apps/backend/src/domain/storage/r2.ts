import { Context } from "effect";

export class R2Storage extends Context.Tag("R2Storage")<
  R2Storage,
  R2Bucket
>() {}
