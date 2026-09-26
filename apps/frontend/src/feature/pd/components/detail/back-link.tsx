"use client";

import { ArrowLeft } from "lucide-react";
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
      aria-label="戻る"
      className="-ml-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition-[background-color,translate] hover:-translate-y-px hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      href="/"
      onClick={handleClick}
      title="戻る"
    >
      <ArrowLeft aria-hidden="true" className="size-5" />
    </Link>
  );
}
