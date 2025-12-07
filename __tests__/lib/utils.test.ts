import { formatPrice, validateEmail, slugify } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats prices correctly', () => {
      expect(formatPrice(1999)).toBe('₺19,99')
      expect(formatPrice(50000)).toBe('₺500,00')
      expect(formatPrice(0)).toBe('₺0,00')
    })

    it('handles decimal prices', () => {
      expect(formatPrice(1550)).toBe('₺15,50')
      expect(formatPrice(10099)).toBe('₺100,99')
    })
  })

  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true)
    })

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('slugify', () => {
    it('converts strings to slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Product Name & Description')).toBe('product-name-description')
      expect(slugify('Special Çharacters')).toBe('special-haracters')
    })

    it('handles edge cases', () => {
      expect(slugify('')).toBe('')
      expect(slugify('   spaces   ')).toBe('spaces')
      expect(slugify('UPPERCASE')).toBe('uppercase')
    })
  })
})