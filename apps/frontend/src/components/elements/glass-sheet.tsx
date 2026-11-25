"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import styles from "./glass-sheet.module.css";

interface GlassSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}

export function GlassSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: GlassSheetProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className={styles.sheet} data-glass-sheet="">
        <DialogHeader className="px-3 pt-3.5 pb-[18px] text-left">
          <DialogTitle className="text-[1.5rem] leading-[1.3] font-bold text-ink">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

interface SheetGroupProps {
  title?: string;
  children: ReactNode;
}

export function SheetGroup({ title, children }: SheetGroupProps) {
  return (
    <section className="flex flex-col gap-3">
      {title ? (
        <h3 className="px-3 pt-2 text-[0.8125rem] font-bold text-ink-2">
          {title}
        </h3>
      ) : null}
      <div className="flex flex-col rounded-2xl bg-sheet-group">{children}</div>
    </section>
  );
}
