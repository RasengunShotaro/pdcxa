import Link from "next/link";
import { NextLinkLoader } from "@/components/elements/next-link-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Linkify } from "@/components/ui/linkify";
import type { RePd } from "@/feature/pd/types";
import { formatDateTime } from "../../utils/format-datetime";
import { PdMenu } from "../pd/pd-menu";
import { PopOverLike } from "../pd/pop-over-like";
import { Like } from "./repd-like";

interface PdItemProps {
  rePd: RePd;
}

const RePdItem: React.FC<PdItemProps> = ({ rePd }) => {
  const userDetail = rePd.userDetail;

  return (
    <Card key={rePd.id}>
      <CardHeader className="p-4 pt-0 pb-0">
        <div className="flex justify-between items-start">
          <Link href={`/user/${userDetail?.userName}`}>
            <div className="flex items-center space-x-3 hover:bg-accent rounded-lg -m-1 p-1">
              <Avatar className="h-10 w-10">
                {userDetail?.imageUrl && (
                  <AvatarImage
                    alt={userDetail.userFullName}
                    src={userDetail.imageUrl}
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
              <NextLinkLoader />
            </div>
          </Link>
          <PdMenu pd={rePd} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <Linkify>
          <p className="whitespace-pre-wrap break-all">{rePd.content}</p>
        </Linkify>
      </CardContent>
      <CardFooter className="p-4 pt-0 pb-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">
            {formatDateTime(rePd.createdAt)}
          </span>
          <div className="flex items-center space-x-0.5">
            <PopOverLike userNames={rePd.likeUserNames} />
            <Like rePd={rePd} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RePdItem;
