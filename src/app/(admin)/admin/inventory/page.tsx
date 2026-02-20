import { createAdminClient } from "@/lib/supabase/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

async function updateInventory(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const count = parseInt(formData.get("inventory_count") as string, 10);

  if (!id || isNaN(count)) return;

  const supabase = createAdminClient();
  await supabase
    .from("product_variants")
    .update({ inventory_count: count })
    .eq("id", id);
  revalidatePath("/admin/inventory");
}

export default async function AdminInventoryPage() {
  const supabase = createAdminClient();
  const { data: variants, error } = await supabase
    .from("product_variants")
    .select(
      `
      id,
      sku,
      material,
      size,
      inventory_count,
      is_made_to_order,
      product:products (
        name,
        category
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inventory:", error);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Inventory Management
        </h1>
        <p className="text-muted-foreground">
          Adjust stock levels for all product variants.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {!variants || variants.length === 0 ? (
          <div className="p-16 text-center">
            <span className="text-4xl block mb-4 opacity-50">📦</span>
            <h3 className="text-lg font-serif font-medium text-foreground mb-2">
              No variants found
            </h3>
            <p className="text-sm text-muted-foreground">
              Add products to see their variants here.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] uppercase tracking-wider text-xs font-semibold">
                  Product
                </TableHead>
                <TableHead className="uppercase tracking-wider text-xs font-semibold">
                  Variant (SKU)
                </TableHead>
                <TableHead className="uppercase tracking-wider text-xs font-semibold text-center">
                  Type
                </TableHead>
                <TableHead className="uppercase tracking-wider text-xs font-semibold text-right">
                  Stock Level
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* 
                  // @ts-ignore */}
              {variants.map((variant: any) => (
                <TableRow key={variant.id} className="group hover:bg-muted/30">
                  <TableCell className="font-medium text-foreground">
                    {variant.product?.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    <span className="block">
                      {variant.material}{" "}
                      {variant.size ? `- ${variant.size}` : ""}
                    </span>
                    <span className="text-xs opacity-50">
                      {variant.sku || "No SKU"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {variant.is_made_to_order ? (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                        Made to Order
                      </span>
                    ) : (
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                        In Stock
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <form
                      action={updateInventory}
                      className="flex justify-end items-center gap-2"
                    >
                      <input type="hidden" name="id" value={variant.id} />
                      <Input
                        type="number"
                        name="inventory_count"
                        defaultValue={variant.inventory_count}
                        className="w-20 h-9 text-right"
                        disabled={variant.is_made_to_order}
                      />
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        disabled={variant.is_made_to_order}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Save
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
