"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const newStatus = formData.get("status") as string;
  if (!newStatus || !orderId) return;

  const supabase = createAdminClient();
  await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);

  revalidatePath("/admin/orders");
}
