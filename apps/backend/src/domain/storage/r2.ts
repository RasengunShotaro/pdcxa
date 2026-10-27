import { Context } from "effect";

export class R2Storage extends Context.Service<R2Storage, R2Bucket>()(
  "R2Storage",
) {}
