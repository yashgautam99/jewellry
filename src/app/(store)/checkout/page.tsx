export default function CheckoutPage() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Info */}
          <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 p-8">
            <h2 className="text-lg font-serif font-semibold text-white mb-6">
              Shipping Information
            </h2>
            <div className="space-y-4">
              {["Full Name", "Email", "Address", "City", "Pincode"].map(
                (label) => (
                  <div key={label}>
                    <label className="block text-xs uppercase tracking-widest text-[#6B6B6B] mb-2">
                      {label}
                    </label>
                    <input
                      type="text"
                      placeholder={label}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/5 text-white text-sm focus:outline-none focus:border-[#D4A843]/50 transition-colors"
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 p-8">
            <h2 className="text-lg font-serif font-semibold text-white mb-6">
              Order Summary
            </h2>
            <div className="flex items-center justify-between py-3 border-b border-white/5 text-sm text-[#A3A3A3]">
              <span>No items in cart</span>
              <span>₹0</span>
            </div>
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-white font-semibold">Total</span>
              <span className="text-[#D4A843] font-semibold text-lg">₹0</span>
            </div>
            <button className="w-full mt-6 py-4 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-black font-semibold text-sm uppercase tracking-wider rounded-full hover:shadow-[0_0_40px_rgba(212,168,67,0.3)] transition-all duration-500">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
