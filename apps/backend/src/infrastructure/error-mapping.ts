import { ClerkError, DatabaseError, StorageError } from "../domain/errors";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const stringProp = (error: unknown, key: string): string | undefined => {
  if (!isRecord(error)) {
    return undefined;
  }
  const value = error[key];
  return typeof value === "string" ? value : undefined;
};

const numberProp = (error: unknown, key: string): number | undefined => {
  if (!isRecord(error)) {
    return undefined;
  }
  const value = error[key];
  return typeof value === "number" ? value : undefined;
};

export const toDatabaseError = (error: unknown): DatabaseError =>
  new DatabaseError({
    message: messageOf(error),
    code: stringProp(error, "code"),
    constraint: stringProp(error, "constraint"),
  });

export const toStorageError = (error: unknown): StorageError =>
  new StorageError({ message: messageOf(error) });

const clerkFirstError = (
  error: unknown,
): { code?: string; message?: string } | undefined => {
  if (!isRecord(error) || !Array.isArray(error.errors)) {
    return undefined;
  }
  const first: unknown = error.errors[0];
  if (!isRecord(first)) {
    return undefined;
  }
  const longMessage = first.longMessage;
  const message = first.message;
  return {
    code: typeof first.code === "string" ? first.code : undefined,
    message:
      typeof longMessage === "string"
        ? longMessage
        : typeof message === "string"
          ? message
          : undefined,
  };
};

export const toClerkError = (error: unknown): ClerkError => {
  const detail = clerkFirstError(error);
  return new ClerkError({
    message: detail?.message ?? messageOf(error),
    status: numberProp(error, "status"),
    code: detail?.code,
  });
};
