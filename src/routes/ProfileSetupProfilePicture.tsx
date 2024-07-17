import { Helmet } from 'react-helmet-async';
import { Icon } from '@iconify-icon/react';
import { ButtonPrimary } from '@/components/Button.tsx';

export default function ProfileSetupProfilePicture() {
  return (
    <>
      <Helmet>
        <title>Profile Picture</title>
      </Helmet>
      <section className="flex flex-col items-center justify-center w-full">
        <div className="relative w-full max-w-[224px] aspect-square">
          <div className="bg-gradient-to-br from-neutral-400/50 to-neutral-400 rounded-full w-full aspect-square overflow-hidden flex items-center justify-center">
            <Icon icon="teenyicons:user-solid" className=" flex items-center justify-center w-3/4 text-white/20 aspect-square" width="unset" />
          </div>
          <div className="absolute bottom-0 right-0 w-1/4 box-border p-3 aspect-square bg-primary border-2 border-white rounded-full flex items-center justify-center">
            <Icon icon="ph:camera" className="w-full text-white" width="unset" />
          </div>
        </div>
        <h1 className="my-6 font-semibold text-lg text-neutral-700 text-center">Set Profile Picture</h1>
        <div>
          <label htmlFor="file-upload">
            <ButtonPrimary>
              Upload
            </ButtonPrimary>
            <input id="file-upload" type="file" className="hidden" accept="image/*" />
          </label>
        </div>
      </section>
    </>
  );
}
