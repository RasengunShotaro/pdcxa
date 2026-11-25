import { Skeleton } from "@/components/ui/skeleton";

export function StatsSkeleton() {
  const kpis = ["pd", "repd", "like", "author"];

  return (
    <output
      aria-label="統計を読み込み中"
      className="@container flex flex-col gap-7"
    >
      <Skeleton className="h-6 w-48" />

      <div className="grid grid-cols-2 gap-x-5 gap-y-[22px] @[620px]:grid-cols-4">
        {kpis.map((key) => (
          <div className="space-y-2" key={key}>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      <div className="grid gap-7 @[760px]:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] @[760px]:gap-10">
        <div className="border-t border-line pt-[22px]">
          <Skeleton className="h-[280px] w-full" />
        </div>

        <div className="space-y-4 border-t border-line pt-[22px]">
          {["a", "b", "c"].map((key) => (
            <div className="flex items-center gap-3" key={key}>
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </output>
  );
}
