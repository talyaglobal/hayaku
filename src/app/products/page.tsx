export default function ProductsPage() {
  // Sample products for testing
  const products = [
    { id: '1', name: 'Luxury Watch', price: 599, brand: 'Premium' },
    { id: '2', name: 'Designer Bag', price: 299, brand: 'Fashion' },
    { id: '3', name: 'Silk Scarf', price: 149, brand: 'Elegant' }
  ]

  return (
    <div>
      <h1>Products</h1>
      
      <div>
        {products.map((product) => (
          <div key={product.id} data-testid="product-card">
            <h3>{product.name}</h3>
            <p>{product.brand}</p>
            <span>${product.price}</span>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  )
}