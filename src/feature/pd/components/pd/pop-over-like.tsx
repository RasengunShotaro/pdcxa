import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PopOverLikeProps = {
  userNames: string[];
};

export const PopOverLike = ({ userNames }: PopOverLikeProps) => {
  return (
    <Popover>
      <PopoverTrigger className="text-sm">いいね</PopoverTrigger>
      <PopoverContent className="flex-col border-2 w-fit">
        {userNames.length > 0 ? (
          <>
            <div className="text-lg font-bold">いいねしたユーザー</div>
            {userNames.map((userName) => (
              <div key={userName} className="text-muted-foreground font-light">
                {userName}
              </div>
            ))}
          </>
        ) : (
          <div className="text-muted-foreground font-light">
            いいねしたユーザーはまだいません
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
