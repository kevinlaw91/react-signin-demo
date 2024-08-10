import { useContext } from 'react';
import { IPopupModalManager, PopupModalManagerContext } from '@/contexts/PopupModalManagerContext.tsx';

export const usePopupModalManager = (): IPopupModalManager => {
  const context = useContext(PopupModalManagerContext);
  if (!context) {
    throw new Error('usePopupManager must be used within a PopupManagerProvider');
  }
  return context;
};
