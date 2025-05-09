import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('signin');
});

test('sign in by google', async ({ page }) => {
  await page
    .getByRole('button')
    .filter({ hasText: 'continue with google' })
    .click();

  // Sign in success and redirect to homepage
  await expect(page).toHaveURL('');
  await expect(page).toHaveTitle(/welcome/i);
});

test('sign in by password', async ({ page }) => {
  // Fill in sign in form
  await page
    .getByRole('textbox', { name: 'email' })
    .fill('email@example.com');
  await page
    .getByRole('textbox', { name: 'password' })
    .fill('success');
  await page
    .locator('button[type="submit"]', { hasText: /^sign in$/i })
    .click();

  // Wait for progress bar to dismiss
  await expect(page.getByText(/signing in/i)).toBeVisible();
  await expect(page.getByText(/signing in/i)).toBeHidden();

  // Sign in success and redirect to homepage
  await page.waitForURL('');
  await expect(page.getByText(/welcome,/i)).toBeVisible();
});

test('sign in by password, incorrect credential', async ({ page }) => {
  // Fill in sign in form
  await page
    .getByRole('textbox', { name: 'email' })
    .fill('email@example.com');
  await page
    .getByRole('textbox', { name: 'password' })
    .fill('incorrect');
  await page
    .locator('button[type="submit"]', { hasText: /^sign in$/i })
    .click();

  // Wait for progress bar to dismiss
  await expect(page.getByText(/signing in/i)).toBeVisible();
  await expect(page.getByText(/signing in/i)).toBeHidden();

  // Sign in failed
  await expect(page).toHaveURL('signin');

  // Error message visible
  await expect(page.getByRole('dialog').getByText(/incorrect email or password/i)).toBeVisible({ timeout: 15000 });
});
