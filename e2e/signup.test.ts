import { test, expect } from '@playwright/test';

test.describe('redirects to sign up page', () => {
  test('/signup', async ({ page }) => {
    await page.goto('signup');
    const signUpPageIndicator = page.getByText(/already have an account\?/i);
    await expect(signUpPageIndicator).toBeVisible();
  });

  test('create account link in sign in form', async ({ page }) => {
    await page.goto('signin');
    await page
      .getByRole('link')
      .filter({ hasText: 'create account' })
      .click();

    await expect(page).toHaveURL('signup');
    const signUpPageIndicator = page.getByText(/already have an account\?/i);
    await expect(signUpPageIndicator).toBeVisible();
  });
});

test.describe('sign up', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('signup');
  });

  test('sign up with google', async ({ page }) => {
    await page
      .getByRole('button')
      .filter({ hasText: 'continue with google' })
      .click();

    // Sign in success and redirect to homepage
    await expect(page).toHaveURL('');
    await expect(page).toHaveTitle(/welcome/i);
  });

  test('submit sign up form', async ({ page }) => {
    // Fill in sign up form
    await page
      .getByRole('textbox', { name: 'email' })
      .fill('email@example.com');
    await page
      .getByRole('textbox', { name: 'password' })
      .fill('password');
    await page
      .locator('button[type="submit"]', { hasText: /^create account$/i })
      .click();

    // Wait for progress bar to dismiss
    await expect(page.getByText(/creating account/i)).toBeVisible();
    await expect(page.getByText(/creating account/i)).toBeHidden();

    // Sign up success
    await expect(page.getByText(/verify email/i)).toBeVisible();

    // Go to home (redirects to profile setup)
    await page
      .getByText(/go to home/i)
      .click();
    await expect(page).toHaveURL('setup');
  });

  test('submit incomplete sign up form', async ({ page }) => {
    // Fill in sign up form
    await page
      .getByRole('textbox', { name: 'email' })
      .fill('email@example.com');
    await page
      .locator('button[type="submit"]', { hasText: /^create account$/i })
      .click();

    // Error message
    await expect(page.getByText(/password must be at least 8 characters long/i)).toBeVisible();

    // No redirect
    await expect(page).toHaveURL('signup');
  });
});
