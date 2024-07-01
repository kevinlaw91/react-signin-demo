import { APP_API_URL } from '@/config.ts';
import { SignInResponse } from '@/components/AuthSignInForm.tsx';

// Error codes
export const ERR_INVALID_CREDENTIALS = 'ERR_INVALID_CREDENTIALS';
export const ERR_UNEXPECTED_ERROR = 'ERR_UNEXPECTED_ERROR';
export const ERR_ACCOUNT_CREATE_REJECTED = 'ERR_ACCOUNT_CREATE_REJECTED';

export async function signIn({ email, password }: { email: string; password: string }) {
  const response = await fetch(new URL('/api/signin', APP_API_URL).href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(ERR_INVALID_CREDENTIALS);
    }
    throw new Error(ERR_UNEXPECTED_ERROR);
  }

  return await response.json() as SignInResponse;
}

export async function signUp({ email, password }: { email: string; password: string }) {
  const response = await fetch(new URL('/api/signup', APP_API_URL).href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 403) {
      // Error: Unable to create user account
      throw new Error(ERR_ACCOUNT_CREATE_REJECTED);
    }
    throw new Error(ERR_UNEXPECTED_ERROR);
  }

  return await response.json() as SignInResponse;
}
