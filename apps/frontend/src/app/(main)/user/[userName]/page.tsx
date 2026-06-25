import { UserTimelineView } from "@/feature/user/components/user-timeline-view";

interface UserPageProps {
  params: Promise<{
    userName: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { userName } = await params;

  return <UserTimelineView userName={userName} />;
}
