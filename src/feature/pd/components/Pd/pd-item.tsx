import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { usePdLike } from "@/hooks/use-pd-like";
import { useUserDetail } from "@/hooks/use-user-detail";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { Pd } from "../../types";
import { formatDateTime } from "../../utils/format-datetime";
import { PopOverLike } from "./pop-over-like";

interface PdItemProps {
  pd: Pd;
}

const PdItem: React.FC<PdItemProps> = ({ pd }) => {
  const userDetail = useUserDetail(pd.userId);
  const userFullName = `${userDetail?.first_name ?? ""} ${
    userDetail?.last_name ?? ""
  }`;
  const { isLiked, toggleLike } = usePdLike(pd);

  return (
    <Card key={pd.id}>
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
        <p className="text-gray-900 whitespace-pre-wrap">{pd.content}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            {formatDateTime(pd.createdAt)}
          </span>
          <div className="flex items-center">
            <div className="flex mr-2">
              <PopOverLike userIds={pd.likes.map((like) => like.userId)} />
              <Button
                variant="ghost"
                size="sm"
                className={`hover:text-red-500 space-x-1 ${
                  isLiked ? "text-red-500" : ""
                }`}
                onClick={() => toggleLike()}
              >
                <Heart className="h-4 w-4" />
                <span>{pd.likeCount}</span>
              </Button>
            </div>
            <Link href={`/pd/${pd.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-blue-500 space-x-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{pd.replyCount}</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PdItem;
