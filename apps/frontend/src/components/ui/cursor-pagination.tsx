import { ChevronDown, Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type ButtonProps = ComponentProps<typeof Button>;

interface CursorPaginationProps extends ButtonProps {
  hasNextPage: boolean;
  isLoading: boolean;
  onNextPage: () => void;
}

export function CursorPagination({
  hasNextPage,
  isLoading,
  onNextPage,
  className,
  ...props
}: CursorPaginationProps) {
  return (
    <Button
      className={cn(`${hasNextPage ? "" : "invisible"}`, className)}
      disabled={isLoading}
      onClick={onNextPage}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <ChevronDown />}
      さらに読み込む
    </Button>
  );
}
