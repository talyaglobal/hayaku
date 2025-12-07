-- Add placeholder product images for existing products
-- This script adds sample images to products so ProductCard can display them

-- Insert sample product images for all products
-- Using placeholder images that match luxury fashion styling

INSERT INTO product_images (product_id, url, alt_text, position, is_primary) 
SELECT 
    p.id,
    CASE 
        WHEN p.slug LIKE '%t-shirt%' THEN 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop'
        WHEN p.slug LIKE '%wallet%' THEN 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop'
        WHEN p.slug LIKE '%jacket%' THEN 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop'
        WHEN p.slug LIKE '%sweatshirt%' THEN 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop'
        WHEN p.slug LIKE '%scarf%' THEN 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&h=600&fit=crop'
        WHEN p.slug LIKE '%coat%' THEN 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=600&fit=crop'
        WHEN p.slug LIKE '%shirt%' THEN 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop'
        WHEN p.slug LIKE '%bag%' OR p.slug LIKE '%pouch%' THEN 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop'
        WHEN p.slug LIKE '%boots%' THEN 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop'
        ELSE 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=600&fit=crop'
    END as url,
    p.name || ' - Ana Görsel' as alt_text,
    0 as position,
    true as is_primary
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
);

-- Add secondary images for some variety
INSERT INTO product_images (product_id, url, alt_text, position, is_primary)
SELECT 
    p.id,
    CASE 
        WHEN p.slug LIKE '%t-shirt%' THEN 'https://images.unsplash.com/photo-1583743089949-628ec4cdc9e7?w=500&h=600&fit=crop'
        WHEN p.slug LIKE '%jacket%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop'
        WHEN p.slug LIKE '%coat%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop'
        ELSE 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&h=600&fit=crop'
    END as url,
    p.name || ' - İkinci Görsel' as alt_text,
    1 as position,
    false as is_primary
FROM products p
WHERE p.slug LIKE '%jacket%' OR p.slug LIKE '%coat%' OR p.slug LIKE '%t-shirt%';

SELECT 'Product images added successfully!' as status;