import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <section className="py-32 px-6 min-h-[70vh] flex flex-col items-center justify-center bg-background transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mb-8">
          <CheckCircle2 className="w-24 h-24 text-primary animate-in fade-in zoom-in duration-500" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-foreground">
          Order Received
        </h1>
        <p className="text-muted-foreground text-lg">
          Thank you for choosing Lumière. Your elegantly crafted pieces will be
          prepared shortly.
        </p>
        <div className="pt-8 space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/orders">View Your Orders</Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
