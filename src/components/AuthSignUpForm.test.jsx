import { screen, act, cleanup } from '@testing-library/react';
import renderWithTestUserEvent from 'test/utils/renderWithTestUserEvent.ts';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AuthSignUpForm from './AuthSignUpForm';
import * as Auth from '@/services/auth.ts';
import { MemoryRouter } from 'react-router-dom';

describe('AuthSignUpForm', () => {
  describe('User submitted valid email and password', () => {
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
      cleanup();
    });

    it('calls onSuccessCallback on successful sign up', async () => {
      const apiCall = vi.spyOn(Auth, 'createUser');

      const { user } = renderWithTestUserEvent(
        <MemoryRouter>
          <AuthSignUpForm
            onSubmit={onSubmitCallback}
            onSuccess={onSuccessCallback}
            onError={onErrorCallback}
          />
        </MemoryRouter>,
      );

      // Simulate form submission
      await user.type(screen.getByLabelText("Email"), 'test@example.com');
      await user.type(screen.getByLabelText("Password"), 'atleast8characters');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await act(async () => {
        expect(onSubmitCallback).toHaveBeenCalled();
        expect(apiCall).toHaveBeenCalledWith({ email: 'test@example.com', password: 'atleast8characters' });

        await vi.waitUntil(
          () => apiCall.mock.settledResults[0],
          { timeout: 2000 },
        )

        await expect(apiCall).toHaveResolved();

        expect(onSuccessCallback).toHaveBeenCalled();
        expect(onErrorCallback).not.toHaveBeenCalled();
      });
    });

    afterEach(async () => {
      vi.restoreAllMocks();
    });
  });

  describe('Email or password rejected', () => {
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
      const apiCall = vi.spyOn(Auth, 'createUser');

      const { user } = renderWithTestUserEvent(
        <MemoryRouter>
          <AuthSignUpForm
            onSubmit={onSubmitCallback}
            onSuccess={onSuccessCallback}
            onError={onErrorCallback}
          />
        </MemoryRouter>,
      );

      // Simulate form submission
      await user.type(screen.getByLabelText("Email"), 'registered@example.com');
      await user.type(screen.getByLabelText("Password"), 'atleast8characters');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      await act(async () => {
        expect(onSubmitCallback).toHaveBeenCalled();
        expect(apiCall).toHaveBeenCalledWith({ email: 'registered@example.com', password: 'atleast8characters' });

        await vi.waitUntil(
          () => apiCall.mock.settledResults[0],
          { timeout: 2000 },
        )

        const resultLastAPICall = apiCall.mock.results.at(-1).value;
        await expect(resultLastAPICall).rejects.toThrow(Auth.ERR_SIGNUP_REJECTED);
        expect(onSuccessCallback).not.toHaveBeenCalled();
        expect(onErrorCallback).toHaveBeenCalled();
      });
    });
  });
});
