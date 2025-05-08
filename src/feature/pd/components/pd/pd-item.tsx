import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Linkify } from "@/components/ui/linkify";
import { useUserDetail } from "@/hooks/use-user-detail";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Pd } from "../../types";
import { formatDateTime } from "../../utils/format-datetime";
import { PdMenu } from "./pd-menu";
import { PopOverLike } from "./pop-over-like";

interface PdItemProps {
  pd: Pd;
  like: ReactNode;
}

const PdItem: React.FC<PdItemProps> = ({ pd, like }) => {
  const userDetail = useUserDetail(pd.userId);
  const userFullName = `${userDetail?.first_name ?? ""} ${
    userDetail?.last_name ?? ""
  }`;

  return (
    <Card>
      <CardHeader className="p-4 pt-0 pb-0">
        <div className="flex justify-between items-start">
          <Link href={`/user/${userDetail?.id}`}>
            <div className="flex items-center space-x-3 hover:bg-accent rounded-lg -m-1 p-1">
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
          </Link>
          <PdMenu pd={pd} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <Linkify>
          <p className="whitespace-pre-wrap">{pd.content}</p>
        </Linkify>
      </CardContent>
      <CardFooter className="p-4 pt-0 pb-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">
            {formatDateTime(pd.createdAt)}
          </span>
          <div className="flex items-center space-x-0.5">
            <PopOverLike userIds={pd.likes.map((like) => like.userId)} />
            {like}
            <Link href={`/pd/${pd.id}`}>
              <Button variant="ghost" size="sm" className="space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span>{pd.replyCount}</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PdItem;
