export default function PDPLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="w-24 h-4 bg-secondary rounded" />
      </div>
      {/* Title skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 border-b border-border">
        <div className="w-20 h-3 bg-secondary rounded mb-3" />
        <div className="w-72 h-10 bg-secondary rounded" />
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Image */}
        <div className="aspect-square bg-secondary" />
        {/* Info */}
        <div className="px-6 py-10 lg:px-12 flex flex-col gap-6">
          <div className="w-36 h-8 bg-secondary rounded" />
          <div className="w-24 h-4 bg-secondary rounded" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-10 bg-secondary rounded" />
            ))}
          </div>
          <div className="w-full h-14 bg-secondary rounded" />
          <div className="grid grid-cols-3 gap-3 border-t border-b border-border py-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 bg-secondary rounded-full" />
                <div className="w-16 h-3 bg-secondary rounded" />
                <div className="w-20 h-2 bg-secondary rounded" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-secondary rounded" />
            <div className="w-4/5 h-4 bg-secondary rounded" />
            <div className="w-3/5 h-4 bg-secondary rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
