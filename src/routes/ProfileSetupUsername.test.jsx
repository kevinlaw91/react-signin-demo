import { cleanup, render } from '@testing-library/react/pure';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import ProfileSetupUsername from '@/routes/ProfileSetupUsername.tsx';
import userEvent from '@testing-library/user-event';
import * as Profile from '@/services/profile.ts';
import { PopupManagerProvider } from '@/contexts/PopupModalManagerContext.tsx';

describe('ProfileSetupUsername', () => {
  describe('username registered', () => {
    let user;
    let container;

    beforeAll(async () => {
      user = userEvent.setup();
      container = render(
        <HelmetProvider>
          <PopupManagerProvider>
            <ProfileSetupUsername />
          </PopupManagerProvider>
        </HelmetProvider>,
      );

      // Simulate form submission
      const textbox = container.getByRole('textbox');
      // Note: usernames with odd lengths are 'taken'
      await user.type(textbox, 'usernametaken');
      await user.click(container.getByRole('button', { name: /check/i }));
    });

    afterAll(cleanup);

    it('should show username taken', async () => {
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

    // Wizard context
    let setCurrentStep = vi.fn();

    beforeAll(async () => {
      user = userEvent.setup();
      container = render(
        <HelmetProvider>
          <PopupManagerProvider>
            <ProfileSetupUsername />
          </PopupManagerProvider>
        </HelmetProvider>,
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
      expect(setCurrentStep).toBeCalled();
    });
  });
});
