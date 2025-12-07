# Hayaku E-commerce API Documentation

## Overview
Complete Next.js API backend for the Hayaku luxury e-commerce platform with Supabase integration.

## Base URL
```
https://your-domain.com/api
```

## Authentication
Most endpoints use Supabase auth tokens passed via cookies. Protected endpoints will return `401` if not authenticated.

---

## Products API

### GET `/api/products`
Get all products with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Filter by category slug
- `brand` (string): Filter by brand slug
- `featured` (boolean): Filter featured products
- `search` (string): Search in product names/descriptions
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sortBy` (string): Sort field (default: 'created_at')
- `sortOrder` (string): 'asc' or 'desc' (default: 'desc')

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 150,
    "totalPages": 13,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### GET `/api/products/[id]`
Get single product by ID or slug.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "slug": "product-slug",
    "price": 1299.00,
    "currency": "TRY",
    "brands": { "name": "Brand Name" },
    "categories": { "name": "Category Name" },
    "product_images": [...],
    "inventory": {...}
  }
}
```

### POST `/api/products` (Admin)
Create new product.

**Body:**
```json
{
  "name": "Product Name",
  "slug": "product-slug",
  "description": "Description",
  "price": 1299.00,
  "brand_id": "uuid",
  "category_id": "uuid",
  "tags": ["tag1", "tag2"]
}
```

---

## Brands API

### GET `/api/brands`
Get all brands.

**Query Parameters:**
- `featured` (boolean): Filter featured brands
- `active` (boolean): Filter active brands (default: true)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Prada",
      "slug": "prada",
      "description": "...",
      "country": "Italy",
      "is_featured": true,
      "is_active": true
    }
  ]
}
```

---

## Categories API

### GET `/api/categories`
Get all categories.

**Query Parameters:**
- `featured` (boolean): Filter featured categories
- `active` (boolean): Filter active categories
- `parent` (string): Filter by parent category ('null' for root categories)

---

## Cart API

### GET `/api/cart`
Get user's cart items.

**Query Parameters:**
- `sessionId` (string): Required if user not authenticated

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "quantity": 2,
      "unit_price": 1299.00,
      "total_price": 2598.00,
      "products": {
        "name": "Product Name",
        "brands": { "name": "Brand" },
        "product_images": [...]
      }
    }
  ]
}
```

### POST `/api/cart`
Add item to cart.

**Body:**
```json
{
  "productId": "uuid",
  "quantity": 1,
  "sessionId": "optional-if-not-authenticated"
}
```

### PUT `/api/cart/[itemId]`
Update cart item quantity.

**Body:**
```json
{
  "quantity": 3
}
```

### DELETE `/api/cart/[itemId]`
Remove item from cart.

---

## Wishlist API

### GET `/api/wishlist`
Get user's wishlist items. (Requires authentication)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "added_at": "2024-01-01T10:00:00Z",
      "products": {
        "id": "uuid",
        "name": "Product Name",
        "price": 1299.00,
        "product_images": [...]
      }
    }
  ]
}
```

### POST `/api/wishlist`
Add item to wishlist. (Requires authentication)

**Body:**
```json
{
  "productId": "uuid"
}
```

### DELETE `/api/wishlist?productId={id}`
Remove item from wishlist. (Requires authentication)

---

## User Profile API

### GET `/api/profile`
Get user profile. (Requires authentication)

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "full_name": "John Doe",
    "phone": "+90...",
    "vip_tier": "Gold",
    "vip_points": 1250,
    "total_orders": 5,
    "total_spent": 15750.00,
    "preferred_language": "tr",
    "preferred_currency": "TRY"
  }
}
```

### PUT `/api/profile`
Update user profile. (Requires authentication)

**Body:**
```json
{
  "full_name": "John Doe",
  "phone": "+905551234567",
  "birth_date": "1990-01-01",
  "gender": "male",
  "preferred_language": "tr",
  "preferred_currency": "TRY"
}
```

---

## Search API

### GET `/api/search`
Search across products, brands, and categories.

**Query Parameters:**
- `q` (string, required): Search query (min 2 characters)
- `type` (string): 'products', 'brands', 'categories', or 'all' (default: 'all')
- `limit` (number): Results limit (default: 10)

**Response:**
```json
{
  "query": "search term",
  "totalResults": 25,
  "results": {
    "products": [...],
    "brands": [...],
    "categories": [...]
  }
}
```

---

## Admin API

### GET `/api/admin/stats`
Get dashboard statistics. (Admin only)

**Response:**
```json
{
  "data": {
    "products": {
      "total": 150,
      "active": 145,
      "featured": 12,
      "averagePrice": 1850
    },
    "brands": {
      "total": 8,
      "active": 8,
      "featured": 6
    },
    "users": {
      "total": 1250,
      "totalRevenue": 125000.00,
      "averageOrderValue": 850
    }
  }
}
```

---

## Site Settings API

### GET `/api/settings`
Get public site settings.

**Response:**
```json
{
  "data": {
    "site_name": "Hayaku",
    "site_description": "Luxury Menswear Collection",
    "free_shipping_threshold": 2000,
    "currency": "TRY"
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

### Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

---

## Data Models

### Product
```typescript
interface Product {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  price: number
  compare_price?: number
  currency: string
  is_featured: boolean
  is_active: boolean
  tags?: string[]
  brands?: Brand
  categories?: Category
  product_images?: ProductImage[]
}
```

### Brand
```typescript
interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  country?: string
  is_featured: boolean
  is_active: boolean
}
```

### Category
```typescript
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon_name?: string
  is_featured: boolean
  is_active: boolean
}
```

---

## Usage Examples

### Fetch Featured Products
```javascript
const response = await fetch('/api/products?featured=true&limit=8')
const { data } = await response.json()
```

### Add to Cart
```javascript
const response = await fetch('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'product-uuid',
    quantity: 1
  })
})
```

### Search Products
```javascript
const response = await fetch('/api/search?q=prada&type=products')
const { results } = await response.json()
```

This API provides complete CRUD operations for a luxury e-commerce platform with proper error handling, authentication, and Supabase integration.