import { AnimatePresence } from 'framer-motion';
import { usePopupModalManager } from '@/hooks/usePopupModalManager.ts';

import { getModalComponent } from '@/controllers/Modal.ts';
import { createPortal } from 'react-dom';

export const ModalsContainer = () => {
  const popupManager = usePopupModalManager();
  const activeModal = popupManager.modals.at(-1);
  if (!activeModal) return null;

  const ModalComponent = getModalComponent(activeModal.type);
  if (!ModalComponent) return null;

  const { id, props: modalProps } = activeModal;
  if (activeModal.type === 'placeholder') return null;

  return ModalComponent
    ? createPortal(
      <AnimatePresence>
        <ModalComponent key={id} modalId={id} modalProps={modalProps} />
      </AnimatePresence>,
      document.body,
    )
    : null;
};
