-- Updated Brands Seed Data - Based on actual brand images in public/brands
-- This script updates the brands table to match the available brand images

-- Insert/Update Brands with conflict resolution
INSERT INTO brands (name, slug, description, country, is_featured, is_active) VALUES 
('Adidas', 'adidas', 'İkonik üç şeritli tasarımıyla tanınan dünya çapında spor giyim ve ayakkabı markası', 'Germany', true, true),
('Burberry', 'burberry', 'Ikonik trench coat ve miras desenleriyle ünlü İngiliz lüks moda evi', 'United Kingdom', true, true),
('Calvin Klein', 'calvin-klein', 'Minimalist tasarım ve modern Amerikan tarzıyla tanınan global moda markası', 'USA', true, true),
('Columbia', 'columbia', 'Outdoor performans ve spor giyim alanında lider Amerikan markası', 'USA', false, true),
('Dolce & Gabbana', 'dolce-gabbana', 'İtalyan kültürü ve işçiliğini kutlayan Sicilya lüks modası', 'Italy', true, true),
('Lacoste', 'lacoste', 'Tenis geleneğinden doğan, timsah logolu ikonik Fransız spor şıklığı markası', 'France', true, true),
('Moncler', 'moncler', 'Alp geleneğini çağdaş lüksle birleştiren premium dış giyim markası', 'France', true, true),
('Nike', 'nike', 'Just Do It sloganı ve swoosh logosuyla tanınan dünya lideri spor markası', 'USA', true, true),
('Prada', 'prada', 'Yenilikçi malzemeler ve ilerici tasarımlarıyla tanınan İtalyan lüks moda evi', 'Italy', true, true),
('Stone Island', 'stone-island', 'Teknik inovasyon ve kumaş araştırmasıyla ünlü İtalyan spor giyim markası', 'Italy', true, true),
('Timberland', 'timberland', 'Dayanıklı outdoor ayakkabı ve giyim ürünleriyle tanınan Amerikan markası', 'USA', false, true),
('Tommy Hilfiger', 'tommy-hilfiger', 'Preppy Amerikan tarzı ve kırmızı, beyaz, mavi renkleriyle ikonik moda markası', 'USA', true, true)
ON CONFLICT (name) DO UPDATE SET
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  country = EXCLUDED.country,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active;

-- Remove old brands that don't have images
DELETE FROM brands WHERE slug IN ('bottega-veneta', 'off-white', 'maison-margiela');

-- Success message
SELECT 'Brands updated successfully! ' || 
       (SELECT COUNT(*) FROM brands WHERE is_active = true) || ' active brands now available.' as message;