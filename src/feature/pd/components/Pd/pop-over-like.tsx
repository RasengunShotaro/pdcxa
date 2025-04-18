import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserDetail } from "@/hooks/useUserDetail";

type PopOverLikeProps = {
  userIds: string[];
};

export const PopOverLike = ({ userIds }: PopOverLikeProps) => {
  const userDetails = userIds.map((userId) => useUserDetail(userId));
  const userFullNames = userDetails.map((userDetail) => {
    return `${userDetail?.first_name ?? ""} ${userDetail?.last_name ?? ""}`;
  });

  return (
    <Popover>
      <PopoverTrigger className="text-sm">いいね</PopoverTrigger>
      <PopoverContent className="flex-col border-2 w-fit">
        <div className="text-lg font-bold">いいねしたユーザー</div>
        {userFullNames.map((userFullName) => (
          <div key={userFullName}>・ {userFullName}</div>
        ))}
      </PopoverContent>
    </Popover>
  );
};
