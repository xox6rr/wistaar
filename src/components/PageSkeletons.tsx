import { Skeleton } from "@/components/ui/skeleton";

export const ExplorePageSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Navigation skeleton */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container-editorial">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Skeleton className="h-8 w-32" />
          <div className="hidden md:flex items-center gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </header>

    <main className="pt-24 pb-16">
      <div className="container-editorial">
        {/* Header */}
        <div className="mb-10">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-10">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

export const BookDetailSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Navigation */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container-editorial">
        <div className="flex items-center justify-between h-16">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </header>

    <main className="pt-24 pb-16">
      <div className="container-editorial">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Book cover */}
          <div>
            <Skeleton className="aspect-[2/3] w-full max-w-sm rounded-lg" />
          </div>

          {/* Book details */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-48" />
            
            <div className="flex gap-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            <div className="space-y-3 pt-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>

            <div className="flex gap-4 pt-6">
              <Skeleton className="h-12 w-36 rounded-lg" />
              <Skeleton className="h-12 w-36 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export const LibrarySkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Navigation */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container-editorial">
        <div className="flex items-center justify-between h-16">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </header>

    <main className="pt-24 pb-16">
      <div className="container-editorial">
        <div className="mb-10">
          <Skeleton className="h-10 w-40 mb-4" />
          <Skeleton className="h-5 w-64" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Book list */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-lg border border-border">
              <Skeleton className="w-16 h-24 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);
