import { screen, act } from '@testing-library/react';
import renderWithTestUserEvent from 'test/utils/renderWithTestUserEvent.ts';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AuthSignUpForm from './AuthSignUpForm';
import * as Auth from '@/services/auth.ts';
import { MemoryRouter } from 'react-router-dom'

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

      expect(onSubmitCallback).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith({ email: 'test@example.com', password: 'atleast8characters' });

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

      expect(onSubmitCallback).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith({ email: 'registered@example.com', password: 'atleast8characters' });

      await act(async () => vi.waitFor(
        () => expect(onErrorCallback).toHaveBeenCalled(),
        { timeout: 10000 },
      ));

      expect(onSuccessCallback).not.toHaveBeenCalled();
    });
  });
});
