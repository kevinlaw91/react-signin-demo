import React from 'react';

export interface IWizardController<S> {
  currentStep: string | null;
  setCurrentStep: React.Dispatch<React.SetStateAction<S | null>>;
}
