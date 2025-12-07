import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Welcome to Hayaku')
  })

  it('displays subtitle', () => {
    render(<HomePage />)
    
    const subtitle = screen.getByText(/luxury fashion and lifestyle/i)
    expect(subtitle).toBeInTheDocument()
  })

  it('has proper structure', () => {
    render(<HomePage />)
    
    const container = screen.getByText(/welcome/i).closest('div')
    expect(container).toBeInTheDocument()
  })
})