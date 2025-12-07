-- Hayaku Seed Data for Supabase
-- This script safely populates the database with initial brands, categories, and products

-- Insert Brands with conflict resolution
INSERT INTO brands (name, slug, description, country, is_featured, is_active) VALUES 
('Prada', 'prada', 'Yenilikçi malzemeler ve ilerici tasarımlarıyla tanınan İtalyan lüks moda evi', 'Italy', true, true),
('Moncler', 'moncler', 'Alp geleneğini çağdaş lüksle birleştiren premium dış giyim markası', 'France', true, true),
('Burberry', 'burberry', 'Ikonik trench coat ve miras desenleriyle ünlü İngiliz lüks moda evi', 'United Kingdom', true, true),
('Dolce & Gabbana', 'dolce-gabbana', 'İtalyan kültürü ve işçiliğini kutlayan Sicilya lüks modası', 'Italy', true, true),
('Stone Island', 'stone-island', 'Teknik inovasyon ve kumaş araştırmasıyla ünlü İtalyan spor giyim markası', 'Italy', true, true),
('Bottega Veneta', 'bottega-veneta', 'Eşsiz el işçiliği ve minimalist lüks tasarımları ile tanınan İtalyan moda evi', 'Italy', true, true),
('Off-White', 'off-white', 'Sokak modası ile lüks modasını birleştiren yenilikçi Amerikan markası', 'USA', true, true),
('Maison Margiela', 'maison-margiela', 'Avant-garde yaklaşımı ve dekonstrüksiyon tarzıyla ünlü Belçika moda evi', 'Belgium', true, true)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  country = EXCLUDED.country,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active;

-- Insert Categories with conflict resolution  
INSERT INTO categories (name, slug, description, icon_name, is_featured, is_active) VALUES 
('Giyim', 'clothing', 'Premium giyim koleksiyonu', 'Shirt', true, true),
('Ayakkabı', 'footwear', 'Designer ayakkabı ve spor ayakkabı', 'ShoppingBag', true, true),
('Aksesuar', 'accessories', 'Lüks aksesuar koleksiyonu', 'Watch', true, true),
('Çanta', 'bags', 'Designer çanta koleksiyonu', 'Briefcase', true, true),
('Dış Giyim', 'outerwear', 'Premium dış giyim ve mont koleksiyonu', 'Jacket', true, true),
('Ev Tekstili', 'home-textiles', 'Lüks ev tekstil ürünleri', 'Home', false, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active;

-- Insert Products with conflict resolution
INSERT INTO products (name, slug, description, short_description, brand_id, category_id, sku, price, compare_price, currency, is_featured, is_active, tags) VALUES

-- Prada Products
(
  'Prada Milano Logo T-Shirt',
  'prada-milano-logo-t-shirt',
  'Soft cotton jersey t-shirt featuring the iconic Prada Milano logo. Classic fit with ribbed crew neckline.',
  'Iconic logo t-shirt in premium cotton',
  (SELECT id FROM brands WHERE slug = 'prada'),
  (SELECT id FROM categories WHERE slug = 'clothing'),
  'PR-TS-001',
  445.00,
  NULL,
  'TRY',
  true,
  true,
  ARRAY['prada', 't-shirt', 'logo', 'cotton']
),

(
  'Prada Saffiano Leather Wallet',
  'prada-saffiano-leather-wallet',
  'Saffiano leather bi-fold wallet with logo plaque. Multiple card slots and bill compartments.',
  'Classic saffiano leather wallet',
  (SELECT id FROM brands WHERE slug = 'prada'),
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'PR-WL-001',
  1250.00,
  NULL,
  'TRY',
  true,
  true,
  ARRAY['prada', 'wallet', 'saffiano', 'leather']
),

-- Moncler Products
(
  'Moncler Maya Down Jacket',
  'moncler-maya-down-jacket',
  'Iconic Maya down jacket in shiny nylon laqué. Quilted construction with down filling.',
  'Iconic shiny down jacket',
  (SELECT id FROM brands WHERE slug = 'moncler'),
  (SELECT id FROM categories WHERE slug = 'outerwear'),
  'MC-JK-001',
  1150.00,
  NULL,
  'TRY',
  true,
  true,
  ARRAY['moncler', 'jacket', 'down', 'maya']
),

(
  'Moncler Genius Logo Sweatshirt',
  'moncler-genius-logo-sweatshirt',
  'Cotton fleece sweatshirt from Moncler Genius collection. Embroidered logo detail.',
  'Premium cotton sweatshirt',
  (SELECT id FROM brands WHERE slug = 'moncler'),
  (SELECT id FROM categories WHERE slug = 'clothing'),
  'MC-SW-001',
  890.00,
  NULL,
  'TRY',
  false,
  true,
  ARRAY['moncler', 'sweatshirt', 'genius', 'cotton']
),

-- Burberry Products
(
  'Burberry Classic Check Scarf',
  'burberry-classic-check-scarf',
  'The iconic check scarf in soft cashmere. Classic heritage pattern in camel colorway.',
  'Iconic heritage check scarf',
  (SELECT id FROM brands WHERE slug = 'burberry'),
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'BB-SC-001',
  1200.00,
  1400.00,
  'TRY',
  true,
  true,
  ARRAY['burberry', 'scarf', 'check', 'cashmere']
),

(
  'Burberry Heritage Trench Coat',
  'burberry-heritage-trench-coat',
  'The original trench coat crafted from cotton gabardine. Double-breasted with signature details.',
  'Classic heritage trench coat',
  (SELECT id FROM brands WHERE slug = 'burberry'),
  (SELECT id FROM categories WHERE slug = 'outerwear'),
  'BB-TC-001',
  4500.00,
  NULL,
  'TRY',
  true,
  true,
  ARRAY['burberry', 'trench', 'coat', 'heritage']
),

-- Dolce & Gabbana Products  
(
  'D&G Sicily Print Shirt',
  'dg-sicily-print-shirt',
  'Cotton poplin shirt featuring iconic Sicily print. Italian craftsmanship with attention to detail.',
  'Signature Sicily print shirt',
  (SELECT id FROM brands WHERE slug = 'dolce-gabbana'),
  (SELECT id FROM categories WHERE slug = 'clothing'),
  'DG-SH-001',
  890.00,
  NULL,
  'TRY',
  false,
  true,
  ARRAY['dolce-gabbana', 'shirt', 'sicily', 'print']
),

-- Stone Island Products
(
  'Stone Island Ghost Piece Jacket',
  'stone-island-ghost-piece-jacket',
  'Technical jacket in ghost piece treatment. Innovative fabric technology with compass logo.',
  'Technical ghost piece jacket',
  (SELECT id FROM brands WHERE slug = 'stone-island'),
  (SELECT id FROM categories WHERE slug = 'outerwear'),
  'SI-JK-001',
  1890.00,
  NULL,
  'TRY',
  true,
  true,
  ARRAY['stone-island', 'jacket', 'ghost-piece', 'technical']
),

-- Bottega Veneta Products
(
  'Bottega Veneta Intrecciato Wallet',
  'bottega-veneta-intrecciato-wallet',
  'Signature intrecciato weave wallet in premium leather. Minimalist design with exceptional craftsmanship.',
  'Iconic intrecciato leather wallet',
  (SELECT id FROM brands WHERE slug = 'bottega-veneta'),
  (SELECT id FROM categories WHERE slug = 'accessories'),
  'BV-WL-001',
  3200.00,
  NULL,
  'TRY',
  true,
  true,
  ARRAY['bottega-veneta', 'wallet', 'intrecciato', 'leather']
),

(
  'Bottega Veneta The Pouch Bag',
  'bottega-veneta-the-pouch-bag',
  'The iconic Pouch bag in soft intrecciato leather. Gathered design with magnetic closure.',
  'Iconic gathered leather pouch',
  (SELECT id FROM brands WHERE slug = 'bottega-veneta'),
  (SELECT id FROM categories WHERE slug = 'bags'),
  'BV-PB-001',
  4200.00,
  NULL,
  'TRY',
  true,
  true,
  ARRAY['bottega-veneta', 'pouch', 'bag', 'intrecciato']
),

-- Off-White Products
(
  'Off-White Arrow T-Shirt',
  'off-white-arrow-t-shirt',
  'Cotton t-shirt featuring signature arrow graphics. Streetwear meets luxury design.',
  'Signature arrow graphic tee',
  (SELECT id FROM brands WHERE slug = 'off-white'),
  (SELECT id FROM categories WHERE slug = 'clothing'),
  'OW-TS-001',
  670.00,
  NULL,
  'TRY',
  false,
  true,
  ARRAY['off-white', 't-shirt', 'arrow', 'streetwear']
),

-- Maison Margiela Products
(
  'Maison Margiela Tabi Boots',
  'maison-margiela-tabi-boots',
  'Iconic split-toe Tabi boots in premium leather. Avant-garde design with architectural heel.',
  'Iconic split-toe leather boots',
  (SELECT id FROM brands WHERE slug = 'maison-margiela'),
  (SELECT id FROM categories WHERE slug = 'footwear'),
  'MM-BT-001',
  2890.00,
  NULL,
  'TRY',
  true,
  true,
  ARRAY['maison-margiela', 'tabi', 'boots', 'leather']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  price = EXCLUDED.price,
  compare_price = EXCLUDED.compare_price,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active,
  tags = EXCLUDED.tags;

-- Update site settings with realistic values
INSERT INTO site_settings (key, value, description, is_public) VALUES 
('site_name', '"Hayaku"', 'Site name', true),
('site_description', '"Luxury Menswear Collection"', 'Site description', true),
('free_shipping_threshold', '2000', 'Free shipping threshold in TRY', true),
('tax_rate', '0.20', 'Default tax rate (20% KDV)', false),
('currency', '"TRY"', 'Default currency', true),
('vip_points_rate', '0.01', 'Points earned per TRY spent', false)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  is_public = EXCLUDED.is_public;

-- Sample inventory data (only insert if not exists)
INSERT INTO inventory (product_id, quantity, low_stock_threshold, track_inventory, allow_backorder) 
SELECT id, 
  CASE 
    WHEN random() < 0.1 THEN 0  -- 10% out of stock
    WHEN random() < 0.3 THEN floor(random() * 5 + 1)::integer  -- 20% low stock (1-5)
    ELSE floor(random() * 50 + 10)::integer  -- 70% normal stock (10-60)
  END as quantity,
  5 as low_stock_threshold,
  true as track_inventory,
  false as allow_backorder
FROM products 
WHERE NOT EXISTS (
  SELECT 1 FROM inventory WHERE inventory.product_id = products.id
);

-- Success message
SELECT 'Seed data inserted successfully! ' || 
       (SELECT COUNT(*) FROM brands) || ' brands, ' ||
       (SELECT COUNT(*) FROM categories) || ' categories, and ' ||
       (SELECT COUNT(*) FROM products) || ' products available.' as message;