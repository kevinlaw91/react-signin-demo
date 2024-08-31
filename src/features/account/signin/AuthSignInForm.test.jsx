import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AuthSignInForm } from '@/features/account/signin/AuthSignInForm';
import * as Auth from '@/services/auth.ts';
import { MemoryRouter } from 'react-router-dom';

describe('AuthSignInForm', () => {
  let apiCall;

  beforeAll(() => {
    apiCall = vi.spyOn(Auth, 'authenticateUser');
  });

  afterAll(() => {
    apiCall.mockRestore();
  });

  describe('submit valid user credentials', () => {
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
          <AuthSignInForm
            onSubmit={onSubmit}
            onSuccess={onSuccess}
            onError={onError}
          />
        </MemoryRouter>,
      );

      // Simulate form submission
      await user.type(form.getByLabelText(/email/i), 'test@example.com');
      await user.type(form.getByLabelText(/password/i), 'success');
      await user.click(form.getByRole('button', { name: /sign in/i }));
    });

    afterAll(() => {
      apiCall.mockClear();
    });

    it('should submit the form with correct data', async () => {
      expect(onSubmit).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com', password: 'success' }),
      );
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

  describe('submit invalid user credentials', () => {
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
          <AuthSignInForm
            onSubmit={onSubmit}
            onSuccess={onSuccess}
            onError={onError}
          />
        </MemoryRouter>,
      );

      // Simulate form submission
      await user.type(form.getByLabelText(/email/i), 'test@example.com');
      await user.type(form.getByLabelText(/password/i), 'notthepassword');
      await user.click(form.getByRole('button', { name: /sign in/i }));
    });

    afterAll(() => {
      apiCall.mockClear();
    });

    it('should submit the form with correct data', async () => {
      expect(onSubmit).toHaveBeenCalled();
      expect(apiCall).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com', password: 'notthepassword' }),
      );
    });

    it('api call throws invalid credentials error', async () => {
      await vi.waitUntil(
        () => apiCall.mock.results[0],
        { timeout: 2000 },
      );

      await expect(apiCall.mock.results[0].value)
        .rejects
        .toThrow(Auth.AuthErrorCode.ERR_INVALID_CREDENTIALS);
    });

    it('should not call onSuccess', () => {
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should call onError', () => {
      expect(onError).toHaveBeenCalled();
    });
  });
});
