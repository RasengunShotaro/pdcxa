import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

let starting: ReturnType<typeof worker.start> | undefined;

export const startWorker = (): ReturnType<typeof worker.start> => {
  starting ??= worker.start({ onUnhandledRequest: "bypass" });
  return starting;
};
