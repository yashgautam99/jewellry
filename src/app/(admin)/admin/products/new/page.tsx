"use client";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-white mb-8">
        Add New Product
      </h1>

      <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 p-8 max-w-2xl">
        <div className="space-y-4">
          {["Product Name", "Category", "Price (₹)", "Description"].map(
            (label) => (
              <div key={label}>
                <label className="block text-xs uppercase tracking-widest text-[#6B6B6B] mb-2">
                  {label}
                </label>
                {label === "Description" ? (
                  <textarea
                    rows={4}
                    placeholder={label}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/5 text-white text-sm focus:outline-none focus:border-[#D4A843]/50 transition-colors resize-none"
                  />
                ) : (
                  <input
                    type={label.includes("Price") ? "number" : "text"}
                    placeholder={label}
                    className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A] border border-white/5 text-white text-sm focus:outline-none focus:border-[#D4A843]/50 transition-colors"
                  />
                )}
              </div>
            ),
          )}
          <button className="w-full mt-4 py-4 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-black font-semibold text-sm uppercase tracking-wider rounded-full hover:shadow-[0_0_40px_rgba(212,168,67,0.3)] transition-all duration-500">
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
