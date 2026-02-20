import { ProductSkeleton } from "@/components/common/Loaders";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-10 md:px-10">
        <div className="h-12 w-48 bg-secondary animate-pulse" />
        <div className="h-3 w-24 bg-secondary animate-pulse mt-3" />
      </div>
      <div className="flex">
        <div className="hidden md:block w-52 border-r border-border" />
        <div className="flex-1">
          <div className="h-10 border-b border-border" />
          <ProductSkeleton count={9} />
        </div>
      </div>
    </div>
  );
}
