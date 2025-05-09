import { cleanup, queryByText, render, waitForElementToBeRemoved } from '@testing-library/react/pure';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import ProfileSetupUsername from '@/features/profile/setup/ProfileSetupUsername.tsx';
import userEvent from '@testing-library/user-event';
import * as Profile from '@/services/profile.ts';

const nextStepFn = vi.hoisted(() => vi.fn());

describe('ProfileSetupUsername', () => {
  beforeAll(() => {
    vi.mock('react-use-wizard', async importOriginal => ({
      ...(await importOriginal()),
      useWizard: vi.fn().mockReturnValue({
        nextStep: nextStepFn,
      }),
    }));
  });

  describe('username registered', () => {
    let user;
    let container;

    beforeAll(async () => {
      user = userEvent.setup();

      container = render(
        <ProfileSetupUsername />,
      );

      // Simulate form submission
      const textbox = container.getByRole('textbox');
      // Note: usernames with odd lengths are 'taken'
      await user.type(textbox, 'usernametaken');
      await user.click(container.getByRole('button', { name: /check/i }));
    });

    afterAll(cleanup);

    it('should show username taken', async () => {
      await waitForElementToBeRemoved(() => queryByText(container.container, /checking availability/i), { timeout: 10000 });

      expect(await container.findByText(/already taken/i)).toBeInTheDocument();
    });

    it('should still show error even when retry', async () => {
      // Still show error even when retry
      await user.click(container.getByRole('button', { name: /check/i }));
      expect(await container.findByText(/already taken/i)).toBeInTheDocument();
    });
  });

  describe('username available', () => {
    let user;
    let container;
    let apiCall;

    beforeAll(async () => {
      nextStepFn.mockClear();

      user = userEvent.setup();

      container = render(
        <ProfileSetupUsername />,
      );

      apiCall = vi.spyOn(Profile, 'saveUsername');

      // Simulate form submission
      const textbox = container.getByRole('textbox');
      // Note: usernames with even lengths are 'taken'
      await user.type(textbox, 'username');
      await user.click(container.getByRole('button', { name: /check/i }));
    });

    afterAll(() => {
      apiCall.mockRestore();
    });

    it('should show username available', async () => {
      await waitForElementToBeRemoved(() => queryByText(container.container, /checking availability/i), { timeout: 10000 });

      expect(await container.findByText(/is available/i)).toBeInTheDocument();
    });

    it('should show confirm button', async () => {
      expect(await container.findByRole('button', { name: /confirm/i })).toBeInTheDocument();
    });

    it('should submit form when pressed', async () => {
      await user.click(await container.findByRole('button', { name: /confirm/i }));
      expect(apiCall).toHaveBeenCalled();
      await vi.waitUntil(
        () => apiCall.mock.results[0],
        { timeout: 2000 },
      );

      await expect(apiCall.mock.results[0].value).resolves.toBeDefined();
    });

    it('should return success', async () => {
      await vi.waitUntil(
        () => apiCall.mock.results[0],
        { timeout: 2000 },
      );
      await expect(apiCall.mock.results[0].value).resolves.toBeDefined();
    });

    it('should trigger a signal to proceed to the next step', () => {
      expect(nextStepFn).toBeCalled();
    });
  });
});
