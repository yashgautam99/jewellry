import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { CheckCircle, Package, MapPin, Truck, ArrowRight } from "lucide-react";

interface Props {
  searchParams: { id?: string };
}

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const orderId = searchParams.id;

  if (!orderId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <p className="font-serif text-3xl font-light italic text-foreground">
          Order not found
        </p>
        <Link href="/products" className="btn-editorial">
          Browse Collections
        </Link>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      id, created_at, status, total_amount, subtotal,
      customer_first_name, customer_last_name, customer_email,
      shipping_address, shipping_city, shipping_pincode, notes
    `,
    )
    .eq("id", orderId)
    .single();

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <p className="font-serif text-3xl font-light italic text-foreground">
          Order not found
        </p>
        <Link href="/products" className="btn-editorial">
          Browse Collections
        </Link>
      </div>
    );
  }

  const shipping = Number(order.total_amount) - Number(order.subtotal);
  const shortId = order.id.split("-")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Success header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-foreground flex items-center justify-center">
              <CheckCircle
                className="w-8 h-8 text-background"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <h1 className="font-serif text-4xl font-light text-foreground italic mb-2">
            Order Placed
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Thank you, {order.customer_first_name}. Your order has been
            received.
          </p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mt-2">
            Order #{shortId}
          </p>
        </div>

        {/* Order summary box */}
        <div className="border border-border">
          {/* Order status tracker */}
          <div className="border-b border-border px-6 py-5">
            <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Status
            </p>
            <div className="flex items-center gap-0">
              {["pending", "processing", "shipped", "delivered"].map(
                (step, i) => {
                  const isActive = order.status === step;
                  const isDone =
                    ["pending", "processing", "shipped", "delivered"].indexOf(
                      order.status as string,
                    ) > i;
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div
                        className={`w-2 h-2 rounded-full flex-none ${isDone || isActive ? "bg-foreground" : "bg-border"}`}
                      />
                      {i < 3 && (
                        <div
                          className={`flex-1 h-px ${isDone ? "bg-foreground" : "bg-border"}`}
                        />
                      )}
                    </div>
                  );
                },
              )}
            </div>
            <div className="flex justify-between mt-2">
              {["Placed", "Processing", "Shipped", "Delivered"].map((label) => (
                <span
                  key={label}
                  className="text-[9px] tracking-wide text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Order details */}
          <div className="px-6 py-5 border-b border-border">
            <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-4">
              Order Summary
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  ₹{Number(order.subtotal).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shipping === 0
                    ? "Free"
                    : `₹${shipping.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between text-[13px] font-medium border-t border-border pt-2 mt-2">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">
                  ₹{Number(order.total_amount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery address */}
          <div className="px-6 py-5 border-b border-border">
            <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              Delivering To
            </p>
            <div className="flex gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] text-foreground font-medium">
                  {order.customer_first_name} {order.customer_last_name}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {order.shipping_address}, {order.shipping_city} —{" "}
                  {order.shipping_pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="px-6 py-5">
            <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-3">
              Contact
            </p>
            <p className="text-[13px] text-muted-foreground">
              {order.customer_email}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              A confirmation email will be sent within 24 hours.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/products"
            className="btn-editorial flex-1 flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/orders"
            className="flex-1 flex items-center justify-center gap-2 border border-border text-foreground text-[11px] tracking-[0.12em] uppercase py-3 hover:bg-secondary transition-colors"
          >
            <Package className="w-4 h-4" /> View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
