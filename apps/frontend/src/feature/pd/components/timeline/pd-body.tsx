import { Linkify } from "@/components/ui/linkify";
import { cn } from "@/lib/utils";

interface PdBodyProps {
  content: string;
  className?: string;
}

export function PdBody({ content, className }: PdBodyProps) {
  return (
    <p
      className={cn(
        "whitespace-pre-wrap break-words text-[0.9375rem] leading-[1.8] text-ink [overflow-wrap:anywhere]",
        className,
      )}
    >
      <Linkify>{content}</Linkify>
    </p>
  );
}
