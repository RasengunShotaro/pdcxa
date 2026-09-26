import Link from "next/link";
import {
  formatAbsoluteDateTime,
  formatDateTime,
} from "@/feature/pd/utils/format-datetime";
import { cn } from "@/lib/utils";

interface PdTimestampProps {
  createdAt: string;
  href?: string;
  className?: string;
}

export function PdTimestamp({ createdAt, href, className }: PdTimestampProps) {
  const absolute = formatAbsoluteDateTime(createdAt);
  const time = (
    <time dateTime={createdAt} suppressHydrationWarning title={absolute}>
      {formatDateTime(createdAt)}
    </time>
  );

  if (!href) {
    return (
      <span className={cn("text-sm text-muted-foreground", className)}>
        {time}
      </span>
    );
  }

  return (
    <Link
      aria-label={`${absolute}の投稿を開く`}
      className={cn(
        "rounded-sm text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      href={href}
    >
      {time}
    </Link>
  );
}
