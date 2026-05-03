import { Skeleton } from "@/components/ui/skeleton";

export function TaskSkeleton() {
  return (
    <div className="p-4 border rounded-lg flex justify-between">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}