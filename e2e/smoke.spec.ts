import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('app loads successfully and shows correct title', async ({ page }) => {
    await page.goto('/learn-like-k/');
    await expect(page.locator('h1')).toHaveText('Learn Like K');
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/learn-like-k/');
    
    // Check that bottom navigation exists (more specific)
    await expect(page.locator('.nav-link').filter({ hasText: 'Quiz' })).toBeVisible();
    await expect(page.locator('.nav-link').filter({ hasText: 'Settings' })).toBeVisible(); 
    await expect(page.locator('.nav-link').filter({ hasText: 'About' })).toBeVisible();
  });
})
