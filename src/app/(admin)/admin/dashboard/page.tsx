import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, Clock } from "lucide-react";

export const revalidate = 60;

export default async function DashboardPage() {
  const supabase = createAdminClient();

  const [
    { count: productCount },
    { count: orderCount },
    { data: revenueData },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount"),
  ]);

  const totalRevenue =
    revenueData?.reduce((sum, o) => sum + Number(o.total_amount), 0) ?? 0;

  const { data: recentOrders } = await supabase
    .from("orders")
    .select(
      "id, customer_first_name, customer_last_name, customer_email, total_amount, status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(6);

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      sub: "All-time",
      Icon: TrendingUp,
    },
    {
      label: "Total Orders",
      value: String(orderCount ?? 0),
      sub: "All-time",
      Icon: ShoppingBag,
    },
    {
      label: "Active Products",
      value: String(productCount ?? 0),
      sub: "In catalogue",
      Icon: Package,
    },
    {
      label: "Pending Orders",
      value: "—",
      sub: "Awaiting fulfilment",
      Icon: Clock,
    },
  ];

  const statusStyle = (status: string) => {
    const map: Record<string, string> = {
      delivered: "bg-foreground/10 text-foreground",
      processing: "bg-foreground/10 text-foreground",
      shipped: "bg-foreground/10 text-foreground",
      cancelled: "border border-border text-muted-foreground",
      pending: "border border-border text-muted-foreground",
    };
    return map[status] ?? "border border-border text-muted-foreground";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-border">
        <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-1">
          Admin
        </p>
        <h1 className="font-serif text-4xl font-light italic text-foreground">
          Dashboard
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with Lumière.
        </p>
      </div>

      {/* Stats — window-pane grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-border mb-8">
        {stats.map(({ label, value, sub, Icon }) => (
          <div key={label} className="border-r border-b border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground">
                {label}
              </p>
              <Icon
                className="w-4 h-4 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>
            <p className="font-serif text-3xl font-light text-foreground">
              {value}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders table */}
        <div className="lg:col-span-2 border border-border">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="font-serif text-lg font-light text-foreground">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors editorial-link"
            >
              View All →
            </Link>
          </div>
          {!recentOrders || recentOrders.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-[13px] text-muted-foreground">
                No orders yet. When customers place orders, they&apos;ll appear
                here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-secondary transition-colors"
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">
                      {order.customer_first_name} {order.customer_last_name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {order.customer_email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-[13px] font-medium text-foreground">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-1 tracking-[0.1em] uppercase capitalize ${statusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-serif text-lg font-light text-foreground">
              Quick Actions
            </h2>
          </div>
          <div className="divide-y divide-border">
            {[
              {
                label: "Add New Product",
                sub: "Upload to catalogue",
                href: "/admin/products/new",
              },
              {
                label: "Manage Products",
                sub: "Edit & update listings",
                href: "/admin/products",
              },
              {
                label: "View Orders",
                sub: "Process & fulfil orders",
                href: "/admin/orders",
              },
              {
                label: "Inventory",
                sub: "Track stock levels",
                href: "/admin/inventory",
              },
              { label: "View Store", sub: "Preview the storefront", href: "/" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between px-6 py-4 hover:bg-secondary transition-colors group"
              >
                <div>
                  <p className="text-[13px] font-medium text-foreground group-hover:text-foreground">
                    {action.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {action.sub}
                  </p>
                </div>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors text-lg">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
