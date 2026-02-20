"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const supabase = createAdminClient();

  const name = formData.get("name") as string;
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const productData = {
    name,
    slug,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    gender: formData.get("gender") as string,
    base_price: parseFloat(formData.get("base_price") as string),
    is_active: formData.get("is_active") === "true",
  };

  const { data, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Create a default variant
  const variantData = {
    product_id: data.id,
    sku: `${slug}-default`,
    material: formData.get("material") as string,
    size: formData.get("size") as string,
    price_adjustment: 0,
    inventory_count: parseInt(formData.get("inventory_count") as string) || 0,
    is_made_to_order: formData.get("is_made_to_order") === "true",
  };

  const { error: variantError } = await supabase
    .from("product_variants")
    .insert(variantData);

  if (variantError) {
    console.error("Variant error", variantError);
    // Could delete the product here to rollback, but fine for now
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
}
