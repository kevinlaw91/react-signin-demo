import { createContext } from 'react';
import { IWizardController } from '@/interfaces/WizardController.ts';

export enum ProfileSetupStep {
  STEP_USERNAME = 'STEP_USERNAME',
  STEP_PROFILE_PICTURE = 'STEP_PROFILE_PICTURE',
  STEP_COMPLETE = 'STEP_COMPLETE',
}

export const WizardContext = createContext<IWizardController<ProfileSetupStep> | null>(null);
