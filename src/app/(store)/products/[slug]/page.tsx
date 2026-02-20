import Link from "next/link";

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const name = params.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-[#A3A3A3] hover:text-[#D4A843] transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 flex items-center justify-center">
            <span className="text-9xl">💎</span>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4A843] mb-3">
              Fine Jewellery
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              {name}
            </h1>
            <p className="text-3xl font-semibold text-[#D4A843] mb-6">
              ₹45,000
            </p>
            <p className="text-[#A3A3A3] leading-relaxed mb-8">
              A stunning piece from our exclusive collection. Handcrafted with
              precision using the finest materials, this jewellery piece
              embodies elegance and luxury. Each piece comes with a certificate
              of authenticity.
            </p>

            <div className="space-y-4">
              <button className="w-full py-4 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-black font-semibold text-sm uppercase tracking-wider rounded-full hover:shadow-[0_0_40px_rgba(212,168,67,0.3)] transition-all duration-500 hover:scale-[1.02]">
                Add to Cart
              </button>
              <button className="w-full py-4 border border-white/10 text-white font-medium text-sm uppercase tracking-wider rounded-full hover:border-[#D4A843]/50 hover:text-[#D4A843] transition-all duration-500">
                Add to Wishlist
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { label: "Material", value: "18K Gold" },
                { label: "Weight", value: "4.2g" },
                { label: "Certified", value: "BIS Hallmark" },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="text-center p-4 rounded-xl bg-[#141414] border border-white/5"
                >
                  <p className="text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-1">
                    {spec.label}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
