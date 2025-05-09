import 'fake-indexeddb/auto';
import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { cleanup, render, waitForElementToBeRemoved } from '@testing-library/react/pure';
import * as exifRotate from 'exif-rotate-js';
import ProfileSetupProfilePicture from '@/features/profile/setup/ProfileSetupProfilePicture.tsx';
import * as imageUtils from '@/utils/image.ts';
import * as Profile from '@/services/profile.ts';

const fakeImageDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII';

const nextStepFn = vi.hoisted(() => vi.fn());

URL.revokeObjectURL = vi.fn();

describe('ProfileSetupProfilePicture', () => {
  let testProfileImageBlob, testProfileImageFile;

  beforeAll(() => {
    vi.mock('react-use-wizard', async importOriginal => ({
      ...(await importOriginal()),
      useWizard: vi.fn().mockReturnValue({
        nextStep: nextStepFn,
      }),
    }));

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      canvas.toBlob((blob) => {
        testProfileImageBlob = blob;

        const file = new File([blob], 'pic.jpg', { type: 'image/jpeg' });
        testProfileImageFile = file;
        resolve(file);
      });
    });
  });

  describe('File picker', () => {
    let user;
    let container;
    let fileInput;
    let onClickSpy;

    beforeAll(async () => {
      user = userEvent.setup();

      container = render(
        <ProfileSetupProfilePicture />,
      );

      onClickSpy = vi.fn();
      fileInput = container.getByTestId('file_input');
      fileInput.addEventListener('click', onClickSpy);
    });

    afterEach(() => {
      onClickSpy.mockClear();
    });

    afterAll(cleanup);

    it('should show file picker when click choose avatar', async () => {
      const btn = container.getByRole('button', { name: /choose file/i });
      await user.click(btn);
      expect(onClickSpy).toHaveBeenCalled();
    });

    it('should show file picker when click choose file button', async () => {
      const avatarPreview = container.getByTestId('avatar_preview');
      await user.click(avatarPreview);
      expect(onClickSpy).toHaveBeenCalled();
    });
  });

  describe('Image cropper', () => {
    let user;
    let container;

    beforeAll(async () => {
      user = userEvent.setup();
      vi.spyOn(exifRotate, 'getBase64Strings').mockReturnValue([fakeImageDataUrl]);
      vi.spyOn(imageUtils, 'cropImage').mockResolvedValue(testProfileImageBlob);
      URL.createObjectURL = vi.fn().mockReturnValue(fakeImageDataUrl);
    });

    beforeEach(() => {
      container = render(
        <ProfileSetupProfilePicture />,
      );
    });

    afterEach(cleanup);

    it('show after select file', async () => {
      await user.upload(container.getByTestId('file_input'), [testProfileImageFile]);
      expect(await container.findByTestId('cropper-container')).toBeInTheDocument();
    });

    it('hide after confirm crop', async () => {
      await user.upload(container.getByTestId('file_input'), [testProfileImageFile]);
      const cropperElRemoval = waitForElementToBeRemoved(container.queryByTestId('cropper-container'));
      await user.click(container.getByRole('button', { name: /confirm/i }));
      return cropperElRemoval;
    });

    it('hide if user press cancel', async () => {
      await user.upload(container.getByTestId('file_input'), [testProfileImageFile]);

      const cropperElRemoval = waitForElementToBeRemoved(container.queryByTestId('cropper-container'));
      await user.click(container.getByRole('button', { name: /cancel/i }));
      return cropperElRemoval;
    });
  });

  describe('Image upload interaction', () => {
    let apiCall;
    let user;
    let container;

    beforeAll(async () => {
      nextStepFn.mockClear();

      user = userEvent.setup();

      container = render(
        <ProfileSetupProfilePicture />,
      );

      vi.spyOn(exifRotate, 'getBase64Strings').mockReturnValue([fakeImageDataUrl]);
      vi.spyOn(imageUtils, 'cropImage').mockResolvedValue(testProfileImageBlob);
      URL.createObjectURL = vi.fn().mockReturnValue(fakeImageDataUrl);
      apiCall = vi.spyOn(Profile, 'setProfilePicture');
    });

    afterAll(() => {
      cleanup();
    });

    it('should update preview when crop is completed', async () => {
      await user.upload(container.getByTestId('file_input'), [testProfileImageFile]);
      await user.click(container.getByRole('button', { name: /confirm/i }));

      const preview = await container.findByAltText('Preview of profile picture', { timeout: 4000 });
      expect(preview).toBeInTheDocument();
    });

    it('should make api call when submitted', async () => {
      await user.click(container.getByRole('button', { name: /continue/i }));
      expect(apiCall).toHaveBeenCalled();
    });

    it('should return success', async () => {
      await vi.waitUntil(
        () => apiCall.mock.results[0],
      );
      await expect(apiCall.mock.results[0].value).resolves.toBeDefined();
    });

    it('should trigger a signal to proceed to the next step', () => {
      expect(nextStepFn).toBeCalled();
    });
  });
});
