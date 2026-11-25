"use client";

import { useAppSheets } from "@/components/elements/app-sheets";
import { PdTimeline } from "./pd-timeline";

export function HomeView() {
  const { openComposer } = useAppSheets();

  return (
    <PdTimeline density="compact" highlightsOpenPd onCompose={openComposer} />
  );
}
