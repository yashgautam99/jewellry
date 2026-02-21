export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-16">
        {/* Left column skeleton */}
        <div className="space-y-8">
          <div className="h-7 w-40 bg-secondary animate-pulse" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-24 bg-secondary animate-pulse" />
                <div className="h-12 w-full bg-secondary animate-pulse" />
              </div>
            ))}
          </div>
          <div className="h-14 w-full bg-secondary animate-pulse" />
        </div>
        {/* Right column skeleton */}
        <div className="space-y-4 border-l border-border pl-8 hidden lg:block">
          <div className="h-6 w-32 bg-secondary animate-pulse" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-16 h-16 bg-secondary animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-secondary animate-pulse" />
                <div className="h-3 w-1/2 bg-secondary animate-pulse" />
              </div>
            </div>
          ))}
          <div className="border-t border-border pt-4 space-y-2">
            <div className="h-4 w-full bg-secondary animate-pulse" />
            <div className="h-4 w-full bg-secondary animate-pulse" />
            <div className="h-5 w-full bg-secondary animate-pulse mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
