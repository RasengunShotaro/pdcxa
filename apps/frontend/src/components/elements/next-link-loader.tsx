"use client";

import { Loader2 } from "lucide-react";
import { useLinkStatus } from "next/link";
import type { ReactNode } from "react";

interface NextLinkLoaderProps {
  className?: string;
  fallback?: ReactNode;
}

export const NextLinkLoader = ({
  className,
  fallback,
}: NextLinkLoaderProps) => {
  const { pending } = useLinkStatus();
  if (pending) {
    return <Loader2 className={`animate-spin ${className}`} />;
  }
  return fallback ?? null;
};
