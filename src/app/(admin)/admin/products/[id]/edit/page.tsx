import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProduct, deleteProductImage } from "../actions";
import { ArrowLeft, Trash2 } from "lucide-react";
import Image from "next/image";

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      `
      id, name, slug, description, category, gender, base_price, is_featured, is_active,
      product_variants(id, material, size, price_adjustment, inventory_count, is_made_to_order),
      product_images(id, url, alt_text, display_order)
    `,
    )
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  const variant = product.product_variants?.[0];
  const images = [...(product.product_images ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );

  const updateWithId = updateProduct.bind(null, params.id);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Edit Product
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{product.name}</p>
        </div>
      </div>

      <form action={updateWithId} className="space-y-6">
        {/* Core product info */}
        <div className="border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Product Details
          </h2>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Name *
            </label>
            <input
              name="name"
              defaultValue={product.name}
              required
              className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={product.description ?? ""}
              rows={4}
              className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Category *
              </label>
              <select
                name="category"
                defaultValue={product.category}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
              >
                <option value="rings">Rings</option>
                <option value="pendants">Pendants</option>
                <option value="bracelets">Bracelets</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Gender *
              </label>
              <select
                name="gender"
                defaultValue={product.gender}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
              >
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Base Price (₹) *
            </label>
            <input
              name="base_price"
              type="number"
              step="0.01"
              defaultValue={product.base_price}
              required
              className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={product.is_active}
                className="w-4 h-4 accent-foreground"
              />
              <span className="text-sm text-foreground">
                Active (visible in store)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={product.is_featured}
                className="w-4 h-4 accent-foreground"
              />
              <span className="text-sm text-foreground">Featured</span>
            </label>
          </div>
        </div>

        {/* Primary Variant */}
        <div className="border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Primary Variant
          </h2>
          {variant && (
            <input type="hidden" name="variant_id" value={variant.id} />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Material *
              </label>
              <input
                name="material"
                defaultValue={variant?.material ?? "18K Gold"}
                required
                className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Size
              </label>
              <input
                name="size"
                defaultValue={variant?.size ?? ""}
                placeholder="e.g. 6, 7, 8 or Small"
                className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Price Adjustment (₹)
              </label>
              <input
                name="price_adjustment"
                type="number"
                step="0.01"
                defaultValue={variant?.price_adjustment ?? 0}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">
                Stock Count
              </label>
              <input
                name="inventory_count"
                type="number"
                defaultValue={variant?.inventory_count ?? 0}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_made_to_order"
              defaultChecked={variant?.is_made_to_order ?? false}
              className="w-4 h-4 accent-foreground"
            />
            <span className="text-sm text-foreground">Made to Order</span>
          </label>
        </div>

        {/* Images */}
        <div className="border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Images ({images.length})
          </h2>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="w-20 h-20 relative bg-secondary overflow-hidden border border-border">
                    <Image
                      src={img.url}
                      alt={img.alt_text ?? "product"}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <form
                    action={deleteProductImage.bind(null, img.id, params.id)}
                  >
                    <button
                      type="submit"
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm text-muted-foreground mb-1.5">
              Add Image URL
            </label>
            <input
              name="image_url"
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-background border border-border px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-foreground text-background text-sm tracking-[0.1em] uppercase py-3 hover:opacity-80 transition-opacity"
          >
            Save Changes
          </button>
          <Link
            href="/admin/products"
            className="px-6 border border-border text-muted-foreground text-sm tracking-wide uppercase py-3 hover:text-foreground hover:border-foreground transition-colors flex items-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
