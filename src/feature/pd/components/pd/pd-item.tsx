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
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Pd } from "../../types";
import { formatDateTime } from "../../utils/format-datetime";
import { PdImage } from "./pd-image";
import { PdMenu } from "./pd-menu";
import { PopOverLike } from "./pop-over-like";

interface PdItemProps {
  pd: Pd;
  like: ReactNode;
}

const PdItem: React.FC<PdItemProps> = ({ pd, like }) => {
  const userDetail = pd.userDetail;

  return (
    <Card>
      <CardHeader className="p-4 pt-0 pb-0">
        <div className="flex justify-between items-start">
          <Link href={`/user/${userDetail?.id}`}>
            <div className="flex items-center space-x-3 hover:bg-accent rounded-lg -m-1 p-1">
              <Avatar className="h-10 w-10">
                {userDetail?.imageUrl && (
                  <AvatarImage
                    src={userDetail.imageUrl}
                    alt={userDetail.userFullName}
                  />
                )}
                <AvatarFallback>
                  {userDetail.userFullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base font-bold">
                  {userDetail.userFullName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{`@${
                  userDetail?.userName ?? ""
                }`}</p>
              </div>
            </div>
          </Link>
          <PdMenu pd={pd} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <Linkify>
          <p className="whitespace-pre-wrap break-all">{pd.content}</p>
        </Linkify>
        <PdImage imageFileName={pd.imageFileName} />
      </CardContent>
      <CardFooter className="p-4 pt-0 pb-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">
            {formatDateTime(pd.createdAt)}
          </span>
          <div className="flex items-center space-x-0.5">
            <PopOverLike userNames={pd.likeUserNames} />
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
