# Inventory Management System

This document describes the comprehensive inventory management system implemented for the Hayaku e-commerce platform.

## Features Implemented

### ✅ 1. Real-time Stock Updates
- **Real-time subscriptions** using Supabase real-time channels
- **React hooks** (`useInventory`) for easy integration in components
- Automatic UI updates when inventory changes
- Product pages automatically reflect current stock status

**Files:**
- `src/lib/inventory.ts` - Core inventory utilities with real-time subscriptions
- `src/lib/use-inventory.ts` - React hooks for inventory management
- `src/app/products/[id]/page.tsx` - Product detail page with real-time stock display

### ✅ 2. Low Stock Alerts
- **Email notifications** sent to admins when stock falls below threshold
- **API endpoint** for checking and triggering alerts (`/api/inventory/alerts`)
- **Database triggers** to detect low stock conditions
- **Admin dashboard** displays low stock warnings

**Files:**
- `src/app/api/inventory/alerts/route.ts` - Low stock alerts API
- `src/lib/email.ts` - Email function for low stock alerts
- `src/app/admin/page.tsx` - Admin dashboard with low stock indicators

### ✅ 3. Out-of-Stock Handling
- **Cart validation** prevents adding out-of-stock items
- **Product pages** show clear out-of-stock status
- **Automatic blocking** of purchases when stock is 0
- **User-friendly error messages** when stock is unavailable

**Files:**
- `src/app/api/cart/route.ts` - Cart API with stock validation
- `src/app/products/[id]/page.tsx` - Product page with stock status display
- `src/lib/inventory.ts` - Stock availability checking functions

### ✅ 4. Pre-order Functionality
- **Pre-order support** when `allow_backorder` is enabled
- **Product pages** show pre-order option when stock is 0
- **Cart and checkout** handle pre-orders correctly
- **Admin can enable/disable** pre-orders per product

**Files:**
- `src/app/api/inventory/[productId]/route.ts` - Inventory API with pre-order support
- `src/app/products/[id]/page.tsx` - Pre-order UI on product pages
- `src/app/api/cart/route.ts` - Cart handling for pre-orders

### ✅ 5. Stock Synchronization
- **Bulk stock updates** via API endpoint
- **External system integration** support (Netsis, Logo, SAP)
- **SKU-based updates** for easy integration
- **Batch processing** for efficient updates

**Files:**
- `src/app/api/inventory/sync/route.ts` - Stock synchronization API
- Supports multiple sources and batch updates

## API Endpoints

### Inventory Management
- `GET /api/inventory` - Get all inventory records
  - Query params: `productId`, `lowStock`, `outOfStock`
- `GET /api/inventory/[productId]` - Get inventory for specific product
- `POST /api/inventory` - Create/update inventory (Admin only)
- `PUT /api/inventory/[productId]` - Update inventory (Admin only)

### Low Stock Alerts
- `GET /api/inventory/alerts` - Get low stock alerts (Admin only)
- `POST /api/inventory/alerts/check` - Check and send low stock alerts (Admin only)

### Stock Synchronization
- `POST /api/inventory/sync` - Synchronize stock from external systems (Admin only)
  - Body: `{ source: string, updates: Array<{productId|sku, quantity, ...}> }`

## Database Schema

The inventory table includes:
- `quantity` - Current stock quantity
- `low_stock_threshold` - Threshold for low stock alerts (default: 5)
- `track_inventory` - Whether to track inventory (default: true)
- `allow_backorder` - Whether to allow pre-orders (default: false)
- `updated_at` - Last update timestamp

**Migration file:** `inventory-management-migration.sql`

## Usage Examples

### Real-time Stock Updates in Components
```typescript
import { useInventory } from '@/lib/use-inventory'

function ProductPage({ productId }) {
  const { status, loading } = useInventory(productId)
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {status?.isOutOfStock && <p>Out of Stock</p>}
      {status?.isLowStock && <p>Low Stock: {status.availableQuantity}</p>}
      {status?.allowPreOrder && <p>Pre-order Available</p>}
    </div>
  )
}
```

### Updating Inventory (Admin)
```typescript
const response = await fetch(`/api/inventory/${productId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    quantity: 100,
    lowStockThreshold: 10,
    allowBackorder: true
  })
})
```

### Stock Synchronization
```typescript
const response = await fetch('/api/inventory/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    source: 'netsis',
    updates: [
      { sku: 'PROD-001', quantity: 50 },
      { productId: 'uuid-here', quantity: 25 }
    ]
  })
})
```

## Admin Dashboard

The admin dashboard (`/admin`) includes:
- **Inventory overview** with statistics
- **Low stock alerts** section
- **Inventory management table** with inline editing
- **Pre-order toggle** for each product
- **Stock tracking toggle** for each product
- **Bulk operations** support

## Real-time Features

The system uses Supabase real-time subscriptions to:
- Update product pages when stock changes
- Show live inventory status
- Trigger alerts when stock drops
- Sync across multiple admin sessions

## Email Notifications

Low stock alerts are sent via email to admins when:
- Stock quantity drops to or below the threshold
- Product is still active
- Alert hasn't been sent recently (configurable)

## Future Enhancements

Potential improvements:
- Multi-location inventory support
- Inventory history/audit log
- Automated reorder points
- Supplier integration
- Barcode scanning support
- Inventory forecasting
