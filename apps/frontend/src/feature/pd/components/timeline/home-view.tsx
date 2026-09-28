"use client";

import { useState } from "react";
import { FeedTabPanel } from "@/components/elements/feed-tab-panel";
import { ComposeFab } from "@/feature/pd/components/composer/compose-fab";
import { PdComposer } from "@/feature/pd/components/composer/pd-composer";
import { PdTimeline } from "./pd-timeline";

export function HomeView() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <>
      <FeedTabPanel>
        <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
          <PdTimeline onCompose={() => setIsComposerOpen(true)} />
        </div>
      </FeedTabPanel>
      <ComposeFab onClick={() => setIsComposerOpen(true)} />
      <PdComposer onOpenChange={setIsComposerOpen} open={isComposerOpen} />
    </>
  );
}
