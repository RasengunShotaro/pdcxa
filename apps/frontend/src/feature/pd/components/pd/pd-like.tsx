import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usePdLike } from "@/hooks/use-pd-like";
import type { Pd } from "../../types";
import { AnimatedHeart } from "../animated-heart";

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
      className="space-x-1"
      disabled={pd.isMyPd}
      onClick={handleClick}
      size="sm"
      variant="ghost"
    >
      <AnimatedHeart isActive={isLiked} />
      <span>{pd.likeCount}</span>
    </Button>
  );
};
