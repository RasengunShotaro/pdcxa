import { Layer } from "effect";
import { UserDirectoryLive } from "../clerk/user-directory";

export const UserLayer = Layer.mergeAll(UserDirectoryLive);
