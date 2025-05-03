import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import { UserPdTimeLine } from "@/feature/pd/components/pd/user-pd-timeline";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
export const runtime = "edge";

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const unwrapParams = await params;
  const queryClient = new QueryClient();

  const pdData = await fetchPds({ userId: unwrapParams.id });
  queryClient.setQueryData(["PD詳細", null, unwrapParams.id], pdData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserPdTimeLine userId={unwrapParams.id} />
    </HydrationBoundary>
  );
}
