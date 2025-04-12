import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { RePd } from "@/feature/pd/types";
import { useRePdLike } from "@/hooks/useRePdLike";
import { useUserDetail } from "@/hooks/useUserDetail";
import { Heart, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { formatDateTime } from "../../utils/format-datetime";
interface PdItemProps {
  rePd: RePd;
}

const RePdItem: React.FC<PdItemProps> = ({ rePd }) => {
  const userDetail = useUserDetail(rePd.userId);
  const userFullName = `${userDetail?.first_name ?? ""} ${
    userDetail?.last_name ?? ""
  }`; // 一瞬undefinedと表示されるより、何も表示されない方が良いため
  const { rePdLike, mutateRePdLike } = useRePdLike(rePd.id);

  const isContainsMyLike = rePdLike.some(
    (like) => like.userId === userDetail?.id
  );

  return (
    <Card key={rePd.id} className="border-b">
      <CardHeader className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden">
              {userDetail?.image_url ? (
                <Image
                  src={userDetail.image_url}
                  alt={userFullName}
                  fill
                  className="object-cover"
                />
              ) : undefined}
            </div>
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
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`hover:text-red-500 space-x-1 ${
                isContainsMyLike ? "text-red-500" : ""
              }`}
              onClick={() => mutateRePdLike()}
            >
              <Heart className="h-4 w-4" />
              <span>{rePdLike.length}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default RePdItem;
