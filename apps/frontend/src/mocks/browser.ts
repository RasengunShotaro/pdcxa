import { setupWorker } from "msw/browser";
import { 開発用のタイムラインのハンドラ } from "./dev-timeline-handlers";
import { handlers } from "./handlers";

export const worker = setupWorker(
  handlers[0],
  ...開発用のタイムラインのハンドラ,
  ...handlers.slice(1),
);

let starting: ReturnType<typeof worker.start> | undefined;

export const startWorker = (): ReturnType<typeof worker.start> => {
  starting ??= worker.start({ onUnhandledFrame: "bypass" });
  return starting;
};
