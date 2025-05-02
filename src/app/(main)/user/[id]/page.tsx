import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import { UserPdTimeLine } from "@/feature/pd/components/pd/user-pd-timeline";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { use } from "react";
export const runtime = "edge";

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserPage({ params }: UserPageProps) {
  const unwrapParams = use(params);
  const queryClient = new QueryClient();

  use(
    queryClient.prefetchQuery({
      queryKey: ["PD詳細", null, unwrapParams.id],
      queryFn: async () => fetchPds({ userId: unwrapParams.id }),
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserPdTimeLine userId={unwrapParams.id} />
    </HydrationBoundary>
  );
}
