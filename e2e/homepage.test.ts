import { test, expect } from '@playwright/test';

test('redirect to sign in page if signed out', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/signin');
  await expect(page).toHaveTitle(/Sign In/);
});
