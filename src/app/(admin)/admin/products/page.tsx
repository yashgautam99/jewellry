import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
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
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const revalidate = 0; // Always fetch fresh data on the admin panel

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Products
          </h1>
          <p className="text-muted-foreground">
            Manage your catalogue and variants.
          </p>
        </div>
        <Button
          asChild
          className="rounded-full shadow-lg hover:scale-105 transition-all"
        >
          <Link href="/admin/products/new">+ Add Product</Link>
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="p-16 text-center">
            <span className="text-4xl block mb-4 opacity-50">✦</span>
            <h3 className="text-lg font-serif font-medium text-foreground mb-2">
              No products found
            </h3>
            <p className="text-sm text-muted-foreground">
              Get started by creating your first piece of jewelry.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] uppercase tracking-wider text-xs font-semibold">
                  Product Name
                </TableHead>
                <TableHead className="uppercase tracking-wider text-xs font-semibold">
                  Category
                </TableHead>
                <TableHead className="uppercase tracking-wider text-xs font-semibold text-right">
                  Base Price
                </TableHead>
                <TableHead className="uppercase tracking-wider text-xs font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-right uppercase tracking-wider text-xs font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="group">
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div>
                        <p>{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{Number(product.base_price).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {product.is_active ? (
                      <Badge
                        variant="outline"
                        className="border-green-500/30 text-green-600 bg-green-500/10"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-muted-foreground/30 text-muted-foreground bg-muted/50"
                      >
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[180px]">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="cursor-pointer flex items-center"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <form
                            action={async () => {
                              "use server";
                              const { toggleProductActive } =
                                await import("./actions");
                              await toggleProductActive(
                                product.id,
                                product.is_active,
                              );
                            }}
                          >
                            <button
                              type="submit"
                              className="w-full text-left flex items-center text-sm px-2 py-1.5"
                            >
                              {product.is_active ? "Unpublish" : "Publish"}
                            </button>
                          </form>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer flex items-center">
                          <form
                            action={async () => {
                              "use server";
                              const { deleteProduct } =
                                await import("./actions");
                              await deleteProduct(product.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="w-full text-left flex items-center gap-2 text-sm text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </form>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
