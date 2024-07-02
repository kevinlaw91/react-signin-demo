import { screen, act } from '@testing-library/react';
import renderWithTestUserEvent from 'test/utils/renderWithTestUserEvent.ts';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AuthSignInForm from './AuthSignInForm';
import * as Auth from '@/services/auth.ts';

describe('AuthSignInForm', () => {
  describe('User submitted a valid user credential', () => {
    // const signInApiCall = vi.fn().mockResolvedValue({ success: true });
    let onSubmitCallback = vi.fn();
    let onSuccessCallback = vi.fn();
    let onErrorCallback = vi.fn();

    beforeEach(() => {
      onSubmitCallback.mockReset();
      onSuccessCallback.mockReset();
      onErrorCallback.mockReset();
    });

    afterEach(async () => {
      vi.restoreAllMocks();
    });

    it('calls onSuccessCallback on successful sign in', async () => {
      const apiCall = vi.spyOn(Auth, 'authenticateUser');

      const { user } = renderWithTestUserEvent(
        <AuthSignInForm
          onSubmit={onSubmitCallback}
          onSuccess={onSuccessCallback}
          onError={onErrorCallback}
        />,
      );

      // Simulate form submission
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'success');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(onSubmitCallback).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith({ email: 'test@example.com', password: 'success' });

      await act(async () => vi.waitFor(
        () => expect(onSuccessCallback).toHaveBeenCalled(),
        { timeout: 10000 },
      ));

      expect(onErrorCallback).not.toHaveBeenCalled();
    });

    afterEach(async () => {
      vi.restoreAllMocks();
    });
  });

  describe('User submitted invalid user credential', () => {
    // const signInApiCall = vi.fn().mockResolvedValue({ success: true });
    let onSubmitCallback = vi.fn();
    let onSuccessCallback = vi.fn();
    let onErrorCallback = vi.fn();

    beforeEach(() => {
      onSubmitCallback.mockReset();
      onSuccessCallback.mockReset();
      onErrorCallback.mockReset();
    });

    it('calls onErrorCallback on unsuccessful sign in', async () => {
      const apiCall = vi.spyOn(Auth, 'authenticateUser');

      const { user } = renderWithTestUserEvent(
        <AuthSignInForm
          onSubmit={onSubmitCallback}
          onSuccess={onSuccessCallback}
          onError={onErrorCallback}
        />,
      );

      // Simulate form submission
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'notthepassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(onSubmitCallback).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith({ email: 'test@example.com', password: 'notthepassword' });

      await act(async () => vi.waitFor(
        () => expect(onErrorCallback).toHaveBeenCalled(),
        { timeout: 10000 },
      ));

      expect(onSuccessCallback).not.toHaveBeenCalled();
    });
  });
});
