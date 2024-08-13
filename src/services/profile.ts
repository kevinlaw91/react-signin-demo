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

interface CheckUsernameResponse {
  data: {
    username: string;
    isAvailable: boolean;
  };
}

// Error codes
export enum ProfileErrorCode {
  ERR_UNEXPECTED_ERROR = 'ERR_UNEXPECTED_ERROR',
  ERR_PROFILE_USERNAME_TAKEN = 'ERR_PROFILE_USERNAME_TAKEN',
}

export async function saveUsername({ profileId, username }: { profileId: string; username: string }) {
  const response = await fetch(new URL(`/api/profile/${profileId}/username`, APP_API_URL).href, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(ProfileErrorCode.ERR_PROFILE_USERNAME_TAKEN);
    }
    throw new Error(ProfileErrorCode.ERR_UNEXPECTED_ERROR);
  }

  return await response.json() as ClaimUsernameResponse;
}

export async function checkUsernameAvailability(username: string, signal?: AbortSignal) {
  const q = new URLSearchParams({
    action: 'check-username',
    username: username,
  });

  const response = await fetch(new URL(`/api/profile?${q.toString()}`, APP_API_URL).href, {
    signal,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    return await response.json() as CheckUsernameResponse;
  }

  throw new Error(`${response.statusText} ${response.status}`);
}

interface UploadProfilePictureSuccessResponse {
  success: true;
  data: {
    src: string;
  };
}

interface UploadProfilePictureFailureResponse {
  success: false;
}

type UploadProfilePictureResponse = UploadProfilePictureSuccessResponse | UploadProfilePictureFailureResponse;

export async function setProfilePicture({ profileId, image }: { profileId: string; image: Blob }) {
  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch(new URL(`/api/profile/${profileId}/picture`, APP_API_URL).href, {
    method: 'POST',
    body: formData,
  });

  return await response.json() as UploadProfilePictureResponse;
}
