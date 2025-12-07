import React from 'react'

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to Hayaku</h1>
      <p>Luxury fashion and lifestyle e-commerce platform</p>
      
      {/* Sample product cards for testing */}
      <div>
        <h2>Featured Products</h2>
        <div data-testid="product-card">
          <h3>Sample Product 1</h3>
          <p>Premium luxury item</p>
          <button data-testid="add-to-cart">Add to Cart</button>
        </div>
        <div data-testid="product-card">
          <h3>Sample Product 2</h3>
          <p>Designer accessory</p>
          <button data-testid="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}