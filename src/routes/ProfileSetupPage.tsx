import ProfileSetupUsername from '@/routes/ProfileSetupUsername.tsx';
import { useState } from 'react';
import { ProfileSetupStep, WizardContext } from '@/context/ProfileSetupWizardContext.ts';

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState<ProfileSetupStep | null>(null);

  return (
    <WizardContext.Provider value={{ currentStep, setCurrentStep }}>
      <ProfileSetupUsername />
    </WizardContext.Provider>
  );
}
