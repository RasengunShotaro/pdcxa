import { Button } from "@/components/ui/button";
import { usePdLike } from "@/hooks/use-pd-like";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { Pd } from "../../types";

export const Like = ({
  pd,
  pdId,
  userId,
}: {
  pd: Pd;
  pdId?: string;
  userId?: string;
}) => {
  const { isLiked, toggleLike } = usePdLike({
    pd,
    pdId,
    userId,
  });

  const handleClick = () => {
    try {
      toggleLike();
    } catch {
      toast.error("いいねに失敗しました。");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`space-x-1 ${isLiked ? "!text-red-500" : ""}`}
      onClick={handleClick}
      disabled={pd.isMyPd}
    >
      <Heart className="h-4 w-4" />
      <span>{pd.likeCount}</span>
    </Button>
  );
};
