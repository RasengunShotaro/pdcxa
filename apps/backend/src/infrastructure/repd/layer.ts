import { Layer } from "effect";
import { RePdRepositoryLive } from "../postgres/repd-repo";

export const RePdLayer = Layer.mergeAll(RePdRepositoryLive);
