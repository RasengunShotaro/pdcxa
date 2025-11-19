import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { NextLinkLoader } from "@/components/elements/next-link-loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Linkify } from "@/components/ui/linkify";
import type { Pd } from "../../types";
import { formatDateTime } from "../../utils/format-datetime";
import { popInVariants } from "../../utils/motion";
import { PdImage } from "./pd-image";
import { PdMenu } from "./pd-menu";
import { PopOverLike } from "./pop-over-like";
import { UserAvatar } from "./user-avatar";

interface PdItemProps {
  pd: Pd;
  like: ReactNode;
}

const PdItem: React.FC<PdItemProps> = ({ pd, like }) => {
  const userDetail = pd.userDetail;

  return (
    <motion.article
      initial="hidden"
      variants={popInVariants}
      viewport={{ once: true, amount: 0.3 }}
      whileInView="visible"
    >
      <Card>
        <CardHeader className="p-4 pt-0 pb-0">
          <div className="min-w-0">
            <Link className="block" href={`/user/${userDetail?.userName}`}>
              <div className="flex items-center space-x-3 hover:bg-accent rounded-lg -m-1 p-1">
                <UserAvatar
                  imageUrl={userDetail.imageUrl}
                  userFullName={userDetail.userFullName}
                />
                <div className="min-w-0">
                  <CardTitle className="text-base font-bold truncate">
                    {userDetail.userFullName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{`@${
                    userDetail?.userName ?? ""
                  }`}</p>
                </div>
                <NextLinkLoader />
              </div>
            </Link>
          </div>
          <CardAction>
            <PdMenu pd={pd} />
          </CardAction>
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
                <Button className="space-x-1" size="sm" variant="ghost">
                  <NextLinkLoader />
                  <MessageCircle className="h-4 w-4" />
                  <span>{pd.replyCount}</span>
                </Button>
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.article>
  );
};

export default PdItem;
