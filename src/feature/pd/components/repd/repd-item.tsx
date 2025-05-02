import {} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Linkify } from "@/components/ui/linkify";
import type { RePd } from "@/feature/pd/types";
import { useUserDetail } from "@/hooks/use-user-detail";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDateTime } from "../../utils/format-datetime";
import { PopOverLike } from "../pd/pop-over-like";
import { Like } from "./repd-like";

interface PdItemProps {
  rePd: RePd;
}

const RePdItem: React.FC<PdItemProps> = ({ rePd }) => {
  const userDetail = useUserDetail(rePd.userId);
  const userFullName = `${userDetail?.first_name ?? ""} ${
    userDetail?.last_name ?? ""
  }`; // 一瞬undefinedと表示されるより、何も表示されない方が良いため

  return (
    <Card key={rePd.id}>
      <CardHeader className="p-4 pt-0 pb-0">
        <div className="flex justify-between items-start">
          <Link href={`/user/${userDetail?.id}`}>
            <div className="flex items-center space-x-3 hover:bg-accent rounded-lg -m-1 p-1">
              {userDetail?.image_url && (
                <Image
                  src={userDetail.image_url}
                  alt={userFullName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 pb-2">
        <Linkify>
          <p className="whitespace-pre-wrap">{rePd.content}</p>
        </Linkify>
      </CardContent>
      <CardFooter className="p-4 pt-0 pb-0">
        <div className="flex items-center justify-between w-full">
          <span className="text-sm text-muted-foreground">
            {formatDateTime(rePd.createdAt)}
          </span>
          <div className="flex items-center space-x-0.5">
            <PopOverLike userIds={rePd.likes.map((like) => like.userId)} />
            <Like rePd={rePd} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RePdItem;
