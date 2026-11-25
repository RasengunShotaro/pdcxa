import { UserReadDefault } from "@/feature/pd/components/timeline/timeline-read-default";

interface UserPageProps {
  params: Promise<{
    userName: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { userName } = await params;

  return <UserReadDefault userName={userName} />;
}
