import { cookies } from "next/headers";
import {
  一覧と詳細の幅の保存名,
  保存された一覧と詳細の幅を読む,
} from "@/components/elements/feed-layout-cookie";
import { TimelineLayout } from "@/feature/pd/components/timeline/timeline-layout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedLayout = 保存された一覧と詳細の幅を読む(
    cookieStore.get(一覧と詳細の幅の保存名)?.value,
  );

  return <TimelineLayout savedLayout={savedLayout}>{children}</TimelineLayout>;
}
