export default function OrdersPage() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
          Your Orders
        </h1>

        {/* Empty State */}
        <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 p-16 text-center">
          <span className="text-6xl block mb-6">📦</span>
          <h2 className="text-xl font-serif text-white mb-3">No orders yet</h2>
          <p className="text-sm text-[#6B6B6B]">
            Once you place an order, it will appear here.
          </p>
        </div>
      </div>
    </section>
  );
}
