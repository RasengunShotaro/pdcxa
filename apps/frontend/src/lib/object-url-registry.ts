interface ObjectUrlApi {
  readonly create: (blob: Blob) => string;
  readonly revoke: (url: string) => void;
}

interface ObjectUrlEntry {
  readonly url: string;
  readonly holders: number;
}

export interface ObjectUrlRegistry {
  readonly acquire: (blob: Blob) => void;
  readonly release: (blob: Blob) => void;
  readonly urlOf: (blob: Blob) => string | null;
}

export function createObjectUrlRegistry({
  create,
  revoke,
}: ObjectUrlApi): ObjectUrlRegistry {
  const entries = new Map<Blob, ObjectUrlEntry>();

  const acquire = (blob: Blob) => {
    const entry = entries.get(blob);
    entries.set(
      blob,
      entry
        ? { ...entry, holders: entry.holders + 1 }
        : { url: create(blob), holders: 1 },
    );
  };

  const release = (blob: Blob) => {
    const entry = entries.get(blob);
    if (!entry) return;
    if (entry.holders > 1) {
      entries.set(blob, { ...entry, holders: entry.holders - 1 });
      return;
    }
    entries.delete(blob);
    revoke(entry.url);
  };

  const urlOf = (blob: Blob) => entries.get(blob)?.url ?? null;

  return { acquire, release, urlOf };
}
