import { ButtonPrimary } from '@/components/Button.tsx';
import { useLinkClickHandler } from 'react-router-dom';

export default function ProfileSetupComplete() {
  const handleClick = useLinkClickHandler('/');

  return (
    <section>
      <div className="flex h-full min-h-svh flex-col items-center justify-center py-12 gap-12">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Complete</h1>
          <p>You profile is now set up.</p>
        </div>
        <div>
          <ButtonPrimary onClick={handleClick}>Go to Home</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
