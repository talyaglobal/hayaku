import { render, screen } from '@testing-library/react'
import Header from '@/components/Header'

// Mock the auth provider
jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    user: null,
    signOut: jest.fn()
  })
}))

// Mock cart icon
jest.mock('@/components/CartIcon', () => {
  return function MockCartIcon() {
    return <div>Cart</div>
  }
})

describe('Header Component', () => {
  it('renders the header with navigation', () => {
    render(<Header />)
    
    // Check if the header is rendered
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('displays the brand name', () => {
    render(<Header />)
    
    // Check if brand name is present
    const brandName = screen.getByText('Hayaku')
    expect(brandName).toBeInTheDocument()
  })

  it('has navigation links', () => {
    render(<Header />)
    
    // Check for common navigation items
    expect(screen.getByText(/products/i)).toBeInTheDocument()
  })
})