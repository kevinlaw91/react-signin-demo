import { Area } from 'react-easy-crop';
import { getBase64Strings } from 'exif-rotate-js';

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', () => reject(new Error('Unable to load image file.')));
    img.src = src;
  });

/**
 * Return base64-encoded data url of image
 * @param file source file
 */
export const fixImageOrientation = async (file: File) => {
  const base64URLs = await getBase64Strings([file], { type: 'image/png' });
  return base64URLs?.[0];
};

export type CropParams = Area & { rotation?: number; flip?: { horizontal: boolean; vertical: boolean } };

export async function cropImage(
  src: string,
  params?: CropParams,
): Promise<Blob> {
  if (!src) throw new Error('No crop source');
  const image = await loadImage(src);
  if (!image) throw new Error('Cannot load image');

  if (!params) throw new Error('No crop param specified');
  const { x, y, width, height, rotation = 0, flip = { horizontal: false, vertical: false } } = params;

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
  croppedCanvas.width = width;
  croppedCanvas.height = height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    // Return as blob
    croppedCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob.'));
      }
    }, 'image/png');
  });
}
