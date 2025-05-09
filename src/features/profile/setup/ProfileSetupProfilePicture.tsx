import { twMerge } from 'tailwind-merge';
import fetchMock from 'fetch-mock';
import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Icon } from '@iconify-icon/react';
import { Button, ButtonOutline, ButtonPrimary } from '@/components/Button.tsx';
import { cropImage, CropParams, fixImageOrientation } from '@/utils/image.ts';
import { setProfilePicture } from '@/services/profile.ts';
import { Slider } from '@mui/material';
import { DropEvent, useDropzone } from 'react-dropzone';
import AlertDialog from '@/components/AlertDialog';
import { useDialogManager } from '@/hooks/useDialogManager';
import { SessionContext } from '@/contexts/SessionContext';
import { IndeterminateProgressBar } from '@/components/IndeterminateProgressBar.tsx';
import { handleDbUpgrade, INDEXEDDB_DBNAME, INDEXEDDB_VERSION } from '@/services/indexeddb.ts';
import { loadSavedAvatar } from '@/features/profile/avatar.ts';
import srcBlankProfileImage from '/assets/images/profile-picture-blank.jpg';
import { useWizard } from 'react-use-wizard';

function ProfilePictureEditor({ src, onApply, onCancel }: {
  // Image source url
  src?: string;
  onApply?: (blob: Blob) => void;
  onCancel?: () => void;
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const avatarCropParam = useRef<CropParams>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const onCropComplete = (_newCroppedArea: Area, newCroppedAreaPixels: Area) => {
    avatarCropParam.current = {
      ...newCroppedAreaPixels,
      rotation,
    };
  };

  const handleConfirm = async () => {
    if (!src) throw new Error('No crop image source');

    if (onApply) {
      const imageBlob = await cropImage(src, avatarCropParam.current);
      if (!imageBlob) throw new Error('No crop result returned');

      onApply(imageBlob);
    }
  };

  const handleSliderChange = (_evt: Event, val: number | number[]) => setZoom(val as number);

  return (
    <section className="flex flex-col gap-8 items-center justify-center w-full min-h-dvh">
      <div className="relative h-full min-h-[384px] max-h-[512px] w-full overflow-visible" data-testid="cropper-container">
        <Cropper
          image={src}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: {
              overflow: 'visible',
            },
          }}
        />
      </div>
      <div className="flex gap-6 w-full max-w-[300px] items-center isolate">
        <Icon icon="gg:zoom-in" width="24" className="text-white" />
        <Slider
          aria-label="Zoom"
          value={zoom}
          min={1}
          max={3}
          step={0.05}
          onChange={handleSliderChange}
          classes={{
            rail: 'text-white/50',
            track: 'text-white',
            thumb: 'text-white',
          }}
        />
        <Icon icon="gg:zoom-out" width="24" className="text-white" />
      </div>
      <div className="flex flex-col gap-2 w-full max-w-64 my-6 z-10 justify-items-stretch content-center">
        <ButtonPrimary
          className="outline-white outline-offset-0"
          onClick={handleConfirm}
        >
          Confirm
        </ButtonPrimary>
        <Button
          className="bg-neutral-100 outline-offset-0"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </section>
  );
}

function ProfilePicturePreview({ src, className, ...otherProps }: {
  src?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <section data-testid="avatar_preview" className={twMerge('aspect-square', className)} role="button" {...otherProps}>
      <div className="rounded-full cursor-pointer w-full aspect-square overflow-hidden flex items-center justify-center border-4 border-white">
        <img
          src={src ? src : srcBlankProfileImage}
          alt="Preview of profile picture"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute cursor-pointer bottom-0 right-0 w-1/4 box-border p-3 aspect-square bg-primary border-2 border-white rounded-full flex items-center justify-center">
        <Icon icon="ph:camera" className="w-full text-white" width="unset" />
      </div>
    </section>
  );
}

export function ProfileSetupProfilePictureForm(props: {
  previewUrl?: string;
  onFileSelect?: (e: FileList) => void;
  onSubmit?: () => void;
  onSkip?: () => void;
}) {
  const { onSubmit, previewUrl } = props;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerChooseFile = () => fileInputRef?.current?.click?.();

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      props.onFileSelect?.(e.target.files);
    }
  };

  return (
    <>
      <ProfilePicturePreview
        src={previewUrl}
        className="relative w-full max-w-[224px]"
        onClick={triggerChooseFile}
      />
      <h1 className="text-xl font-bold text-center my-4 text-neutral-600">Set Profile Picture</h1>
      <div className="flex flex-col gap-1 w-1/2">
        <ButtonOutline
          leftIcon="uil:image-upload"
          className="w-full text-primary"
          onClick={triggerChooseFile}
        >
          {!props.previewUrl ? 'Choose File' : 'Change Picture'}
        </ButtonOutline>
        {
          props.previewUrl && (
            <ButtonPrimary
              leftIcon="mdi:arrow-right"
              className="w-full"
              onClick={onSubmit}
            >
              Continue
            </ButtonPrimary>
          )
        }
        <Button
          className="w-full font-normal"
          onClick={props.onSkip}
        >
          Skip
        </Button>
        <input
          ref={fileInputRef}
          data-testid="file_input"
          type="file"
          className="hidden"
          accept=".jpg, .jpeg, image/png, image/webp, image/avif"
          onChange={handleFileInputChange}
        />
      </div>
    </>
  );
}

export default function ProfileSetupProfilePicture() {
  const { nextStep } = useWizard();

  // Avatar preview
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>();
  const croppedImage = useRef<Blob>(null);
  const updatePreview = useCallback((blob: Blob) => {
    croppedImage.current = blob;

    // Generate object url for newly cropped image
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(URL.createObjectURL(blob));
  }, [imagePreviewUrl]);

  // IndexedDB handle
  const dbRef = useRef<IDBDatabase>(null);

  const loadAvatar = useCallback((event: Event) => {
    dbRef.current = (event.target as IDBOpenDBRequest).result;

    loadSavedAvatar(event)
      .then((blob) => {
        // If avatar was saved previously, load it to preview
        if (blob) updatePreview(blob);
        return;
      })
      .catch((err) => {
        console.error(err);
      });
  }, [updatePreview]);

  useEffect(() => {
    // Check IndexedDB support
    if (!indexedDB) return;

    // Do not connect again
    if (dbRef.current) return;

    const dbHandle = indexedDB.open(INDEXEDDB_DBNAME, INDEXEDDB_VERSION);
    dbHandle.onupgradeneeded = handleDbUpgrade;
    dbHandle.onsuccess = loadAvatar;
  }, [loadAvatar]);

  useEffect(() => {
    // Disconnect IndexedDB on unmount
    return () => {
      // Access to dbRef.current was intended to close active connection
      dbRef.current?.close();
    };
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [imageFileSrc, setImageFileSrc] = useState<string>();
  const [isCropEditorVisible, setIsCropEditorVisible] = useState<boolean>(false);

  const dialog = useDialogManager();

  const { updateSessionUser } = useContext(SessionContext);

  /**
   * Show cropper if `url` is a `string`. Hide cropper when `url` is `undefined`
   * @param {string} [url]
   */
  const showCropper = (url?: string) => {
    setImageFileSrc(url);
    setIsCropEditorVisible(!!url);
  };

  const hideCropper = useCallback(() => showCropper(undefined), []);

  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const file = files[0];

    setIsLoading(true);
    void fixImageOrientation(file)
      .then((url) => {
        if (url) showCropper(url);
        return;
      })
      .catch((_err) => {
        dialog.show('EDITOR_ERROR', 'Unable to read image file');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dialog]);

  const handleFileDropAccepted = (files: FileList | File[], _dropEvt: DropEvent) => handleFileSelect(files);

  const handleCropConfirm = useCallback((blob: Blob) => {
    // Update avatar preview
    updatePreview(blob);

    // Hide cropper
    hideCropper();
  }, [hideCropper, updatePreview]);

  const goToNextStep = useCallback(() => {
    // Save into IndexedDB if available
    if (dbRef.current) {
      const transaction = dbRef.current.transaction('blobs', 'readwrite');
      const store = transaction.objectStore('blobs');
      store.put(croppedImage.current, 'avatar');
    }

    // Move to next step
    void nextStep();
  }, [nextStep]);

  const handleSubmitResponse = useCallback(() => {
    setIsLoading(true);

    // Mock request response
    fetchMock
      .mockGlobal()
      .post(
        'express:/api/profile/:profileId/picture',
        {
          status: 200,
          body: {
            success: true,
            data: {
              src: 'profilepicture.png',
            },
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
        { delay: 1000 },
      );

    if (!croppedImage.current) {
      throw new Error('No image data to submit');
    }

    setProfilePicture({
      profileId: 'demo',
      image: croppedImage.current,
    })
      .then((res) => {
        if (!res.success) {
          throw new Error('Failed to update profile picture');
        }

        // Update avatar in session
        updateSessionUser({
          // Store avatar blob in memory for demo
          // In real life implementation image is loaded from cdn
          _avatarBlob: croppedImage.current,
          // Should be res.data.src in real life
          // For demo purpose we re-use the generated data url instead
          avatarSrc: imagePreviewUrl!,
        });

        // Proceed to next step
        goToNextStep();
        return;
      })
      .catch((_err: Error) => {
        dialog.show('EDITOR_ERROR', 'Failed to update profile picture');
        setIsLoading(false);
      })
      .finally(() => {
        fetchMock.hardReset();
      });
  }, [dialog, goToNextStep, imagePreviewUrl, updateSessionUser]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': [],
      'image/webp': [],
      'image/avif': [],
    },
    noClick: true,
    noKeyboard: true,
    useFsAccessApi: false,
    maxFiles: 1,
    onDropAccepted: handleFileDropAccepted,
    onDropRejected: () => dialog.show('EDITOR_ERROR', 'Please select a valid image file'),
  });

  return (
    <>
      <title>Profile Picture</title>
      {
        isLoading && (
          <section className="flex justify-center items-center h-dvh mx-auto md:w-96 max-w-md md:max-w-sm">
            <IndeterminateProgressBar className="h-[4px] w-[400px] max-w-[40svw]" />
          </section>
        )
      }
      {
        isCropEditorVisible && !isLoading && (
          <ProfilePictureEditor
            src={imageFileSrc}
            onCancel={hideCropper}
            onApply={handleCropConfirm}
          />
        )
      }
      {
        !isCropEditorVisible && !isLoading && (
          <section className="flex justify-center items-center min-h-dvh mx-auto px-4 py-12 max-w-md md:max-w-sm md:px-0 md:w-96 sm:px-4">
            <section className="relative flex flex-col items-center justify-center w-full" {...getRootProps()}>
              {
                isDragActive
                  ? (
                      <section className={twMerge('flex flex-col justify-center items-center w-full h-full aspect-square border-2 border-dashed border-primary text-neutral-400', isDragReject && 'border-red-400 text-red-400')}>
                        <input {...getInputProps()} />
                        <div>
                          <Icon icon="radix-icons:avatar" width="36" />
                        </div>
                        {
                          !isDragReject
                            ? <p>Drop your image file here</p>
                            : <p>This file type is not supported</p>
                        }
                      </section>
                    )
                  : (
                      <ProfileSetupProfilePictureForm
                        previewUrl={imagePreviewUrl}
                        onFileSelect={handleFileSelect}
                        onSubmit={handleSubmitResponse}
                        onSkip={goToNextStep}
                      />
                    )
              }
            </section>
          </section>
        )
      }
      <AlertDialog ref={(ref) => { dialog.register('EDITOR_ERROR', ref); }} />
    </>
  );
}
