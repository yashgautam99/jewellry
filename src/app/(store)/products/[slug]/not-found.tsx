import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 text-center px-6">
      <div className="font-serif text-[80px] font-light text-foreground/10 leading-none select-none">
        404
      </div>
      <div>
        <h1 className="font-serif text-3xl font-light italic text-foreground mb-2">
          Product not found
        </h1>
        <p className="text-[13px] text-muted-foreground max-w-sm">
          This piece may have been discontinued or the link may be incorrect.
          Browse our full collection to find your perfect match.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/products" className="btn-editorial">
          Browse Collections
        </Link>
        <Link
          href="/"
          className="border border-border text-foreground text-[11px] tracking-[0.12em] uppercase px-6 py-3 hover:bg-secondary transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
