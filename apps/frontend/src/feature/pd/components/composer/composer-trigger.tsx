"use client";

import { MessageCirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComposerTriggerProps {
  onClick: () => void;
  label: string;
  placeholder: string;
  className?: string;
}

export function ComposerTrigger({
  onClick,
  label,
  placeholder,
  className,
}: ComposerTriggerProps) {
  return (
    <Button
      aria-label={label}
      className={cn(
        "flex h-auto w-full justify-between gap-4 rounded-xl bg-card px-4 py-3 font-normal shadow-sm transition-[background-color,translate] hover:-translate-y-px",
        className,
      )}
      onClick={onClick}
      type="button"
      variant="outline"
    >
      <span className="truncate text-base text-muted-foreground">
        {placeholder}
      </span>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
        <MessageCirclePlus aria-hidden="true" className="size-4" />
        {label}
      </span>
    </Button>
  );
}
