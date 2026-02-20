import Link from "next/link";

export default function CartPage() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
          Shopping Cart
        </h1>

        {/* Empty Cart State */}
        <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 p-16 text-center">
          <span className="text-6xl block mb-6">🛒</span>
          <h2 className="text-xl font-serif text-white mb-3">
            Your cart is empty
          </h2>
          <p className="text-sm text-[#6B6B6B] mb-8">
            Discover our exquisite collections and find something you love.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-black font-semibold text-sm uppercase tracking-wider rounded-full hover:shadow-[0_0_40px_rgba(212,168,67,0.3)] transition-all duration-500"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
