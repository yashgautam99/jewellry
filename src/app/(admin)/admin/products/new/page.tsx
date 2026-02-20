import { createProduct } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto pb-12">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Add New Product
        </h1>
        <p className="text-muted-foreground">
          Add a new piece of jewelry to your catalogue.
        </p>
      </div>

      <form action={createProduct}>
        <div className="grid gap-8">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif">General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Product Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Diamond Solitaire Ring"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the piece..."
                  className="resize-none h-32"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Category
                  </Label>
                  <Select name="category" defaultValue="rings" required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rings">Rings</SelectItem>
                      <SelectItem value="pendants">Pendants</SelectItem>
                      <SelectItem value="bracelets">Bracelets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Gender target
                  </Label>
                  <Select name="gender" defaultValue="women" required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="base_price"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Base Price (₹)
                </Label>
                <Input
                  id="base_price"
                  name="base_price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="45000"
                  className="h-12"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Active Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Publish this product immediately.
                  </p>
                </div>
                <Switch name="is_active" value="true" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif">
                Initial Variant (Stock)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="material"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Material
                  </Label>
                  <Input
                    id="material"
                    name="material"
                    required
                    placeholder="e.g. 18K Gold"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="size"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Size (Optional)
                  </Label>
                  <Input
                    id="size"
                    name="size"
                    placeholder="e.g. Medium"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="inventory_count"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Inventory Count
                  </Label>
                  <Input
                    id="inventory_count"
                    name="inventory_count"
                    type="number"
                    defaultValue="0"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2 flex flex-col justify-end pb-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="is_made_to_order"
                      name="is_made_to_order"
                      value="true"
                      defaultChecked
                    />
                    <Label
                      htmlFor="is_made_to_order"
                      className="text-sm cursor-pointer"
                    >
                      Made to order (ignores inventory)
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 mt-4">
            <Button type="button" variant="outline" size="lg" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="submit" size="lg" className="px-8">
              Save Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
