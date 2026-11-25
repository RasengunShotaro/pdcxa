import { Home } from "lucide-react";
import Link from "next/link";
import { SinglePane } from "@/components/elements/feed-layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const message = `申し訳ありません。
お探しのページは存在しないか、現在準備中です。`;

  return (
    <SinglePane>
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-[72px]">
        <h1 className="text-center text-[2.5rem] leading-[1.15] font-bold text-ink">
          404
        </h1>
        <p className="text-center text-[0.9375rem] leading-[1.7] whitespace-pre-line text-ink-3">
          {message}
        </p>
        <Button asChild className="rounded-full">
          <Link href="/">
            <Home className="size-4" />
            ホームに戻る
          </Link>
        </Button>
      </div>
    </SinglePane>
  );
}
