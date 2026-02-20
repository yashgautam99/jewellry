import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#141414] to-[#0A0A0A]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4A843]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D4A843]/8 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-[#D4A843] mb-6 font-medium">
            ✦ Handcrafted Excellence ✦
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-8">
            <span className="bg-gradient-to-r from-[#D4A843] via-[#FFE699] to-[#D4A843] bg-clip-text text-transparent">
              Timeless
            </span>
            <br />
            <span className="text-white">Elegance</span>
          </h1>
          <p className="text-lg md:text-xl text-[#A3A3A3] max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover our curated collection of exquisite jewellery, where every
            piece tells a story of artistry and sophistication.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="px-10 py-4 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-black font-semibold text-sm uppercase tracking-wider rounded-full hover:shadow-[0_0_40px_rgba(212,168,67,0.3)] transition-all duration-500 hover:scale-105"
            >
              Explore Collections
            </Link>
            <Link
              href="/products"
              className="px-10 py-4 border border-white/10 text-white font-medium text-sm uppercase tracking-wider rounded-full hover:border-[#D4A843]/50 hover:text-[#D4A843] transition-all duration-500"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4A843] mb-3">
              Our Collections
            </p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
              Curated For You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Rings", desc: "Symbols of eternal love", icon: "💍" },
              { name: "Necklaces", desc: "Grace your neckline", icon: "📿" },
              { name: "Bracelets", desc: "Adorn your wrist", icon: "✨" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href="/products"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 p-10 hover:border-[#D4A843]/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A843]/5 rounded-full blur-2xl group-hover:bg-[#D4A843]/10 transition-all duration-500" />
                <span className="text-4xl mb-6 block">{cat.icon}</span>
                <h3 className="text-xl font-serif font-semibold text-white mb-2 group-hover:text-[#D4A843] transition-colors duration-300">
                  {cat.name}
                </h3>
                <p className="text-sm text-[#6B6B6B]">{cat.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-xs text-[#D4A843] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>View Collection</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-[#141414]/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: "🔒",
                title: "Secure Payment",
                desc: "Stripe-powered checkout",
              },
              {
                icon: "🚚",
                title: "Free Shipping",
                desc: "On orders over ₹5,000",
              },
              {
                icon: "💎",
                title: "Certified Gems",
                desc: "Authenticity guaranteed",
              },
              {
                icon: "↩️",
                title: "Easy Returns",
                desc: "30-day return policy",
              },
            ].map((feat) => (
              <div key={feat.title} className="text-center p-6">
                <span className="text-2xl mb-4 block">{feat.icon}</span>
                <h4 className="text-sm font-semibold text-white mb-1">
                  {feat.title}
                </h4>
                <p className="text-xs text-[#6B6B6B]">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
