"use client";

import { Quote } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Pd } from "@/feature/pd/types";
import { PDを引用元にする } from "@/feature/pd/utils/quote";
import { PdComposer } from "../composer/pd-composer";

interface PdQuoteButtonProps {
  pd: Pd;
}

export function PdQuoteButton({ pd }: PdQuoteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        aria-label={
          pd.quoteCount > 0
            ? `引用する（${pd.quoteCount}件の引用）`
            : "引用する"
        }
        className="h-9 min-w-[72px] justify-start gap-1.5 rounded-full px-2 text-xs text-muted-foreground tabular-nums transition-[color,background-color,translate] hover:-translate-y-px hover:bg-accent hover:text-foreground"
        onClick={() => setOpen(true)}
        title="引用する"
        type="button"
        variant="ghost"
      >
        <Quote aria-hidden="true" className="size-[18px]" />
        {pd.quoteCount > 0 ? pd.quoteCount : null}
      </Button>
      {open ? (
        <PdComposer
          onOpenChange={setOpen}
          open={open}
          quotedPd={PDを引用元にする(pd)}
        />
      ) : null}
    </>
  );
}
