export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="h-[92vh] bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>
    </div>
  );
}
