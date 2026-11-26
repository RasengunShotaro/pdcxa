"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { backDestination } from "./back-destination";

interface BackLinkProps {
  withLabel?: boolean;
  href?: string;
}

export function BackLink({ withLabel = false, href }: BackLinkProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (href) return;
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
      className={cn(
        "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full text-[0.9375rem] leading-none font-bold transition-[background-color,translate] hover:-translate-x-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        withLabel ? "pr-3" : "-ml-2 w-11 text-ink hover:bg-fill",
      )}
      href={href ?? "/"}
      onClick={handleClick}
      title="戻る"
    >
      <ArrowLeft aria-hidden="true" className="size-5" />
      {withLabel ? "戻る" : null}
    </Link>
  );
}
