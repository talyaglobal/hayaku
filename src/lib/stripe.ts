import Stripe from 'stripe'

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'try', // Turkish Lira
  paymentMethodTypes: ['card'],
}

// Payment validation utilities
export function validateCardNumber(cardNumber: string): boolean {
  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  
  // Check length (13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false
  }
  
  // Luhn algorithm validation
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

export function validateExpiryDate(expiryDate: string): boolean {
  const cleaned = expiryDate.replace(/\D/g, '')
  if (cleaned.length !== 4) return false
  
  const month = parseInt(cleaned.substring(0, 2))
  const year = parseInt('20' + cleaned.substring(2, 4))
  
  if (month < 1 || month > 12) return false
  
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  
  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false
  
  return true
}

export function validateCVV(cvv: string): boolean {
  const cleaned = cvv.replace(/\D/g, '')
  return cleaned.length >= 3 && cleaned.length <= 4
}

export function getCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  
  // Visa
  if (/^4/.test(cleaned)) return 'visa'
  
  // Mastercard
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard'
  
  // American Express
  if (/^3[47]/.test(cleaned)) return 'amex'
  
  // Discover
  if (/^6(?:011|5)/.test(cleaned)) return 'discover'
  
  return 'unknown'
}

// Convert amount to Stripe's smallest currency unit (kuruş for TRY)
export function convertToStripeAmount(amount: number): number {
  return Math.round(amount * 100) // TRY uses 2 decimal places, so multiply by 100
}

// Convert from Stripe's smallest currency unit
export function convertFromStripeAmount(amount: number): number {
  return amount / 100
}
