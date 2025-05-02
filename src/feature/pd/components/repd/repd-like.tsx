import { Button } from "@/components/ui/button";
import { useRePdLike } from "@/hooks/use-repd-like";
import { Heart } from "lucide-react";
import { useTransition } from "react";
import type { RePd } from "../../types";

export const Like = ({ rePd }: { rePd: RePd }) => {
  const { isLiked, toggleLike } = useRePdLike(rePd);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      toggleLike();
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`space-x-1 ${isLiked ? "!text-red-500" : ""}`}
      onClick={handleClick}
      disabled={isPending}
    >
      <Heart className="h-4 w-4" />
      <span>{rePd.likeCount}</span>
    </Button>
  );
};
