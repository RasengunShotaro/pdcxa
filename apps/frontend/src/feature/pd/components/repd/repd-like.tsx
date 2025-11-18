import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRePdLike } from "@/hooks/use-repd-like";
import type { RePd } from "../../types";
import { AnimatedHeart } from "../animated-heart";

export const Like = ({ rePd }: { rePd: RePd }) => {
  const { isLiked, toggleLike } = useRePdLike(rePd);

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
      disabled={rePd.isMyRePd}
      onClick={handleClick}
      size="sm"
      variant="ghost"
    >
      <AnimatedHeart isActive={isLiked} />
      <span>{rePd.likeCount}</span>
    </Button>
  );
};
