import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import type { Pd } from "../../types/pd";
import { Button } from "../ui/button";

interface PdItemProps {
  post: Pd;
}

const PdItem: React.FC<PdItemProps> = ({ post }) => {
  return (
    <Card key={post.id} className="border-b">
      <CardHeader className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-bold">{post.user}</CardTitle>
            <p className="text-sm text-gray-500">{post.username}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-900">{post.content}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            {formatTimeAgo(post.createdAt)}
          </span>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-red-500 space-x-1"
            >
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-blue-500 space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-green-500">
              <Share2 className="h-4 w-4" />
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

export default PdItem;
