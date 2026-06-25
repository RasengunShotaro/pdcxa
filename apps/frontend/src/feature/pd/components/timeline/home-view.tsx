"use client";

import { useState } from "react";
import { ComposeFab } from "@/feature/pd/components/composer/compose-fab";
import { PdComposer } from "@/feature/pd/components/composer/pd-composer";
import { PdTimeline } from "./pd-timeline";

export function HomeView() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <>
      <PdTimeline onCompose={() => setIsComposerOpen(true)} />
      <ComposeFab onClick={() => setIsComposerOpen(true)} />
      <PdComposer onOpenChange={setIsComposerOpen} open={isComposerOpen} />
    </>
  );
}
