import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has title and heading', async ({ page }) => {
    // Expect a title "to contain" a substring
    await expect(page).toHaveTitle(/Hayaku/)

    // Check main heading
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Welcome to Hayaku')
  })

  test('has navigation links', async ({ page }) => {
    // Check navigation is present
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()

    // Check for key navigation links
    await expect(page.getByRole('link', { name: /products/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /hayaku/i })).toBeVisible() // Logo link
  })

  test('is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that content is still visible and properly arranged
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    
    // Check mobile menu functionality if it exists
    const mobileMenu = page.getByRole('button', { name: /menu/i })
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      // Verify menu opens
      await expect(page.getByRole('navigation')).toBeVisible()
    }
  })
})