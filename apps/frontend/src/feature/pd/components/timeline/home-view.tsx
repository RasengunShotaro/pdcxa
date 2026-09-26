"use client";

import { useState } from "react";
import { FeedLayout } from "@/components/elements/feed-layout";
import { ComposeFab } from "@/feature/pd/components/composer/compose-fab";
import { PdComposer } from "@/feature/pd/components/composer/pd-composer";
import { WeeklyActivityCard } from "@/feature/pd/components/stats/weekly-activity-card";
import { PdTimeline } from "./pd-timeline";

export function HomeView() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <>
      <FeedLayout aside={<WeeklyActivityCard />}>
        <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
          <PdTimeline onCompose={() => setIsComposerOpen(true)} />
        </div>
      </FeedLayout>
      <ComposeFab onClick={() => setIsComposerOpen(true)} />
      <PdComposer onOpenChange={setIsComposerOpen} open={isComposerOpen} />
    </>
  );
}
