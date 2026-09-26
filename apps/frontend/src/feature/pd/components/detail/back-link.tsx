"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { backDestination } from "./back-destination";

export function BackLink() {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    const destination = backDestination({
      canGoBack: window.navigation?.canGoBack,
      referrer: document.referrer,
      origin: window.location.origin,
    });
    if (destination === "history") {
      event.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      className="inline-flex items-center gap-1 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      href="/"
      onClick={handleClick}
    >
      <ChevronLeft aria-hidden="true" className="size-4" />
      戻る
    </Link>
  );
}
