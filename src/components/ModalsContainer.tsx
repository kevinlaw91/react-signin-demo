import { AnimatePresence } from 'framer-motion';
import { usePopupModalManager } from '@/hooks/usePopupModalManager.ts';

import { getModalComponent } from '@/controllers/Modal.ts';

export const ModalsContainer = () => {
  const popupManager = usePopupModalManager();
  const activeModal = popupManager.modals.at(0);
  if (!activeModal) return null;

  const ModalComponent = getModalComponent(activeModal.type);
  const { id, props: modalProps } = activeModal;

  return (
    <AnimatePresence>
      {ModalComponent ? <ModalComponent key={id} modalId={id} modalProps={modalProps} /> : null}
    </AnimatePresence>
  );
};
