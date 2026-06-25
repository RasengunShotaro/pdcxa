import { Layer } from "effect";
import { PdRepositoryLive } from "../postgres/pd-repo";
import { StorageServiceLive } from "../r2/storage";

export const PdLayer = Layer.mergeAll(PdRepositoryLive, StorageServiceLive);
