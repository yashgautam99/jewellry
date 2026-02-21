import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { EditProductForm } from "./EditProductForm";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      `id, name, description, category, gender, base_price, is_featured, is_active,
       product_variants(id, material, size, price_adjustment, inventory_count, is_made_to_order),
       product_images(id, url, alt_text, display_order)`,
    )
    .eq("id", id)
    .single();

  if (!product) notFound();

  const variant = product.product_variants?.[0];
  const images = [...(product.product_images ?? [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );

  return (
    <EditProductForm product={product} variant={variant} images={images} />
  );
}
