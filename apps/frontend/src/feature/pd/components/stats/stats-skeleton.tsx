import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsSkeleton() {
  const kpis = ["pd", "repd", "like", "author"];

  return (
    <output aria-label="統計を読み込み中" className="block space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((key) => (
          <Card key={key}>
            <CardContent className="space-y-2 p-5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          {["a", "b", "c"].map((key) => (
            <div className="flex items-center gap-3" key={key}>
              <Skeleton className="size-7 rounded-full" />
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </output>
  );
}
