import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserDetails } from "@/hooks/use-user-details";

type PopOverLikeProps = {
  userIds: string[];
};

export const PopOverLike = ({ userIds }: PopOverLikeProps) => {
  const userDetails = useUserDetails(userIds);

  const userFullNames = userDetails.map((userDetail) => {
    return `${userDetail?.first_name ?? ""} ${userDetail?.last_name ?? ""}`;
  });

  return (
    <Popover>
      <PopoverTrigger className="text-sm">いいね</PopoverTrigger>
      <PopoverContent className="flex-col border-2 w-fit">
        {userDetails.length > 0 ? (
          <>
            <div className="text-lg font-bold">いいねしたユーザー</div>
            {userFullNames.map((userFullName) => (
              <div
                key={userFullName}
                className="text-muted-foreground font-light"
              >
                {userFullName}
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
