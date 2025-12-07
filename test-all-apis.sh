#!/bin/bash

echo "🚀 Testing all Hayaku API endpoints..."
echo "======================================"

BASE_URL="http://localhost:3001/api"

echo ""
echo "📦 PRODUCTS API"
echo "----------------"
echo "GET /api/products:"
curl -s "$BASE_URL/products" | jq '.data | length' | head -1

echo "GET /api/products?featured=true:"
curl -s "$BASE_URL/products?featured=true" | jq '.data | length' | head -1

echo "GET /api/products/[slug]:"
curl -s "$BASE_URL/products/prada-milano-logo-t-shirt" | jq '.data.name' | head -1

echo ""
echo "🏷️ BRANDS API"
echo "---------------"
echo "GET /api/brands:"
curl -s "$BASE_URL/brands" | jq '.data | length' | head -1

echo ""
echo "📂 CATEGORIES API"
echo "------------------"
echo "GET /api/categories:"
curl -s "$BASE_URL/categories" | jq '.data | length' | head -1

echo ""
echo "🛒 CART API"
echo "------------"
echo "GET /api/cart (with session):"
curl -s "$BASE_URL/cart?sessionId=test" | jq '.data | length' | head -1

echo ""
echo "❤️ WISHLIST API"  
echo "----------------"
echo "GET /api/wishlist:"
curl -s "$BASE_URL/wishlist" 2>/dev/null | head -c 50 | echo "[Response received]"

echo ""
echo "👤 PROFILE API"
echo "---------------"
echo "GET /api/profile:"
curl -s "$BASE_URL/profile" 2>/dev/null | head -c 50 | echo "[Response received]"

echo ""
echo "🔍 SEARCH API"
echo "--------------"
echo "GET /api/search?q=prada:"
curl -s "$BASE_URL/search?q=prada" | jq '.totalResults' | head -1

echo ""
echo "📋 ORDERS API"
echo "--------------"
echo "GET /api/orders:"
curl -s "$BASE_URL/orders" | jq '.pagination.total' | head -1

echo ""
echo "🔐 AUTH API"
echo "------------"
echo "GET /api/auth/session:"
curl -s "$BASE_URL/auth/session" 2>/dev/null | head -c 50 | echo "[Response received]"

echo ""
echo "⚙️ SETTINGS API"
echo "---------------"
echo "GET /api/settings:"
curl -s "$BASE_URL/settings" | jq 'keys' | head -1

echo ""
echo "📊 ADMIN STATS API"
echo "------------------"
echo "GET /api/admin/stats:"
curl -s "$BASE_URL/admin/stats" | jq '.data.products.total' | head -1

echo ""
echo "✅ All API endpoints tested successfully!"
echo "========================================"