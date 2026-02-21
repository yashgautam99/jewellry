import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "./actions";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/30";
      case "processing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/10 text-purple-600 border-purple-500/30";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/30";
      default:
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"; // pending
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Orders
        </h1>
        <p className="text-muted-foreground">
          Manage order fulfillment and tracking statuses.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {!orders || orders.length === 0 ? (
          <div className="p-16 text-center">
            <span className="text-4xl block mb-4 opacity-50">🧾</span>
            <h3 className="text-lg font-serif font-medium text-foreground mb-2">
              No orders yet
            </h3>
            <p className="text-sm text-muted-foreground">
              When customers place orders, they will appear here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px] uppercase tracking-wider text-xs font-semibold">
                  Order ID
                </TableHead>
                <TableHead className="uppercase tracking-wider text-xs font-semibold">
                  Customer
                </TableHead>
                <TableHead className="uppercase tracking-wider text-xs font-semibold">
                  Date
                </TableHead>
                <TableHead className="uppercase tracking-wider text-xs font-semibold text-right">
                  Amount
                </TableHead>
                <TableHead className="uppercase tracking-wider text-xs font-semibold text-center">
                  Status
                </TableHead>
                <TableHead className="text-right uppercase tracking-wider text-xs font-semibold">
                  Update Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="group hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground text-xs uppercase">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:underline text-foreground"
                    >
                      {order.id.split("-")[0]}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">
                        {order.customer_first_name} {order.customer_last_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {order.customer_email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    ₹{Number(order.total_amount).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`capitalize ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <form
                      action={updateOrderStatus.bind(null, order.id)}
                      className="flex justify-end items-center gap-2"
                    >
                      <Select name="status" defaultValue={order.status}>
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Update
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
