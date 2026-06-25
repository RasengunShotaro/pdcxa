import { Data } from "effect";

export class DatabaseError extends Data.TaggedError("DatabaseError")<{
  message: string;
  code?: string;
  constraint?: string;
}> {}

export class StorageError extends Data.TaggedError("StorageError")<{
  message: string;
}> {}

export class ClerkError extends Data.TaggedError("ClerkError")<{
  message: string;
  status?: number;
  code?: string;
}> {}

export class UserNotFoundError extends Data.TaggedError("UserNotFoundError")<{
  userName: string;
}> {}
