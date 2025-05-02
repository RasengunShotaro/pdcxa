import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import { fetchRePds } from "@/feature/pd/api/repd/fetch-repds";
import { PdDetail } from "@/feature/pd/components/pd/pd-detail";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { use } from "react";
export const runtime = "edge";

interface PdDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PdDetailPage({ params }: PdDetailProps) {
  const unwrapParams = use(params);
  const queryClient = new QueryClient();

  use(
    queryClient.prefetchQuery({
      queryKey: ["PD詳細", unwrapParams.id, null],
      queryFn: async () => fetchPds({ pdId: unwrapParams.id }),
    })
  );

  use(
    queryClient.prefetchQuery({
      queryKey: ["RePD詳細", unwrapParams.id],
      queryFn: async () => fetchRePds(unwrapParams.id),
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PdDetail pdId={unwrapParams.id} />
    </HydrationBoundary>
  );
}
