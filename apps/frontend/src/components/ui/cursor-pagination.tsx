import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
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
      onClick={onNextPage}
      disabled={isLoading}
      className={cn(`${hasNextPage ? "" : "invisible"}`, className)}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <ChevronDown />}
      さらに読み込む
    </Button>
  );
}
