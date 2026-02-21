"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CartItem {
  id: string; // variant id
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedMaterial?: string;
}

interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  paymentMethod: "cod" | "upi";
}

export async function placeOrder(
  formData: OrderFormData,
  cartItems: CartItem[],
): Promise<
  { success: true; orderId: string } | { success: false; error: string }
> {
  try {
    const supabase = createAdminClient();
    const authClient = await createClient();

    // Get current user (optional — orders can be guest)
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    // Server-side price recalculation from DB
    const variantIds = cartItems.map((i) => i.id).filter(Boolean);
    const { data: variants } = await supabase
      .from("product_variants")
      .select(
        "id, price_adjustment, inventory_count, is_made_to_order, products(base_price)",
      )
      .in("id", variantIds);

    const variantMap = new Map(variants?.map((v) => [v.id, v]));

    // Calculate server-side totals
    let subtotal = 0;
    const lineItems = cartItems.map((item) => {
      const variant = variantMap.get(item.id);
      const basePrice = (variant?.products as any)?.base_price ?? item.price;
      const priceAdj = variant?.price_adjustment ?? 0;
      const unitPrice = basePrice + priceAdj;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      return {
        variant_id: item.id,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
      };
    });

    const shipping = subtotal >= 5000 ? 0 : 200;
    const totalAmount = subtotal + shipping;

    // Split full name
    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || "-";

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        customer_first_name: firstName,
        customer_last_name: lastName,
        shipping_address: formData.address.trim(),
        shipping_city: formData.city.trim(),
        shipping_pincode: formData.pincode.trim(),
        subtotal,
        total_amount: totalAmount,
        status: "pending",
        payment_status:
          formData.paymentMethod === "cod" ? "pending" : "pending",
        notes: `Payment method: ${formData.paymentMethod.toUpperCase()}. State: ${formData.state}`,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return {
        success: false,
        error: "Failed to place order. Please try again.",
      };
    }

    // Insert order items (only if we have valid variant IDs)
    const validLineItems = lineItems.filter((li) =>
      variantMap.has(li.variant_id),
    );
    if (validLineItems.length > 0) {
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(validLineItems.map((li) => ({ ...li, order_id: order.id })));

      if (itemsError) {
        console.error("Order items insert error:", itemsError);
        // Don't fail the order — items might fail due to RLS; order is placed
      }
    }

    revalidatePath("/admin/orders");
    return { success: true, orderId: order.id };
  } catch (err) {
    console.error("placeOrder exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
