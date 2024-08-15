import { ButtonPrimary } from '@/components/Button.tsx';
import { useLinkClickHandler } from 'react-router-dom';

export default function ProfileSetupComplete() {
  const handleClick = useLinkClickHandler('/');

  return (
    <section>
      <div className="flex h-full min-h-svh flex-col items-center justify-center py-12 gap-12">
        <div className="flex flex-col items-center justify-center text-center">
          <img src="/assets/svg/success-circle-large.svg" className="size-3/5 mb-3.5" alt="" />
          <h1 className="text-2xl font-bold text-primary-500">Complete</h1>
          <p className="text-neutral-600 my-3">Your profile is now set up</p>
        </div>
        <div>
          <ButtonPrimary onClick={handleClick}>Go to Home</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
