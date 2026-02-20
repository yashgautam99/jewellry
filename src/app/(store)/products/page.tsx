import Link from "next/link";

const demoProducts = [
  {
    slug: "diamond-solitaire-ring",
    name: "Diamond Solitaire Ring",
    price: "₹45,000",
    category: "Rings",
    emoji: "💍",
  },
  {
    slug: "gold-chain-necklace",
    name: "Gold Chain Necklace",
    price: "₹32,000",
    category: "Necklaces",
    emoji: "📿",
  },
  {
    slug: "pearl-drop-earrings",
    name: "Pearl Drop Earrings",
    price: "₹18,500",
    category: "Earrings",
    emoji: "✨",
  },
  {
    slug: "ruby-tennis-bracelet",
    name: "Ruby Tennis Bracelet",
    price: "₹55,000",
    category: "Bracelets",
    emoji: "💎",
  },
  {
    slug: "emerald-pendant",
    name: "Emerald Pendant",
    price: "₹28,000",
    category: "Necklaces",
    emoji: "🟢",
  },
  {
    slug: "sapphire-stud-earrings",
    name: "Sapphire Stud Earrings",
    price: "₹22,000",
    category: "Earrings",
    emoji: "💙",
  },
];

export default function ProductsPage() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4A843] mb-3">
            Our Collections
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
            All Jewellery
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 overflow-hidden hover:border-[#D4A843]/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#D4A843]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500">
                  {product.emoji}
                </span>
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-widest text-[#D4A843] font-medium">
                  {product.category}
                </span>
                <h3 className="text-lg font-serif font-semibold text-white mt-1 group-hover:text-[#D4A843] transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-lg font-semibold text-[#D4A843] mt-2">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
