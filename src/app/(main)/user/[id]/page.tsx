import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
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

  await queryClient.prefetchQuery({
    queryKey: ["PD詳細", null, unwrapParams.id],
    queryFn: () => fetchPds({ userId: unwrapParams.id }),
  });

  return (
    <Suspense fallback={<PdItemSkeleton PD数={5} />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UserPdTimeLine userId={unwrapParams.id} />
      </HydrationBoundary>
    </Suspense>
  );
}
