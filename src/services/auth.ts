import { APP_API_URL } from '@/config.ts';
import { SignInResponse } from '@/components/AuthSignInForm.tsx';
import { SignUpResponse } from '@/components/AuthSignUpForm.tsx';

// Error codes
export enum AuthErrorCode {
  ERR_UNEXPECTED_ERROR = 'ERR_UNEXPECTED_ERROR',
  ERR_INVALID_CREDENTIALS = 'ERR_INVALID_CREDENTIALS',
  ERR_ACCOUNT_SIGNUP_REJECTED = 'ERR_ACCOUNT_SIGNUP_REJECTED',
}

export async function authenticateUser({ email, password }: { email: string; password: string }) {
  const response = await fetch(new URL('/api/signin', APP_API_URL).href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(AuthErrorCode.ERR_INVALID_CREDENTIALS);
    }
    throw new Error(AuthErrorCode.ERR_UNEXPECTED_ERROR);
  }

  return await response.json() as SignInResponse;
}

export async function createUser({ email, password }: { email: string; password: string }) {
  const response = await fetch(new URL('/api/account/create', APP_API_URL).href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      // Error: Unable to create user account
      throw new Error(AuthErrorCode.ERR_ACCOUNT_SIGNUP_REJECTED);
    }
    throw new Error(AuthErrorCode.ERR_UNEXPECTED_ERROR);
  }

  return await response.json() as SignUpResponse;
}
