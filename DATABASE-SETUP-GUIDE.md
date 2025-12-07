# Database Setup Guide for Hayaku E-commerce

## Current Status ✅
Based on API testing, the following core tables are **already working**:
- ✅ **products** (12 items loaded)
- ✅ **brands** (8 brands loaded) 
- ✅ **categories** (6 categories loaded)
- ✅ **orders** (table exists, ready for use)
- ✅ **product_images** (working with products)

## How to Execute Missing Tables Script

### Step 1: Check Current Tables
1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**  
3. Run the `check-tables.sql` script to see what tables exist:

```sql
-- Copy and paste the contents of check-tables.sql here
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Step 2: Execute Missing Tables Script
1. In **Supabase SQL Editor**
2. Copy the entire contents of `create-missing-tables.sql`
3. **Paste and Run** the script

The script includes:
- ✅ **UUID Extension** setup
- ✅ **User Tables**: user_profiles, user_notification_preferences
- ✅ **Product Tables**: products, brands, categories, product_images, inventory
- ✅ **Cart Tables**: cart, cart_items
- ✅ **Wishlist Tables**: wishlists, wishlist_items  
- ✅ **Order Tables**: orders, order_items
- ✅ **Settings Table**: site_settings
- ✅ **Indexes** for performance
- ✅ **Row Level Security** policies
- ✅ **Triggers** for updated_at columns

### Step 3: Verify Success
After running the script, you should see:
```
Missing tables created successfully! All required tables, indexes, policies and triggers are now ready.
```

### Step 4: Test Database Connection
Run these API tests to confirm everything works:

```bash
# Test products (should return 12)
curl http://localhost:3001/api/products

# Test brands (should return 8)  
curl http://localhost:3001/api/brands

# Test categories (should return 6)
curl http://localhost:3001/api/categories

# Test orders (should return empty array with pagination)
curl http://localhost:3001/api/orders
```

## Tables Created by the Script

### Core E-commerce Tables:
1. **user_profiles** - User account information
2. **user_notification_preferences** - User notification settings
3. **brands** - Product brands (Prada, Moncler, etc.)
4. **categories** - Product categories  
5. **products** - Main product catalog
6. **product_images** - Product photos
7. **inventory** - Stock management
8. **cart** - Shopping cart sessions
9. **cart_items** - Cart item details
10. **wishlists** - User wishlists
11. **wishlist_items** - Wishlist item details
12. **orders** - Order management
13. **order_items** - Order line items
14. **site_settings** - Application settings

### Advanced Features:
- **Row Level Security (RLS)** - Data privacy protection
- **Database Triggers** - Automatic timestamp updates
- **Indexes** - Performance optimization
- **UUID Primary Keys** - Secure unique identifiers
- **Foreign Key Constraints** - Data integrity

## Troubleshooting

### If Tables Already Exist:
The script uses `CREATE TABLE IF NOT EXISTS`, so it won't break existing tables.

### If You Get Permission Errors:
Make sure you're running the script as a Supabase admin user in the SQL Editor.

### If Some APIs Don't Work After:
1. Check that RLS policies are enabled
2. Verify your API routes have proper `@ts-nocheck` directives
3. Restart your Next.js dev server

## Success Confirmation
✅ After running the script successfully, your database will have all tables needed for:
- User authentication and profiles
- Product catalog management  
- Shopping cart functionality
- Order processing
- Wishlist features
- Admin dashboard
- Site configuration

Your Hayaku luxury e-commerce platform will be fully database-ready! 🎉