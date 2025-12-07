import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y, getViolations } from 'axe-playwright'

test.describe.skip('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await injectAxe(page)
  })

  test('homepage should be accessible', async ({ page }) => {
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true },
    })
  })

  test('navigation should be keyboard accessible', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    
    // Check if focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement)
  })

  test('images should have alt text', async ({ page }) => {
    await page.goto('/products')
    
    const images = await page.locator('img').all()
    
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const ariaLabel = await img.getAttribute('aria-label')
      const role = await img.getAttribute('role')
      
      // Image should have alt text, aria-label, or be decorative
      expect(
        alt !== null && alt !== '' || 
        ariaLabel !== null || 
        role === 'presentation' || 
        role === 'img'
      ).toBeTruthy()
    }
  })

  test('forms should have proper labels', async ({ page }) => {
    await page.goto('/auth/login')
    
    const inputs = await page.locator('input').all()
    
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      
      // Input should have associated label
      const hasLabel = id && await page.locator(`label[for="${id}"]`).count() > 0
      
      expect(
        hasLabel || 
        ariaLabel !== null || 
        ariaLabelledBy !== null
      ).toBeTruthy()
    }
  })

  test('color contrast should meet WCAG standards', async ({ page }) => {
    await checkA11y(page, null, {
      tags: ['wcag2a', 'wcag2aa'],
      rules: {
        'color-contrast': { enabled: true }
      }
    })
  })

  test('page should have proper headings hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    
    let hasH1 = false
    const headingLevels = []
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
      const level = parseInt(tagName.replace('h', ''))
      
      if (level === 1) hasH1 = true
      headingLevels.push(level)
    }
    
    // Page should have at least one H1
    expect(hasH1).toBeTruthy()
    
    // Check heading hierarchy (no skipping levels)
    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i]
      const previous = headingLevels[i - 1]
      
      // Allow same level, next level, or going back to any previous level
      expect(current <= previous + 1).toBeTruthy()
    }
  })

  test('interactive elements should be focusable', async ({ page }) => {
    const interactiveElements = await page.locator('button, a, input, select, textarea').all()
    
    for (const element of interactiveElements) {
      const isVisible = await element.isVisible()
      if (!isVisible) continue
      
      const tabIndex = await element.getAttribute('tabindex')
      const isDisabled = await element.getAttribute('disabled')
      
      // Interactive elements should be focusable (unless disabled)
      if (!isDisabled) {
        expect(tabIndex !== '-1').toBeTruthy()
      }
    }
  })
})