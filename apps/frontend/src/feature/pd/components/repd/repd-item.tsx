import { motion } from "motion/react";
import Link from "next/link";
import { NextLinkLoader } from "@/components/elements/next-link-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Linkify } from "@/components/ui/linkify";
import type { RePd } from "@/feature/pd/types";
import { formatDateTime } from "../../utils/format-datetime";
import { popInVariants } from "../../utils/motion";
import { PdMenu } from "../pd/pd-menu";
import { PopOverLike } from "../pd/pop-over-like";
import { Like } from "./repd-like";

interface PdItemProps {
  rePd: RePd;
}

const RePdItem: React.FC<PdItemProps> = ({ rePd }) => {
  const userDetail = rePd.userDetail;

  return (
    <motion.article
      initial="hidden"
      variants={popInVariants}
      viewport={{ once: true, amount: 0.3 }}
      whileInView="visible"
    >
      <Card>
        <CardHeader className="p-4 pt-0 pb-0">
          <div className="min-w-0 flex">
            <Link
              className="flex items-center space-x-3 hover:bg-accent rounded-lg -m-1 p-1 min-w-0"
              href={`/user/${userDetail?.userName}`}
            >
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
              <div className="min-w-0">
                <CardTitle className="text-base font-bold truncate">
                  {userDetail.userFullName}
                </CardTitle>
                <p className="text-sm text-muted-foreground truncate">{`@${
                  userDetail?.userName ?? ""
                }`}</p>
              </div>
              <NextLinkLoader />
            </Link>
          </div>
          <CardAction>
            <PdMenu pd={rePd} />
          </CardAction>
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
    </motion.article>
  );
};

export default RePdItem;
