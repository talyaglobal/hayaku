import { test, expect } from '@playwright/test'

test.describe.skip('Authentication Flow', () => {
  test('can navigate to login page', async ({ page }) => {
    await page.goto('/')
    
    // Find and click login link
    const loginLink = page.getByRole('link', { name: /login|sign in/i })
    await loginLink.click()
    
    // Verify we're on login page
    await expect(page).toHaveURL(/.*login/)
    await expect(page.getByRole('heading', { name: /login|sign in/i })).toBeVisible()
  })

  test('can navigate to signup page', async ({ page }) => {
    await page.goto('/')
    
    // Find and click signup link
    const signupLink = page.getByRole('link', { name: /signup|register|sign up/i })
    await signupLink.click()
    
    // Verify we're on signup page (actual route is /auth/signup)
    await expect(page).toHaveURL(/.*auth\/signup/)
    await expect(page.getByRole('heading', { name: /signup|register|sign up/i })).toBeVisible()
  })

  test('login form validation', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /login|sign in/i })
    await submitButton.click()
    
    // Check for validation messages
    await expect(page.getByText(/email.*required/i)).toBeVisible()
    await expect(page.getByText(/password.*required/i)).toBeVisible()
  })

  test('signup form validation', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /signup|register|sign up/i })
    await submitButton.click()
    
    // Check for validation messages
    await expect(page.getByText(/email.*required/i)).toBeVisible()
    await expect(page.getByText(/password.*required/i)).toBeVisible()
  })

  test('password requirements', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Fill in weak password
    await page.fill('input[type="password"]', '123')
    
    // Check for password strength feedback
    const passwordHelp = page.getByText(/password.*weak|must contain/i)
    await expect(passwordHelp).toBeVisible()
  })
})