import { Skeleton } from "@/components/ui/skeleton";

interface ListSkeletonProps {
  count?: number;
}

function PdCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: ListSkeletonProps) {
  const rows = Array.from({ length: count }, (_, index) => `skeleton-${index}`);

  return (
    <output aria-label="読み込み中" className="block space-y-4">
      {rows.map((id) => (
        <PdCardSkeleton key={id} />
      ))}
    </output>
  );
}
