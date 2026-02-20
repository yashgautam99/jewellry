-- =========================================================
-- Lumière Jewellery Database Schema (Updated & Corrected)
-- Execute in Supabase SQL Editor
-- =========================================================

-- ---------------------------------------------------------
-- 1. EXTENSIONS & ENUMS
-- ---------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE product_category AS ENUM (
  'rings',
  'pendants',
  'bracelets'
);

CREATE TYPE product_gender AS ENUM (
  'men',
  'women',
  'unisex'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

-- ---------------------------------------------------------
-- 2. PRODUCTS
-- ---------------------------------------------------------
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,

  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,

  category product_category NOT NULL,
  gender product_gender NOT NULL DEFAULT 'women',

  base_price DECIMAL(10,2) NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

-- Indexes for performance
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_gender ON products(gender);

-- ---------------------------------------------------------
-- 3. PRODUCT VARIANTS
-- ---------------------------------------------------------
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,

  sku TEXT UNIQUE,
  material TEXT NOT NULL,
  size TEXT,

  price_adjustment DECIMAL(10,2) DEFAULT 0,
  inventory_count INTEGER NOT NULL DEFAULT 0,
  is_made_to_order BOOLEAN DEFAULT false,

  CONSTRAINT inventory_or_made_to_order
  CHECK (
    is_made_to_order = true OR inventory_count > 0
  )
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

-- ---------------------------------------------------------
-- 4. PRODUCT IMAGES
-- ---------------------------------------------------------
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,

  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_images_product ON product_images(product_id);

-- ---------------------------------------------------------
-- 5. ORDERS (PAYMENT-AGNOSTIC)
-- ---------------------------------------------------------
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,

  user_id UUID REFERENCES auth.users(id),

  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,

  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,

  subtotal DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,

  status order_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',

  notes TEXT
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ---------------------------------------------------------
-- 6. ORDER ITEMS
-- ---------------------------------------------------------
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE RESTRICT NOT NULL,

  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ---------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ---------------------------------------------------------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 8. PUBLIC READ POLICIES (STORE FRONT)
-- ---------------------------------------------------------
CREATE POLICY "Public can view active products"
ON products FOR SELECT
USING (is_active = true);

CREATE POLICY "Public can view variants of active products"
ON product_variants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM products
    WHERE products.id = product_variants.product_id
    AND products.is_active = true
  )
);

CREATE POLICY "Public can view images of active products"
ON product_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM products
    WHERE products.id = product_images.product_id
    AND products.is_active = true
  )
);

-- ---------------------------------------------------------
-- 9. USER ORDER ACCESS
-- ---------------------------------------------------------
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- ---------------------------------------------------------
-- 10. UPDATED_AT TRIGGER
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();