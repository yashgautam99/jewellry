-- =========================================================
-- Lumière Jewellery — STEP 1: Run schema.sql first!
-- Then run THIS file in the Supabase SQL Editor.
-- =========================================================

-- NOTE: product_images does NOT have an is_primary column
-- NOTE: product_variants uses price_adjustment (not price_modifier)
-- NOTE: inventory_count constraint: must be > 0 OR is_made_to_order = true

-- ---------------------------------------------------------
-- 10 Products
-- ---------------------------------------------------------
INSERT INTO products (name, slug, description, category, gender, base_price, is_featured, is_active) VALUES
('Celestial Diamond Solitaire Ring',  'celestial-diamond-solitaire-ring',  'A breathtaking solitaire ring featuring a 0.5ct lab-grown diamond set in 18K yellow gold. The classic four-prong setting elevates the stone to let maximum light flow through.',                                  'rings',    'women',  45000, true,  true),
('Lunar Crescent Pendant',            'lunar-crescent-pendant',            'Inspired by the midnight sky, this delicate crescent moon pendant is adorned with pavé-set diamonds in white gold. Timeless — perfect for day or night.',                                                               'pendants', 'women',  28000, true,  true),
('Heritage Gold Chain Bracelet',      'heritage-gold-chain-bracelet',      'A bold 18K yellow gold curb chain bracelet with a secure lobster clasp. Contemporary yet rooted in classic craftsmanship — the perfect everyday luxury piece.',                                                       'bracelets','unisex', 22000, false, true),
('Rose Quartz Halo Ring',             'rose-quartz-halo-ring',             'A stunning oval rose quartz gemstone surrounded by a halo of sparkling white diamonds. Set in 18K rose gold for a warm, romantic look.',                                                                             'rings',    'women',  38000, true,  true),
('Serpent Coil Pendant',              'serpent-coil-pendant',              'An intricately crafted serpent coil pendant in 18K white gold with emerald eyes. Symbolic of renewal and eternal wisdom — a bold statement piece that commands attention.',                                           'pendants', 'women',  52000, false, true),
('Tennis Bracelet Classic',           'tennis-bracelet-classic',           'The quintessential luxury bracelet — 28 round brilliant-cut diamonds totalling 2ct, set in a flexible 18K white gold setting. Effortless elegance for every occasion.',                                              'bracelets','women',  125000,true,  true),
('Men''s Signet Ring',                'mens-signet-ring',                  'A weighty, authoritative signet ring in 18K yellow gold with a brushed rectangular face. Perfect for engraving with initials or a family crest.',                                                                   'rings',    'men',    35000, false, true),
('Emerald Drop Pendant',              'emerald-drop-pendant',              'A single pear-shaped Colombian emerald drop, framed in a fine pavé diamond halo on an 18K yellow gold chain. Vivid colour meets refined craft.',                                                                    'pendants', 'women',  68000, false, true),
('Infinity Love Bracelet',            'infinity-love-bracelet',            'Two intertwined 18K rose gold bands set with alternating rubies and diamonds, symbolising love without end. A meaningful gift for a milestone moment.',                                                             'bracelets','women',  42000, true,  true),
('Black Onyx Statement Ring',         'black-onyx-statement-ring',         'A bold, rectangular black onyx cabochon set in oxidised sterling silver with geometric detailing. Effortlessly edgy and sophisticated for everyday wear.',                                                           'rings',    'unisex', 18000, false, true);


-- ---------------------------------------------------------
-- Variants (2 per product, using price_adjustment column)
-- NOTE: inventory_count must be > 0 OR is_made_to_order = true
-- ---------------------------------------------------------
DO $$
DECLARE
  p_id uuid;
BEGIN

  -- 1. Celestial Diamond Solitaire Ring
  SELECT id INTO p_id FROM products WHERE slug = 'celestial-diamond-solitaire-ring';
  INSERT INTO product_variants (product_id, size, material, price_adjustment, inventory_count, sku) VALUES
    (p_id, '6', '18K Yellow Gold', 0,    8, 'CDR-YG-6'),
    (p_id, '7', '18K White Gold',  2000, 5, 'CDR-WG-7');

  -- 2. Lunar Crescent Pendant
  SELECT id INTO p_id FROM products WHERE slug = 'lunar-crescent-pendant';
  INSERT INTO product_variants (product_id, size, material, price_adjustment, inventory_count, sku) VALUES
    (p_id, 'One Size', '18K White Gold',  0,     12, 'LCP-WG-OS'),
    (p_id, 'One Size', '18K Yellow Gold', -2000, 10, 'LCP-YG-OS');

  -- 3. Heritage Gold Chain Bracelet
  SELECT id INTO p_id FROM products WHERE slug = 'heritage-gold-chain-bracelet';
  INSERT INTO product_variants (product_id, size, material, price_adjustment, inventory_count, sku) VALUES
    (p_id, '18cm', '18K Yellow Gold', 0,    15, 'HGB-YG-18'),
    (p_id, '20cm', '18K Yellow Gold', 1500, 10, 'HGB-YG-20');

  -- 4. Rose Quartz Halo Ring
  SELECT id INTO p_id FROM products WHERE slug = 'rose-quartz-halo-ring';
  INSERT INTO product_variants (product_id, size, material, price_adjustment, inventory_count, sku) VALUES
    (p_id, '6', '18K Rose Gold', 0, 7, 'RQH-RG-6'),
    (p_id, '7', '18K Rose Gold', 0, 6, 'RQH-RG-7');

  -- 5. Serpent Coil Pendant
  SELECT id INTO p_id FROM products WHERE slug = 'serpent-coil-pendant';
  INSERT INTO product_variants (product_id, size, material, price_adjustment, inventory_count, sku) VALUES
    (p_id, 'One Size', '18K White Gold',  0,     4, 'SCP-WG-OS'),
    (p_id, 'One Size', '18K Yellow Gold', -3000, 3, 'SCP-YG-OS');

  -- 6. Tennis Bracelet Classic
  SELECT id INTO p_id FROM products WHERE slug = 'tennis-bracelet-classic';
  INSERT INTO product_variants (product_id, size, material, price_adjustment, inventory_count, sku) VALUES
    (p_id, '17cm', '18K White Gold', 0,    3, 'TBC-WG-17'),
    (p_id, '19cm', '18K White Gold', 5000, 2, 'TBC-WG-19');

  -- 7. Men's Signet Ring
  SELECT id INTO p_id FROM products WHERE slug = 'mens-signet-ring';
  INSERT INTO product_variants (product_id, size, material, price_adjustment, inventory_count, sku) VALUES
    (p_id, '9',  '18K Yellow Gold', 0, 9, 'MSR-YG-9'),
    (p_id, '10', '18K Yellow Gold', 0, 7, 'MSR-YG-10');

  -- 8. Emerald Drop Pendant
  SELECT id INTO p_id FROM products WHERE slug = 'emerald-drop-pendant';
  INSERT INTO product_variants (product_id, size, material, price_adjustment, inventory_count, sku) VALUES
    (p_id, 'One Size', '18K Yellow Gold', 0,    3, 'EDP-YG-OS'),
    (p_id, 'One Size', '18K White Gold',  3000, 2, 'EDP-WG-OS');

  -- 9. Infinity Love Bracelet
  SELECT id INTO p_id FROM products WHERE slug = 'infinity-love-bracelet';
  INSERT INTO product_variants (product_id, size, material, price_adjustment, inventory_count, sku) VALUES
    (p_id, '17cm', '18K Rose Gold', 0,    6, 'ILB-RG-17'),
    (p_id, '19cm', '18K Rose Gold', 1500, 5, 'ILB-RG-19');

  -- 10. Black Onyx Statement Ring
  SELECT id INTO p_id FROM products WHERE slug = 'black-onyx-statement-ring';
  INSERT INTO product_variants (product_id, size, material, price_adjustment, inventory_count, sku) VALUES
    (p_id, '7', 'Oxidised Silver', 0, 12, 'BOR-OS-7'),
    (p_id, '8', 'Oxidised Silver', 0, 10, 'BOR-OS-8');

END $$;


-- ---------------------------------------------------------
-- Product Images (one per product, Unsplash URLs)
-- product_images columns: product_id, url, alt_text, display_order
-- (no is_primary column in schema)
-- ---------------------------------------------------------
INSERT INTO product_images (product_id, url, alt_text, display_order)
SELECT
  p.id,
  CASE p.slug
    WHEN 'celestial-diamond-solitaire-ring' THEN 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'
    WHEN 'lunar-crescent-pendant'           THEN 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    WHEN 'heritage-gold-chain-bracelet'     THEN 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80'
    WHEN 'rose-quartz-halo-ring'            THEN 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80'
    WHEN 'serpent-coil-pendant'             THEN 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
    WHEN 'tennis-bracelet-classic'          THEN 'https://images.unsplash.com/photo-1611654587717-a8f8e1c78a47?w=800&q=80'
    WHEN 'mens-signet-ring'                 THEN 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=800&q=80'
    WHEN 'emerald-drop-pendant'             THEN 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80'
    WHEN 'infinity-love-bracelet'           THEN 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80'
    WHEN 'black-onyx-statement-ring'        THEN 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80'
  END,
  p.name,
  1
FROM products p
WHERE p.slug IN (
  'celestial-diamond-solitaire-ring',
  'lunar-crescent-pendant',
  'heritage-gold-chain-bracelet',
  'rose-quartz-halo-ring',
  'serpent-coil-pendant',
  'tennis-bracelet-classic',
  'mens-signet-ring',
  'emerald-drop-pendant',
  'infinity-love-bracelet',
  'black-onyx-statement-ring'
);
