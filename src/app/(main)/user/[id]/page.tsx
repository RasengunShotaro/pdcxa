import { fetchDetailedPds } from "@/feature/pd/api/pd/fetch-detailed-pds";
import { PdItemSkeleton } from "@/feature/pd/components/pd/pd-item-skeleton";
import { UserPdTimeLine } from "@/feature/pd/components/pd/user-pd-timeline";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";
export const runtime = "edge";

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const unwrapParams = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["PD詳細", null, unwrapParams.id],
    queryFn: () => fetchDetailedPds({ userId: unwrapParams.id }),
    initialPageParam: undefined as string | undefined,
  });

  return (
    <Suspense fallback={<PdItemSkeleton PD数={5} />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserPdTimeLine userId={unwrapParams.id} />
      </HydrationBoundary>
    </Suspense>
  );
}
