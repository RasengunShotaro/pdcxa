import type { HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface CursorPaginationProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * 次のページがあるかどうか
   */
  hasNextPage: boolean;
  /**
   * 前のページがあるかどうか
   */
  hasPreviousPage: boolean;
  /**
   * ローディング中かどうか
   */
  isLoading?: boolean;
  /**
   * 次のページに移動する関数
   */
  onNextPage: () => void;
  /**
   * 前のページに移動する関数
   */
  onPreviousPage: () => void;
}

/**
 * カーソルベースのページネーションコンポーネント
 * ページ番号の概念がなく、次へ・前へのナビゲーションのみを提供します
 */
export function CursorPagination({
  hasNextPage,
  hasPreviousPage,
  isLoading = false,
  onNextPage,
  onPreviousPage,
  className,
  ...props
}: CursorPaginationProps) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousPage}
        disabled={!hasPreviousPage || isLoading}
        aria-label="前のページ"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onNextPage}
        disabled={!hasNextPage || isLoading}
        aria-label="次のページ"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
