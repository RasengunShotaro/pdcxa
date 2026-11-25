"use client";

import { Repeat2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Pd } from "@/feature/pd/types";
import { 件数を短く表す } from "@/feature/pd/utils/format-count";
import { PDを引用元にする } from "@/feature/pd/utils/quote";
import { PdComposer } from "../composer/pd-composer";
import { PD_ACTION_CLASS, PD_ACTION_ICON_CLASS } from "./pd-action-style";

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
        className={PD_ACTION_CLASS}
        onClick={() => setOpen(true)}
        title="引用する"
        type="button"
        variant="ghost"
      >
        <Repeat2 aria-hidden="true" className={PD_ACTION_ICON_CLASS} />
        {pd.quoteCount > 0 ? 件数を短く表す(pd.quoteCount) : null}
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
