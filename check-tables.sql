-- Check what tables currently exist in the database
-- Run this in your Supabase SQL Editor to see current table status

-- List all tables in the public schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if specific required tables exist
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') 
        THEN '✅ user_profiles exists' 
        ELSE '❌ user_profiles missing' 
    END as user_profiles_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'brands') 
        THEN '✅ brands exists' 
        ELSE '❌ brands missing' 
    END as brands_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') 
        THEN '✅ categories exists' 
        ELSE '❌ categories missing' 
    END as categories_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') 
        THEN '✅ products exists' 
        ELSE '❌ products missing' 
    END as products_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_images') 
        THEN '✅ product_images exists' 
        ELSE '❌ product_images missing' 
    END as product_images_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory') 
        THEN '✅ inventory exists' 
        ELSE '❌ inventory missing' 
    END as inventory_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cart') 
        THEN '✅ cart exists' 
        ELSE '❌ cart missing' 
    END as cart_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cart_items') 
        THEN '✅ cart_items exists' 
        ELSE '❌ cart_items missing' 
    END as cart_items_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlists') 
        THEN '✅ wishlists exists' 
        ELSE '❌ wishlists missing' 
    END as wishlists_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wishlist_items') 
        THEN '✅ wishlist_items exists' 
        ELSE '❌ wishlist_items missing' 
    END as wishlist_items_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') 
        THEN '✅ orders exists' 
        ELSE '❌ orders missing' 
    END as orders_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order_items') 
        THEN '✅ order_items exists' 
        ELSE '❌ order_items missing' 
    END as order_items_status,
    
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings') 
        THEN '✅ site_settings exists' 
        ELSE '❌ site_settings missing' 
    END as site_settings_status;