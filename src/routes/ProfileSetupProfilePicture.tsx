import { Helmet } from 'react-helmet-async';
import { useCallback, useRef, useState } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { getBase64Strings } from 'exif-rotate-js';
import { Icon } from '@iconify-icon/react';
import { Button, ButtonPrimary } from '@/components/Button.tsx';

async function cropImage(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<Blob> {
  const image: HTMLImageElement | undefined = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', event => reject(new Error(event.message)));
    img.src = imageSrc;
  });

  if (!image) throw new Error('Cannot load image');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot create canvas context');

  // calculate bounding box of the rotated image
  const rotationRad = rotation * Math.PI / 180;
  const bBoxWidth = Math.abs(Math.cos(rotationRad) * image.width) + Math.abs(Math.sin(rotationRad) * image.height);
  const bBoxHeight = Math.abs(Math.sin(rotationRad) * image.width) + Math.abs(Math.cos(rotationRad) * image.height);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotationRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');
  if (!croppedCtx) throw new Error('Cannot create cropped canvas context');

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    // Return as blob
    croppedCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob.'));
      }
    }, 'image/jpeg');
  });
}

export default function ProfileSetupProfilePicture() {
  // https://codesandbox.io/p/sandbox/busy-keldysh-y09komm059?file=%2Fsrc%2Findex.js%3A7%2C54-8%2C57
  const [isCropEditorVisible, setIsCropEditorVisible] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Avatar cropper
  const [imageSrc, setImageSrc] = useState<string>();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const croppedAreaPixels = useRef<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const avatarURL = useRef<string>();

  const triggerChooseFile = () => fileInputRef?.current?.click?.();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: Blob[] = Array.from(e.target.files);
      const data = await getBase64Strings(files);

      setImageSrc(data?.[0]);
      setIsCropEditorVisible(true);
    }
  };

  const onCropComplete = (_newCroppedArea: Area, newCroppedAreaPixels: Area) => {
    croppedAreaPixels.current = newCroppedAreaPixels;
  };

  const generateCroppedImage = async () => {
    if (!imageSrc) throw new Error('No image to crop');
    if (!croppedAreaPixels.current) throw new Error('No crop data passed');

    const croppedImageBlob = await cropImage(imageSrc, croppedAreaPixels.current, rotation);
    setCroppedImage(croppedImageBlob);
    if (avatarURL.current) URL.revokeObjectURL(avatarURL.current);
    avatarURL.current = URL.createObjectURL(croppedImageBlob);
    setIsCropEditorVisible(false);
  };

  const handleCropCancel = () => {
    setImageSrc(undefined);
    setIsCropEditorVisible(false);
  };

  const handleAvatarSave = useCallback(() => {
    if (croppedImage) {
      // TODO: Show loader
      // TODO: Upload cropped image to server
      // TODO: Proceed to next step if success
    }
  }, [croppedImage]);

  return (
    <>
      <Helmet>
        <title>Profile Picture</title>
      </Helmet>
      {
        isCropEditorVisible && (
          <section className="flex flex-col gap-8 items-center justify-center w-full h-svh overflow-hidden">
            <div className="relative h-full max-h-[512px] w-full overflow-visible">
              <Cropper
                image={imageSrc}
                crop={crop}
                rotation={rotation}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{
                  containerStyle: {
                    overflow: 'visible',
                  },
                }}
              />
            </div>
            <div className="flex flex-col gap-2 min-w-[30svw] bottom-0 z-10 justify-items-stretch content-center">
              <ButtonPrimary
                onClick={generateCroppedImage}
              >
                Confirm
              </ButtonPrimary>
              <Button
                className="bg-neutral-100"
                onClick={handleCropCancel}
              >
                Cancel
              </Button>
            </div>
          </section>
        )
      }
      {
        !isCropEditorVisible
        && (
          <section className="flex justify-center items-center min-h-svh mx-auto px-4 py-12 max-w-md md:max-w-sm md:px-0 md:w-96 sm:px-4">
            <section className="flex flex-col items-center justify-center w-full">
              <div className="relative w-full max-w-[224px] aspect-square" onClick={triggerChooseFile}>
                <div className="bg-gradient-to-br from-neutral-400/50 to-neutral-400 rounded-full w-full aspect-square overflow-hidden flex items-center justify-center">
                  {
                    avatarURL.current
                      ? (
                          <img
                            src={avatarURL.current}
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
              </div>
              <h1 className="my-6 font-semibold text-lg text-neutral-700 text-center">Set Profile Picture</h1>
              <div className="w-1/2">
                <ButtonPrimary
                  leftIcon="uil:image-upload"
                  className="w-full"
                  onClick={triggerChooseFile}
                >
                  { !avatarURL.current ? 'Choose File' : 'Change' }
                </ButtonPrimary>
                {
                  avatarURL && (
                    <ButtonPrimary
                      className="w-full"
                      onClick={handleAvatarSave}
                    >
                      Continue
                    </ButtonPrimary>
                  )
                }
                <Button
                  className="w-full outline-neutral-400"
                >
                  Skip
                </Button>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".jpg, .jpeg, image/png, image/webp, image/avif"
                  onChange={handleFileChange}
                />
              </div>
            </section>
          </section>
        )
      }
    </>
  );
}
