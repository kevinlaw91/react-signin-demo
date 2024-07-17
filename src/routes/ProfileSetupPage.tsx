import { useEffect, useState } from 'react';
import { ProfileSetupStep, WizardContext } from '@/contexts/ProfileSetupWizardContext.ts';
import ProfileSetupUsername from '@/routes/ProfileSetupUsername.tsx';
import ProfileSetupProfilePicture from '@/routes/ProfileSetupProfilePicture.tsx';

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState<ProfileSetupStep | null>(null);

  useEffect(() => {
    // Request user to set username
    setCurrentStep(ProfileSetupStep.STEP_PROFILE_PICTURE);
  }, []);

  return (
    <WizardContext.Provider value={{ currentStep, setCurrentStep }}>
      <section className="min-h-svh min-w-svw bg-neutral-100 bg-[url('/assets/images/bg-gradient-subtle-light.jpg')] bg-cover bg-no-repeat">
        <div className="flex justify-center items-center min-h-svh mx-auto px-4 py-12 max-w-md md:max-w-sm md:px-0 md:w-96 sm:px-4">
          {
            currentStep === ProfileSetupStep.STEP_USERNAME
            && <ProfileSetupUsername />
          }
          {
            currentStep === ProfileSetupStep.STEP_PROFILE_PICTURE
            && <ProfileSetupProfilePicture />
          }
        </div>
      </section>
    </WizardContext.Provider>
  );
}
