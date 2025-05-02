import { Button } from "@/components/ui/button";
import { usePdLike } from "@/hooks/use-pd-like";
import { Heart } from "lucide-react";
import { useTransition } from "react";
import type { Pd } from "../../types";

export const Like = ({ pd }: { pd: Pd }) => {
  const { isLiked, toggleLike } = usePdLike(pd);
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
      <span>{pd.likeCount}</span>
    </Button>
  );
};
