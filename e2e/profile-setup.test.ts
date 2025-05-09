import { test, expect, Page } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { mockLoggedIn } from './utils/session.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function saveUsername(page: Page) {
  await expect(page.getByText(/pick your username/i)).toBeVisible();

  await page
    .getByPlaceholder(/enter a username/i)
    .fill('foobar');

  await page
    .locator('button[type="submit"]', { hasText: /^check availability$/i })
    .click();

  await page
    .locator('button[type="submit"]', { hasText: /^confirm$/i })
    .click();
}

test.describe('profile setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');

    // Mock active session
    await page.evaluate(mockLoggedIn);
    await page.goto('setup');
  });

  test('check username availability', async ({ page }) => {
    await expect(page.getByText(/pick your username/i)).toBeVisible();

    // Check availability
    await page
      .getByPlaceholder(/enter a username/i)
      // Length must be odd number or else it is considered as taken
      .fill('length_must_be_odd_');

    await page
      .locator('button[type="submit"]', { hasText: /^check availability$/i })
      .click();

    // Error message
    await expect(page.getByText(/username is already taken/i)).toBeVisible();
  });

  test('set profile pic', async ({ page }) => {
    // Set username
    await saveUsername(page);

    // Set profile picturer
    await expect(page.getByText(/set profile picture/i)).toBeVisible();

    // Select image file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'choose file' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, '../public/assets/images/profile-picture-blank.jpg'));

    // Confirm crop
    await page.getByRole('button', { name: 'confirm' }).click();

    // Save profile pic
    await page.getByRole('button', { name: 'continue' }).click();

    // Setup completed
    await expect(page.getByText(/complete/i)).toBeVisible();
    await page
      .locator('a', { hasText: /^go to home$/i })
      .click();
  });

  test('skip profile pic', async ({ page }) => {
    // Set username
    await saveUsername(page);

    // Skip setting profile picture
    await expect(page.getByText(/set profile picture/i)).toBeVisible();
    await page
      .getByRole('button', { name: 'skip' })
      .click();

    // Setup completed
    await expect(page.getByText(/complete/i)).toBeVisible();
    await page
      .locator('a', { hasText: /^go to home$/i })
      .click();
  });
});
