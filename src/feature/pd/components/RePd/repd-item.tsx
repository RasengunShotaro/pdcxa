import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { RePd } from "@/feature/pd/types";
import { useRePdLike } from "@/hooks/use-repd-like";
import { useUserDetail } from "@/hooks/use-user-detail";
import { Heart, MoreHorizontal } from "lucide-react";
import { formatDateTime } from "../../utils/format-datetime";
import { PopOverLike } from "../Pd/pop-over-like";

interface PdItemProps {
  rePd: RePd;
}

const RePdItem: React.FC<PdItemProps> = ({ rePd }) => {
  const userDetail = useUserDetail(rePd.userId);
  const userFullName = `${userDetail?.first_name ?? ""} ${
    userDetail?.last_name ?? ""
  }`; // 一瞬undefinedと表示されるより、何も表示されない方が良いため
  const { isLiked, toggleLike } = useRePdLike(rePd);

  return (
    <Card key={rePd.id} className="border-b">
      <CardHeader className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              {userDetail?.image_url && (
                <AvatarImage src={userDetail.image_url} alt={userFullName} />
              )}
              <AvatarFallback>
                {userFullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-bold">
                {userFullName}
              </CardTitle>
              <p className="text-sm text-gray-500">{`@${
                userDetail?.username ?? ""
              }`}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-900">{rePd.content}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            {formatDateTime(rePd.createdAt)}
          </span>
          <div className="flex items-center">
            <div className="flex mr-2">
              <PopOverLike userIds={rePd.likes.map((like) => like.userId)} />
              <Button
                variant="ghost"
                size="sm"
                className={`hover:text-red-500 space-x-1 ${
                  isLiked ? "text-red-500" : ""
                }`}
                onClick={() => toggleLike()}
              >
                <Heart className="h-4 w-4" />
                <span>{rePd.likeCount}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default RePdItem;
