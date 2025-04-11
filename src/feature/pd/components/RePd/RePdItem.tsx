import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { RePd } from "@/feature/pd/types";
import { useUserDetail } from "@/hooks/useUserDetail";
import { Heart, MoreHorizontal } from "lucide-react";
interface PdItemProps {
  rePd: RePd;
}

const RePdItem: React.FC<PdItemProps> = ({ rePd }) => {
  const userDetail = useUserDetail(rePd.userId);
  const userFullName = `${userDetail?.first_name ?? ""} ${
    userDetail?.last_name ?? ""
  }`; // 一瞬undefinedと表示されるより、何も表示されない方が良いため

  return (
    <Card key={rePd.id} className="border-b">
      <CardHeader className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-bold">
              {userFullName}
            </CardTitle>
            <p className="text-sm text-gray-500">{`@${
              userDetail?.username ?? ""
            }`}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-900">{rePd.content}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            {formatTimeAgo(rePd.createdAt)}
          </span>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-red-500 space-x-1"
            >
              <Heart className="h-4 w-4" />
              <span>{rePd.likes.length}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}秒前`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}時間前`;
  return `${Math.floor(seconds / 86400)}日前`;
}

export default RePdItem;
