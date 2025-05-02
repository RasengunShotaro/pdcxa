import { fetchPds } from "@/feature/pd/api/pd/fetch-pds";
import { PdTimeLine } from "@/feature/pd/components/pd/pd-timeline";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { use } from "react";
export const runtime = "edge";

export default function Page() {
  const queryClient = new QueryClient();

  use(
    queryClient.prefetchQuery({
      queryKey: ["PD詳細", null, null],
      queryFn: async () => fetchPds({}),
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PdTimeLine />
    </HydrationBoundary>
  );
}
