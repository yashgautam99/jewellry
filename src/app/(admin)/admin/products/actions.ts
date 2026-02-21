"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const STORAGE_BUCKET = "product-images";

/**
 * Upload a product image file to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadProductImage(
  formData: FormData,
  productId: string,
): Promise<string | null> {
  const supabase = createAdminClient();
  const file = formData.get("image_file") as File | null;
  if (!file || file.size === 0) return null;

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${productId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("[uploadProductImage] Storage error:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

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

  const inventoryCount =
    parseInt(formData.get("inventory_count") as string) || 0;
  const variantData = {
    product_id: data.id,
    sku: `${slug}-default`,
    material: (formData.get("material") as string) || "18K Gold",
    size: (formData.get("size") as string) || null,
    price_adjustment:
      parseFloat(formData.get("price_adjustment") as string) || 0,
    inventory_count: inventoryCount,
    is_made_to_order: formData.get("is_made_to_order") === "true",
    show_out_of_stock_label: formData.get("show_out_of_stock_label") === "true",
  };

  await supabase.from("product_variants").insert(variantData);

  // Handle image: prefer file upload, fallback to URL text input
  const imageFile = formData.get("image_file") as File | null;
  const imageUrl = formData.get("image_url") as string;

  let finalImageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop() ?? "jpg";
    const path = `${data.id}/${Date.now()}.${ext}`;
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, imageFile, { contentType: imageFile.type, upsert: false });

    if (!storageError) {
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
      finalImageUrl = urlData.publicUrl;
    } else {
      console.error(
        "[createProduct] Storage upload error:",
        storageError.message,
      );
    }
  } else if (imageUrl?.trim()) {
    finalImageUrl = imageUrl.trim();
  }

  if (finalImageUrl) {
    await supabase.from("product_images").insert({
      product_id: data.id,
      url: finalImageUrl,
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

  // Update primary variant if provided
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
        show_out_of_stock_label:
          formData.get("show_out_of_stock_label") === "on",
      })
      .eq("id", variantId);
  }

  // Image upload: prefer file, fallback to URL
  const imageFile = formData.get("image_file") as File | null;
  const imageUrl = formData.get("image_url") as string;

  let newImageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop() ?? "jpg";
    const path = `${id}/${Date.now()}.${ext}`;
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, imageFile, { contentType: imageFile.type, upsert: false });

    if (!storageError) {
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
      newImageUrl = urlData.publicUrl;
    } else {
      console.error(
        "[updateProduct] Storage upload error:",
        storageError.message,
      );
    }
  } else if (imageUrl?.trim()) {
    newImageUrl = imageUrl.trim();
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
  // Delete storage images first
  const { data: images } = await supabase
    .from("product_images")
    .select("url")
    .eq("product_id", id);

  if (images && images.length > 0) {
    const paths = images
      .map((img) => {
        const url = img.url as string;
        // Extract path after /object/public/product-images/
        const match = url.match(/product-images\/(.+)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];

    if (paths.length > 0) {
      await supabase.storage.from(STORAGE_BUCKET).remove(paths);
    }
  }

  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/products");
}

export async function deleteProductImage(imageId: string, productId: string) {
  const supabase = createAdminClient();

  // Get URL before deleting to clean up storage
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

  await supabase.from("product_images").delete().eq("id", imageId);
  revalidatePath(`/admin/products/${productId}/edit`);
}
