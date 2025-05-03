import { test } from '@playwright/test';

test('sign out', async ({ page }) => {
  await page.goto('/signin');

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

  // Wait for sign in to success and redirect to homepage
  await page.waitForURL('/');

  // Open side menu
  await page.getByLabel('menu').click();

  // Click sign out link
  await page
    .getByTestId('off-canvas-menu')
    .locator(page.getByText('sign out'))
    .click();

  // Sign out and redirect to sign in
  await page.waitForURL('/signin', { timeout: 3000 });
});
