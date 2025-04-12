import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Pd } from "@/feature/pd/types";
import { usePdLike } from "@/hooks/usePdLike";
import { useRePd } from "@/hooks/useRePd";
import { useUserDetail } from "@/hooks/useUserDetail";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "../../utils/format-datetime";
interface PdItemProps {
  pd: Pd;
}

const PdItem: React.FC<PdItemProps> = ({ pd }) => {
  const userDetail = useUserDetail(pd.userId);
  const userFullName = `${userDetail?.first_name ?? ""} ${
    userDetail?.last_name ?? ""
  }`; // 一瞬undefinedと表示されるより、何も表示されない方が良いため
  const { rePds } = useRePd(pd.id);
  const { pdLike, mutatePdLike } = usePdLike(pd.id);

  return (
    <Card key={pd.id} className="border-b">
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
        <p className="text-gray-900">{pd.content}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            {formatDateTime(pd.createdAt)}
          </span>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-red-500 space-x-1"
              onClick={() => mutatePdLike()}
            >
              <Heart className="h-4 w-4" />
              <span>{pdLike.length}</span>
            </Button>
            <Link href={`/pd/${pd.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="hover:text-blue-500 space-x-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{rePds.length}</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PdItem;
