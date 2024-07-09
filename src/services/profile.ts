import { APP_API_URL } from '@/config.ts';

interface ClaimUsernameSuccessResponse {
  success: true;
  data: {
    id: string;
    username: string;
  };
}

interface ClaimUsernameFailureResponse {
  success: false;
}

type ClaimUsernameResponse = ClaimUsernameSuccessResponse | ClaimUsernameFailureResponse;

// Error codes
export const ERR_UNEXPECTED_ERROR = 'ERR_UNEXPECTED_ERROR';
export const ERR_USERNAME_TAKEN = 'ERR_USERNAME_TAKEN';

export async function setUsername({ profileId, username }: { profileId: string; username: string }) {
  const response = await fetch(new URL(`/api/profile/${profileId}`, APP_API_URL).href, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(ERR_USERNAME_TAKEN);
    }
    throw new Error(ERR_UNEXPECTED_ERROR);
  }

  return await response.json() as ClaimUsernameResponse;
}
