import { test, expect } from '@playwright/test'

test.describe('Smart Question Selection E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learn-like-k/')
  })

  test('should load topic and show questions without errors', async ({ page }) => {
    // Load a topic first
    await page.click('a[href="/learn-like-k/settings"]')
    await page.waitForLoadState('networkidle')
    
    // Select Talon Alphabet from dropdown
    await page.selectOption('#predefined-topics', 'Talon Alphabet')
    await page.click('text=Load Topic')
    
    // Go back to quiz
    await page.click('a[href="/learn-like-k/quiz"]')
    await page.waitForLoadState('networkidle')
    
    // Verify a question is displayed
    const questionElement = page.locator('.text-5xl.font-bold.text-gray-800')
    await expect(questionElement).toBeVisible()
    
    // Verify question progression works by advancing a few questions
    for (let i = 0; i < 3; i++) {
      // Press Enter twice to advance to next question
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(200)
      
      // Should still have a question visible
      await expect(questionElement).toBeVisible()
    }
  })

  test('should reset question distribution when toggling question sets', async ({ page }) => {
    // Load a topic
    await page.click('a[href="/learn-like-k/settings"]')
    await page.selectOption('#predefined-topics', 'Talon Alphabet')
    await page.click('text=Load Topic')
    await page.click('a[href="/learn-like-k/quiz"]')
    
    // Go through some questions to build usage history
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(50)
    }
    
    // Show question sets
    await page.click('text=choose questions')
    
    // Toggle a question set off and on (simulates user changing selection)
    const firstCheckbox = page.locator('input[type="checkbox"]').first()
    await firstCheckbox.click() // Turn off
    await page.waitForTimeout(100)
    await firstCheckbox.click() // Turn back on
    
    // Hide question sets
    await page.click('text=hide')
    
    // Continue with quiz - the usage tracking should have been reset
    // This is more of a behavioral test - we can't directly verify the internal state
    // but we can verify the quiz continues to work properly
    for (let i = 0; i < 5; i++) {
      const questionElement = page.locator('.text-5xl.font-bold.text-gray-800')
      await expect(questionElement).toBeVisible()
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(50)
    }
  })

  test('should handle single question set gracefully', async ({ page }) => {
    // Load a topic
    await page.click('a[href="/learn-like-k/settings"]')
    await page.selectOption('#predefined-topics', 'Talon Alphabet')
    await page.click('text=Load Topic')
    await page.click('a[href="/learn-like-k/quiz"]')
    
    // Show question sets and disable all but one
    await page.click('text=choose questions')
    
    // Get all checkboxes and disable all but the first
    const checkboxes = page.locator('input[type="checkbox"]')
    const count = await checkboxes.count()
    
    for (let i = 1; i < count; i++) {
      await checkboxes.nth(i).click()
    }
    
    // Hide question sets
    await page.click('text=hide')
    
    // Verify quiz still works with single question
    const questionElement = page.locator('.text-5xl.font-bold.text-gray-800')
    await expect(questionElement).toBeVisible()
    
    // Go through a few iterations - should show same question but not crash
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(50)
      await expect(questionElement).toBeVisible()
    }
  })

  test('should show "No questions selected" when all sets disabled', async ({ page }) => {
    // Load a topic
    await page.click('a[href="/learn-like-k/settings"]')
    await page.selectOption('#predefined-topics', 'Talon Alphabet')
    await page.click('text=Load Topic')
    await page.click('a[href="/learn-like-k/quiz"]')
    
    // Show question sets and disable all
    await page.click('text=choose questions')
    
    const checkboxes = page.locator('input[type="checkbox"]')
    const count = await checkboxes.count()
    
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).click()
    }
    
    // Should show "No questions selected" message
    await expect(page.locator('text=No questions selected')).toBeVisible()
    
    // Input field should not be visible
    await expect(page.locator('input[type="text"]')).not.toBeVisible()
  })
})