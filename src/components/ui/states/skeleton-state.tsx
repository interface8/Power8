import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonVariant } from "./types";

interface Props {
  variant?: SkeletonVariant;
}

export function SkeletonState({
  variant = "table",
}: Props) {
  switch (variant) {
    case "stats":
      return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-white p-5"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-4 h-8 w-16" />
            </div>
          ))}
        </div>
      );

    case "cards":
      return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-white p-5"
            >
              <Skeleton className="h-12 w-12 rounded-xl" />

              <Skeleton className="mt-4 h-4 w-40" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
        </div>
      );

    case "list":
      return (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4"
            >
              <Skeleton className="h-10 w-10 rounded-full" />

              <div className="flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="overflow-hidden rounded-2xl border">
          <div className="border-b bg-slate-50 p-4">
            <Skeleton className="h-5 w-40" />
          </div>

          <div className="space-y-4 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-10 w-full"
              />
            ))}
          </div>
        </div>
      );
  }
}