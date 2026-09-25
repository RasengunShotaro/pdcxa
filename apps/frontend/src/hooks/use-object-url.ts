import { useSyncExternalStore } from "react";
import { createObjectUrlRegistry } from "@/lib/object-url-registry";

type Subscribe = (onStoreChange: () => void) => () => void;

const registry = createObjectUrlRegistry({
  create: (blob) => URL.createObjectURL(blob),
  revoke: (url) => URL.revokeObjectURL(url),
});

const subscribers = new WeakMap<Blob, Subscribe>();

const subscribeToBlob = (blob: Blob): Subscribe => {
  const cached = subscribers.get(blob);
  if (cached) return cached;
  const subscribe: Subscribe = (onStoreChange) => {
    registry.acquire(blob);
    onStoreChange();
    return () => registry.release(blob);
  };
  subscribers.set(blob, subscribe);
  return subscribe;
};

const subscribeToNothing: Subscribe = () => () => {};

export function useObjectUrl(blob: Blob | undefined): string | null {
  return useSyncExternalStore(
    blob ? subscribeToBlob(blob) : subscribeToNothing,
    () => (blob ? registry.urlOf(blob) : null),
    () => null,
  );
}
