"use client";

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
import { ArrowLeft, Upload, Info } from "lucide-react";
import { useState, useRef } from "react";

export default function NewProductPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [useUrl, setUseUrl] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

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

      <form action={createProduct} encType="multipart/form-data">
        <div className="grid gap-8">
          {/* General Info */}
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

              <div className="flex items-center justify-between p-4 border border-border">
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

          {/* Initial Variant */}
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
                    htmlFor="price_adjustment"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Price Adjustment (₹)
                  </Label>
                  <Input
                    id="price_adjustment"
                    name="price_adjustment"
                    type="number"
                    defaultValue="0"
                    className="h-12"
                  />
                </div>
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
              </div>

              <div className="space-y-3 p-4 border border-border bg-secondary/20">
                <div className="flex items-center gap-3">
                  <Switch
                    id="is_made_to_order"
                    name="is_made_to_order"
                    value="true"
                    defaultChecked
                  />
                  <div>
                    <Label
                      htmlFor="is_made_to_order"
                      className="text-sm cursor-pointer"
                    >
                      Made to Order
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Ships in 4–6 weeks, ignores inventory count
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-1 border-t border-border">
                  <Switch
                    id="show_out_of_stock_label"
                    name="show_out_of_stock_label"
                    value="true"
                  />
                  <div>
                    <Label
                      htmlFor="show_out_of_stock_label"
                      className="text-sm cursor-pointer flex items-center gap-1.5"
                    >
                      Show &ldquo;Out of Stock&rdquo; label
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Only shown to customers when inventory = 0 and not
                      made-to-order
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Image */}
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif">Product Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => setUseUrl(false)}
                  className={`text-xs uppercase tracking-widest pb-1 border-b-2 transition-colors ${
                    !useUrl
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUseUrl(true)}
                  className={`text-xs uppercase tracking-widest pb-1 border-b-2 transition-colors ${
                    useUrl
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground"
                  }`}
                >
                  Paste URL
                </button>
              </div>

              {!useUrl ? (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    name="image_file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full border-2 border-dashed border-border hover:border-foreground transition-colors p-8 flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground"
                  >
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">
                      {fileName ? fileName : "Click to upload or drag & drop"}
                    </span>
                    <span className="text-xs">PNG, JPG, WEBP up to 10MB</span>
                  </button>
                  {preview && (
                    <div className="relative w-32 h-32 overflow-hidden border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  <Label
                    htmlFor="image_url"
                    className="text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Image URL
                  </Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    placeholder="https://..."
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste any publicly accessible image URL
                  </p>
                </div>
              )}
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
