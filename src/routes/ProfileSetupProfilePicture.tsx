import { Helmet } from 'react-helmet-async';
import { twMerge } from 'tailwind-merge';
import fetchMock from 'fetch-mock';
import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Icon } from '@iconify-icon/react';
import { Button, ButtonOutline, ButtonPrimary } from '@/components/Button.tsx';
import { cropImage, CropParams, fixImageOrientation } from '@/utils/image.ts';
import BusyScreen from '@/components/BusyScreen.tsx';
import { setProfilePicture } from '@/services/profile.ts';
import { ProfileSetupStep, WizardContext } from '@/contexts/ProfileSetupWizardContext.ts';

function useObjectURL(): [string | undefined, (blob?: Blob) => void] {
  const [url, setUrl] = useState<string>();

  const createUrl = (blob?: Blob) => {
    if (url) URL.revokeObjectURL(url);
    setUrl(blob ? URL.createObjectURL(blob) : undefined);
  };

  return [url, createUrl];
}

function AvatarCropper(props: {
  image: string | undefined;
  onChange: (param: CropParams) => void;
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const onCropComplete = (_newCroppedArea: Area, newCroppedAreaPixels: Area) => {
    props.onChange({
      ...newCroppedAreaPixels,
      rotation,
    });
  };

  return (
    <Cropper
      image={props.image}
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
  );
}

function ProfilePictureEditor({ src, onApply, onCancel }: {
  // Image source url
  src?: string;
  onApply?: (blob: Blob) => void;
  onCancel?: () => void;
}) {
  const avatarCropParam = useRef<CropParams>();

  const handleChange = (params: CropParams) => {
    avatarCropParam.current = params;
  };

  const handleConfirm = async () => {
    if (!src) throw new Error('No crop image source');

    if (onApply) {
      const imageBlob = await cropImage(src, avatarCropParam.current);
      if (!imageBlob) throw new Error('No crop result returned');

      onApply(imageBlob);
    }
  };

  return (
    <section className="flex flex-col gap-8 items-center justify-center w-full h-svh overflow-hidden">
      <div className="relative h-full max-h-[512px] w-full overflow-visible" data-testid="cropper-container">
        <AvatarCropper
          image={src}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2 min-w-[30svw] bottom-0 z-10 justify-items-stretch content-center">
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
      <div className={twMerge('rounded-full w-full aspect-square overflow-hidden flex items-center justify-center border-4 border-white', src ? 'bg-transparent' : 'bg-gradient-to-br from-neutral-400/50 to-neutral-400')}>
        {
          src
            ? (
                <img
                  src={src}
                  alt="Preview of profile picture"
                  className="w-full h-full object-cover"
                />
              )
            : (
                <Icon icon="teenyicons:user-solid" className="flex items-center justify-center w-3/4 text-white/20 aspect-square" width="unset" />
              )
        }
      </div>
      <div className="absolute bottom-0 right-0 w-1/4 box-border p-3 aspect-square bg-primary border-2 border-white rounded-full flex items-center justify-center">
        <Icon icon="ph:camera" className="w-full text-white" width="unset" />
      </div>
    </section>
  );
}

export function ProfileSetupProfilePictureForm(props: {
  previewSrc?: Blob;
  onFileSelect?: (e: File) => void;
  onSubmit?: (promise: ReturnType<typeof setProfilePicture>) => void;
}) {
  const { onSubmit, previewSrc } = props;
  const [previewUrl, generatePreviewUrl] = useObjectURL();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerChooseFile = () => fileInputRef?.current?.click?.();

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      props.onFileSelect?.(e.target.files[0]);
    }
  };

  const handleSubmit = useCallback(() => {
    // Mock request response
    fetchMock.post(
      {
        url: `express:/api/profile/:profileId/picture`,
      },
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

    if (previewSrc) {
      onSubmit?.(
        setProfilePicture({
          profileId: '1234',
          image: previewSrc,
        }),
      );
    }
  }, [onSubmit, previewSrc]);

  useEffect(() => {
    generatePreviewUrl(props.previewSrc);
  }, [generatePreviewUrl, props.previewSrc]);

  return (
    <>
      <ProfilePicturePreview
        src={previewUrl}
        className="relative w-full max-w-[224px]"
        onClick={triggerChooseFile}
      />
      <h1 className="my-6 font-semibold text-lg text-neutral-700 text-center">Set Profile Picture</h1>
      <div className="flex flex-col gap-1 w-1/2">
        <ButtonOutline
          leftIcon="uil:image-upload"
          className="w-full text-primary"
          onClick={triggerChooseFile}
        >
          {!props.previewSrc ? 'Choose File' : 'Change Picture'}
        </ButtonOutline>
        {
          props.previewSrc && (
            <ButtonPrimary
              leftIcon="mdi:arrow-right"
              className="w-full"
              onClick={handleSubmit}
            >
              Continue
            </ButtonPrimary>
          )
        }
        <Button
          className="w-full"
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
  const [isLoading, setIsLoading] = useState(false);
  const [imageFileSrc, setImageFileSrc] = useState<string>();
  const [isCropEditorVisible, setIsCropEditorVisible] = useState<boolean>(false);
  const [croppedImage, setCroppedImage] = useState<Blob>();

  const wizardController = useContext(WizardContext);

  /**
   * Show cropper if `url` is a `string`. Hide cropper when `url` is `undefined`
   * @param {string} [url]
   */
  const showCropper = (url?: string) => {
    setImageFileSrc(url);
    setIsCropEditorVisible(!!url);
  };

  const hideCropper = () => showCropper(undefined);

  const handleFileSelect = (file: File) => {
    setIsLoading(true);
    void fixImageOrientation(file)
      .then((url) => {
        if (url) showCropper(url);
        return;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCropConfirm = (blob: Blob) => {
    setCroppedImage(blob);
    // Hide cropper
    hideCropper();
    return;
  };

  const handleSubmitResponse = (apiCall: ReturnType<typeof setProfilePicture>) => {
    setIsLoading(true);
    apiCall
      .then((res) => {
        if (res.success) {
          // Profile picture src is in res.data.src
          // Proceed to next step if success
          wizardController?.setCurrentStep?.(ProfileSetupStep.STEP_COMPLETE);
        }
        return;
      })
      .catch((err: Error) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>Profile Picture</title>
      </Helmet>
      {
        isLoading && (
          <section className="flex items-center justify-center w-full h-svh">
            <BusyScreen />
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
          <section className="flex justify-center items-center min-h-svh mx-auto px-4 py-12 max-w-md md:max-w-sm md:px-0 md:w-96 sm:px-4">
            <section className="flex flex-col items-center justify-center w-full">
              <ProfileSetupProfilePictureForm
                previewSrc={croppedImage}
                onFileSelect={handleFileSelect}
                onSubmit={handleSubmitResponse}
              />
            </section>
          </section>
        )
      }
    </>
  );
}
