"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const STORAGE_BUCKET = "product-images";

export type ActionResult = {
  success: boolean;
  error?: string;
  productId?: string;
};

// ─── helpers ────────────────────────────────────────────────────────────────

async function uploadImageFile(
  supabase: ReturnType<typeof createAdminClient>,
  file: File,
  productId: string,
): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${productId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[uploadImageFile] Storage error:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ─── createProduct ───────────────────────────────────────────────────────────

export async function createProduct(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createAdminClient();

  // ── 1. Validate required fields ──────────────────────────────────────────
  const name = (formData.get("name") as string)?.trim();
  const category = formData.get("category") as string;
  const gender = formData.get("gender") as string;
  const basePriceRaw = formData.get("base_price") as string;
  const material = (formData.get("material") as string)?.trim();

  if (!name) return { success: false, error: "Product name is required." };
  if (!category) return { success: false, error: "Category is required." };
  if (!gender) return { success: false, error: "Gender is required." };
  if (!material) return { success: false, error: "Material is required." };

  const base_price = parseFloat(basePriceRaw);
  if (isNaN(base_price) || base_price <= 0)
    return { success: false, error: "Base price must be a positive number." };

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // ── 2. Insert product ─────────────────────────────────────────────────────
  const { data: product, error: productErr } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description: (formData.get("description") as string) || null,
      category,
      gender,
      base_price,
      is_featured: formData.get("is_featured") === "true",
      is_active: formData.get("is_active") === "true",
    })
    .select("id")
    .single();

  if (productErr) {
    console.error("[createProduct] product insert:", productErr);
    const msg =
      productErr.code === "23505"
        ? "A product with this name already exists."
        : `Database error: ${productErr.message}`;
    return { success: false, error: msg };
  }

  const productId = product.id;

  // ── 3. Insert variant ─────────────────────────────────────────────────────
  const inventoryCount =
    parseInt(formData.get("inventory_count") as string) || 0;
  const { error: variantErr } = await supabase.from("product_variants").insert({
    product_id: productId,
    sku: `${slug}-default`,
    material,
    size: (formData.get("size") as string) || null,
    price_adjustment:
      parseFloat(formData.get("price_adjustment") as string) || 0,
    inventory_count: inventoryCount,
    is_made_to_order: formData.get("is_made_to_order") === "true",
    show_out_of_stock_label: formData.get("show_out_of_stock_label") === "true",
  });

  if (variantErr) {
    // Rollback: remove the product we just created
    console.error("[createProduct] variant insert:", variantErr);
    await supabase.from("products").delete().eq("id", productId);
    return { success: false, error: `Variant error: ${variantErr.message}` };
  }

  // ── 4. Upload / link image ────────────────────────────────────────────────
  const imageFile = formData.get("image_file") as File | null;
  const imageUrl = (formData.get("image_url") as string)?.trim();

  let finalImageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    finalImageUrl = await uploadImageFile(supabase, imageFile, productId);
    if (!finalImageUrl) {
      // Image upload failed — product + variant are saved. Return success
      // but warn user (non-critical path — product can function without image).
      console.warn(
        "[createProduct] Image upload failed for product",
        productId,
      );
    }
  } else if (imageUrl) {
    finalImageUrl = imageUrl;
  }

  if (finalImageUrl) {
    await supabase.from("product_images").insert({
      product_id: productId,
      url: finalImageUrl,
      alt_text: name,
      display_order: 0,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");

  return {
    success: true,
    productId,
    ...(imageFile && imageFile.size > 0 && !finalImageUrl
      ? {
          error:
            "Product saved, but image upload failed. You can add it from the edit page.",
        }
      : {}),
  };
}

// ─── updateProduct ───────────────────────────────────────────────────────────

export async function updateProduct(
  id: string,
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = createAdminClient();

  const name = (formData.get("name") as string)?.trim();
  if (!name) return { success: false, error: "Product name is required." };

  const base_price = parseFloat(formData.get("base_price") as string);
  if (isNaN(base_price) || base_price <= 0)
    return { success: false, error: "Base price must be a positive number." };

  const { error: prodErr } = await supabase
    .from("products")
    .update({
      name,
      description: (formData.get("description") as string) || null,
      category: formData.get("category") as string,
      gender: formData.get("gender") as string,
      base_price,
      is_featured: formData.get("is_featured") === "on",
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);

  if (prodErr) {
    console.error("[updateProduct] product update:", prodErr);
    return { success: false, error: `Update failed: ${prodErr.message}` };
  }

  const variantId = formData.get("variant_id") as string;
  if (variantId) {
    const { error: varErr } = await supabase
      .from("product_variants")
      .update({
        material: formData.get("material") as string,
        size: (formData.get("size") as string) || null,
        price_adjustment:
          parseFloat(formData.get("price_adjustment") as string) || 0,
        inventory_count:
          parseInt(formData.get("inventory_count") as string) || 0,
        is_made_to_order: formData.get("is_made_to_order") === "on",
        show_out_of_stock_label:
          formData.get("show_out_of_stock_label") === "on",
      })
      .eq("id", variantId);

    if (varErr) {
      console.error("[updateProduct] variant update:", varErr);
      return {
        success: false,
        error: `Variant update failed: ${varErr.message}`,
      };
    }
  }

  // Image: prefer file upload, fallback to URL
  const imageFile = formData.get("image_file") as File | null;
  const imageUrl = (formData.get("image_url") as string)?.trim();

  let newImageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    newImageUrl = await uploadImageFile(supabase, imageFile, id);
  } else if (imageUrl) {
    newImageUrl = imageUrl;
  }

  if (newImageUrl) {
    const { data: existingImages } = await supabase
      .from("product_images")
      .select("display_order")
      .eq("product_id", id)
      .order("display_order", { ascending: false })
      .limit(1);
    const nextOrder = (existingImages?.[0]?.display_order ?? -1) + 1;
    await supabase.from("product_images").insert({
      product_id: id,
      url: newImageUrl,
      alt_text: name,
      display_order: nextOrder,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/products/${id}`);

  return { success: true, productId: id };
}

// ─── toggleProductActive ─────────────────────────────────────────────────────

export async function toggleProductActive(id: string, currentState: boolean) {
  const supabase = createAdminClient();
  await supabase
    .from("products")
    .update({ is_active: !currentState })
    .eq("id", id);
  revalidatePath("/admin/products");
}

// ─── deleteProduct ────────────────────────────────────────────────────────────

export async function deleteProduct(id: string): Promise<ActionResult> {
  const supabase = createAdminClient();

  // Clean up storage images
  const { data: images } = await supabase
    .from("product_images")
    .select("url")
    .eq("product_id", id);

  if (images && images.length > 0) {
    const paths = images
      .map((img) => {
        const url = img.url as string;
        const match = url.match(/product-images\/(.+)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];
    if (paths.length > 0) {
      await supabase.storage.from(STORAGE_BUCKET).remove(paths);
    }
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/products");
  return { success: true };
}

// ─── deleteProductImage ───────────────────────────────────────────────────────

export async function deleteProductImage(
  imageId: string,
  productId: string,
): Promise<ActionResult> {
  const supabase = createAdminClient();

  const { data: img } = await supabase
    .from("product_images")
    .select("url")
    .eq("id", imageId)
    .single();

  if (img?.url) {
    const match = (img.url as string).match(/product-images\/(.+)$/);
    if (match) {
      await supabase.storage.from(STORAGE_BUCKET).remove([match[1]]);
    }
  }

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);
  if (error) return { success: false, error: error.message };

  revalidatePath(`/admin/products/${productId}/edit`);
  return { success: true };
}
