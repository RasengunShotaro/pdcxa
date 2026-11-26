import { Clock, DateTime, Effect } from "effect";

interface Patrol {
  readonly status: "analyzing" | "analyzed" | "error";
  readonly kind: "photo" | "voice";
}

declare const patrol: Patrol;
declare const 解析中の巡回か: (patrol: Patrol) => boolean;

export const h1 = patrol.status === "analyzing";
export const h2 = patrol.status !== "error";
export const h3 = (): string => {
  switch (patrol.status) {
    case "analyzed":
      return "済";
    default:
      return "未";
  }
};
export const h4 = "error" === patrol.status;
export const h5 = (p: Patrol | undefined): boolean => p?.status === "analyzed";
export const h6 = patrol.status == "analyzed";
export const f1 = new Date();
export const f2 = Date.now();
export const f3 = Math.random();
export const f4 = process.env.STAGE;
export const f5 = (): void => console.log("x");
export const f6 = (): Promise<Response> => fetch("https://example.com");

export const ok1 = 解析中の巡回か(patrol);
export const ok2 = patrol.kind === "photo";
export const ok3 = Effect.gen(function* () {
  const now = yield* DateTime.nowAsDate;
  const millis = yield* Clock.currentTimeMillis;
  return { now, millis, expiresAt: new Date(millis + 1000) };
});
export const ok4 = (status: number): boolean => status === 404;
