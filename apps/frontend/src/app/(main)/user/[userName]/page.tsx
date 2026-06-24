import { UserPdTimeLine } from "@/feature/pd/components/pd/user-pd-timeline";

interface UserPageProps {
  params: Promise<{
    userName: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { userName } = await params;

  return <UserPdTimeLine userId={userName} />;
}
