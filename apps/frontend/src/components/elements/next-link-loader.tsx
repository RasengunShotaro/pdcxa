"use client";

import { Loader2 } from "lucide-react";
import { useLinkStatus } from "next/link";

export const NextLinkLoader = ({ className }: { className?: string }) => {
  const { pending } = useLinkStatus();
  return pending ? <Loader2 className={`animate-spin ${className}`} /> : null;
};
