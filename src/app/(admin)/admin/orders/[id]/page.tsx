import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "../actions";
import { ArrowLeft, Package, MapPin, User, FileText } from "lucide-react";

interface Props {
  params: { id: string };
}

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const revalidate = 0;

export default async function AdminOrderDetailPage({ params }: Props) {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      id, created_at, status, payment_status, total_amount, subtotal, notes,
      customer_first_name, customer_last_name, customer_email, customer_phone,
      shipping_address, shipping_city, shipping_pincode,
      order_items(
        id, quantity, unit_price, total_price,
        product_variants(material, size, products(name, slug))
      )
    `,
    )
    .eq("id", params.id)
    .single();

  if (!order) notFound();

  const shipping = Number(order.total_amount) - Number(order.subtotal);
  const shortId = order.id.split("-")[0].toUpperCase();
  const updateWithId = updateOrderStatus.bind(null, params.id);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/orders"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Order #{shortId}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-3 py-1.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-secondary text-foreground"}`}
        >
          {order.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order items + totals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Items ({order.order_items?.length ?? 0})
              </h2>
            </div>
            <div className="divide-y divide-border">
              {(order.order_items ?? []).map((item: any) => (
                <div
                  key={item.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      {item.product_variants?.products?.name ??
                        "Unknown Product"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[
                        item.product_variants?.material,
                        item.product_variants?.size,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground font-medium">
                      ₹{Number(item.total_price).toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{Number(item.unit_price).toLocaleString("en-IN")} each
                    </p>
                  </div>
                </div>
              ))}
              {(!order.order_items || order.order_items.length === 0) && (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                  Order items not linked (variant IDs missing from cart)
                </div>
              )}
            </div>
            {/* Totals */}
            <div className="border-t border-border px-6 py-4 space-y-2 bg-secondary/20">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  ₹{Number(order.subtotal).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Notes
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right: Customer + Status */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Customer
              </h2>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">
                {order.customer_first_name} {order.customer_last_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.customer_email}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.customer_phone}
              </p>
            </div>
          </div>

          {/* Shipping address */}
          <div className="border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Shipping
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {order.shipping_address}
              <br />
              {order.shipping_city} — {order.shipping_pincode}
            </p>
          </div>

          {/* Update status */}
          <div className="border border-border rounded-xl p-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Update Status
            </h2>
            <form action={updateWithId} className="space-y-3">
              <select
                name="status"
                defaultValue={order.status}
                className="w-full bg-background border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-foreground text-background text-xs uppercase tracking-widest py-2.5 hover:opacity-80 transition-opacity"
              >
                Update Status
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
