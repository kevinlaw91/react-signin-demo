import React from 'react';

export interface IWizardController<S> {
  currentStep: S | null;
  setCurrentStep: React.Dispatch<React.SetStateAction<S | null>>;
}
