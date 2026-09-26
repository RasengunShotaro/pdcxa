"use client";

import { useState } from "react";
import { ComposeFab } from "@/feature/pd/components/composer/compose-fab";
import { ComposerTrigger } from "@/feature/pd/components/composer/composer-trigger";
import { PdComposer } from "@/feature/pd/components/composer/pd-composer";
import { PdTimeline } from "./pd-timeline";

export function HomeView() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <>
      <div className="space-y-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <ComposerTrigger
          className="hidden md:flex"
          label="PDする"
          onClick={() => setIsComposerOpen(true)}
          placeholder="いま考えていること・気づいたことを書いてみよう"
        />
        <PdTimeline onCompose={() => setIsComposerOpen(true)} />
      </div>
      <ComposeFab onClick={() => setIsComposerOpen(true)} />
      <PdComposer onOpenChange={setIsComposerOpen} open={isComposerOpen} />
    </>
  );
}
