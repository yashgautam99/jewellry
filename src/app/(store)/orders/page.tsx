import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PackageOpen } from "lucide-react";

export default function OrdersPage() {
  return (
    <section className="py-24 px-6 bg-background transition-colors duration-300 min-h-[80vh]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
            Your Orders
          </h1>
          <p className="text-muted-foreground">
            Track and manage your Lumière purchases.
          </p>
        </div>

        {/* Empty State */}
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <PackageOpen className="w-16 h-16 text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-3">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              When you place an order for our handcrafted jewellery, it will
              appear here.
            </p>
            <Button asChild size="lg">
              <Link href="/products">Discover Collections</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
