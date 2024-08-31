import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AuthSignUpForm } from '@/features/account/signup/AuthSignUpForm';
import * as Auth from '@/services/auth.ts';
import { MemoryRouter } from 'react-router-dom';

describe('AuthSignUpForm', () => {
  let apiCall;

  beforeAll(() => {
    apiCall = vi.spyOn(Auth, 'createUser');
  });

  afterAll(() => {
    apiCall.mockRestore();
  });

  describe('submit valid email and password', () => {
    let onSubmit, onSuccess, onError;
    let user;
    let form;

    beforeAll(async () => {
      onSubmit = vi.fn();
      onSuccess = vi.fn();
      onError = vi.fn();

      user = userEvent.setup();
      form = render(
        <MemoryRouter>
          <AuthSignUpForm
            onSubmit={onSubmit}
            onSuccess={onSuccess}
            onError={onError}
          />
        </MemoryRouter>,
      );

      // Simulate form submission
      await user.type(form.getByLabelText('Email'), 'test@example.com');
      await user.type(form.getByLabelText('Password'), 'atleast8characters');
      await user.click(form.getByRole('button', { name: /create account/i }));
    });

    afterAll(() => {
      apiCall.mockClear();
    });

    it('should submit the form with correct data', async () => {
      expect(onSubmit).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith({ email: 'test@example.com', password: 'atleast8characters' });
    });

    it('api call resolves', async () => {
      await vi.waitUntil(
        () => apiCall.mock.results[0],
        { timeout: 2000 },
      );
      await expect(apiCall.mock.results[0].value).resolves.toBeDefined();
    });

    it('should call onSuccess', () => {
      expect(onSuccess).toHaveBeenCalled();
    });

    it('should not call onError', () => {
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('Email or password rejected', () => {
    let onSubmit, onSuccess, onError;
    let user;
    let form;

    beforeAll(async () => {
      onSubmit = vi.fn();
      onSuccess = vi.fn();
      onError = vi.fn();

      user = userEvent.setup();
      form = render(
        <MemoryRouter>
          <AuthSignUpForm
            onSubmit={onSubmit}
            onSuccess={onSuccess}
            onError={onError}
          />
        </MemoryRouter>,
      );

      // Simulate form submission
      await user.type(form.getByLabelText('Email'), 'registered@example.com');
      await user.type(form.getByLabelText('Password'), 'atleast8characters');
      await user.click(form.getByRole('button', { name: /create account/i }));
    });

    afterAll(() => {
      apiCall.mockClear();
    });

    it('should submit the form with correct data', async () => {
      expect(onSubmit).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith({ email: 'registered@example.com', password: 'atleast8characters' });
    });

    it('calls onError on unsuccessful sign in', async () => {
      await vi.waitUntil(
        () => apiCall.mock.settledResults[0],
        { timeout: 2000 },
      );

      await expect(apiCall.mock.results[0].value)
        .rejects
        .toThrow(Auth.AuthErrorCode.ERR_ACCOUNT_SIGNUP_REJECTED);
    });

    it('should not call onSuccess', () => {
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should call onError', () => {
      expect(onError).toHaveBeenCalled();
    });
  });
});
