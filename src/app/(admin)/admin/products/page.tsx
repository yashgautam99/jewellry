import Link from "next/link";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif font-bold text-white">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-6 py-2.5 bg-gradient-to-r from-[#D4A843] to-[#B8922E] text-black font-semibold text-xs uppercase tracking-wider rounded-full hover:shadow-[0_0_30px_rgba(212,168,67,0.3)] transition-all duration-500"
        >
          + Add Product
        </Link>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[#141414] to-[#1A1A1A] border border-white/5 p-6">
        <p className="text-sm text-[#6B6B6B]">
          No products added yet. Click &quot;Add Product&quot; to get started.
        </p>
      </div>
    </div>
  );
}
