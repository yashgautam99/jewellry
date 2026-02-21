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
    is_featured: formData.get("is_featured") === "true",
    is_active: formData.get("is_active") === "true",
  };

  const { data, error } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();

  if (error) throw new Error(error.message);

  const variantData = {
    product_id: data.id,
    sku: `${slug}-default`,
    material: formData.get("material") as string,
    size: (formData.get("size") as string) || null,
    price_adjustment:
      parseFloat(formData.get("price_adjustment") as string) || 0,
    inventory_count: parseInt(formData.get("inventory_count") as string) || 0,
    is_made_to_order: formData.get("is_made_to_order") === "true",
  };

  await supabase.from("product_variants").insert(variantData);

  // Handle image URL if provided
  const imageUrl = formData.get("image_url") as string;
  if (imageUrl?.trim()) {
    await supabase.from("product_images").insert({
      product_id: data.id,
      url: imageUrl.trim(),
      alt_text: name,
      display_order: 0,
    });
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createAdminClient();

  const productData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    gender: formData.get("gender") as string,
    base_price: parseFloat(formData.get("base_price") as string),
    is_featured: formData.get("is_featured") === "on",
    is_active: formData.get("is_active") === "on",
  };

  await supabase.from("products").update(productData).eq("id", id);

  // Update variant if provided
  const variantId = formData.get("variant_id") as string;
  if (variantId) {
    await supabase
      .from("product_variants")
      .update({
        material: formData.get("material") as string,
        size: (formData.get("size") as string) || null,
        price_adjustment:
          parseFloat(formData.get("price_adjustment") as string) || 0,
        inventory_count:
          parseInt(formData.get("inventory_count") as string) || 0,
        is_made_to_order: formData.get("is_made_to_order") === "on",
      })
      .eq("id", variantId);
  }

  // Add new image if URL provided
  const imageUrl = formData.get("image_url") as string;
  if (imageUrl?.trim()) {
    const { data: existingImages } = await supabase
      .from("product_images")
      .select("display_order")
      .eq("product_id", id)
      .order("display_order", { ascending: false })
      .limit(1);
    const nextOrder = (existingImages?.[0]?.display_order ?? -1) + 1;
    await supabase.from("product_images").insert({
      product_id: id,
      url: imageUrl.trim(),
      alt_text: productData.name,
      display_order: nextOrder,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  redirect("/admin/products");
}

export async function toggleProductActive(id: string, currentState: boolean) {
  const supabase = createAdminClient();
  await supabase
    .from("products")
    .update({ is_active: !currentState })
    .eq("id", id);
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = createAdminClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
}

export async function deleteProductImage(imageId: string, productId: string) {
  const supabase = createAdminClient();
  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath(`/admin/products/${productId}/edit`);
}
