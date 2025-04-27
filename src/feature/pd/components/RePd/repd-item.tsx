import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card key={rePd.id}>
      <CardHeader className="p-4 pt-0 pb-0">
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
              <p className="text-sm text-muted-foreground">{`@${
                userDetail?.username ?? ""
              }`}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <p className="whitespace-pre-wrap">{rePd.content}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 pb-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">
            {formatDateTime(rePd.createdAt)}
          </span>
          <div className="flex items-center space-x-0.5">
            <PopOverLike userIds={rePd.likes.map((like) => like.userId)} />
            <Button
              variant="ghost"
              size="sm"
              className={`space-x-1 ${isLiked ? "text-red-500" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                toggleLike();
              }}
            >
              <Heart className="h-4 w-4" />
              <span>{rePd.likeCount}</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RePdItem;
