import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import Link from "next/link";

export const runtime = "edge";

export default function NotFound() {
  const message = `申し訳ありません。
お探しのページは存在しないか、現在準備中です。`;

  return (
    <div className="flex justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-bold">404</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground whitespace-pre-line">
            {message}
          </p>
          <div className="flex justify-center">
            <Button>
              <Home className="h-4 w-4" />
              <Link href="/">ホームに戻る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
