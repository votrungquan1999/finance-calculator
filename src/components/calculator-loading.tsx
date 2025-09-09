import { Skeleton } from "src/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "src/components/ui/card";

/**
 * Loading skeleton component for calculator pages
 */
export function CalculatorLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-10 w-96 mb-2" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>

      {/* Form skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Form fields skeleton */}
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: false positive
                  key={i}
                  className="space-y-2"
                >
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
