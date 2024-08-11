import { createContext, ReactNode, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from '@/interfaces/PopupModalManager';

export interface IPopupModalManager {
  modals: Modal[];
  queueModal: (modal: Omit<Modal, 'id'> & { id?: Modal['id'] }) => void;
  hideModal: (id: string) => void;
  clearModals: () => void;
}

const PopupModalManagerContext = createContext<IPopupModalManager | null>(null);

const PopupManagerProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<Modal[]>([]);

  /**
   * Queue modal to be shown after the current active modal dismissed.
   * `modal`'s definition `id` field is optional.
   * A UUID will be generated automatically if not provided.
   * @param modal Modal definition
   * @example
   * // This will show an alert modal popup
   *
   * queueModal({
   *   // If no 'id', will be generated automatically
   *   type: 'alert',
   *   props: {
   *     message: 'An error occurred.',
   *   },
   * });
   */
  const queueModal = (modal: Omit<Modal, 'id'> & { id?: Modal['id'] }) => {
    // Generate modal id if not provided
    const newModal = { ...modal, id: modal.id ?? uuidv4() };

    if (newModal.type === 'placeholder') {
      // Placeholder has the lowest priority in stack.
      // Modals are created manually via createPortal,
      // controller doesn't actually need to render anything
      setModals(modals => modals.toSpliced(0, 0, newModal));
    } else {
      // Push modal entry into second position
      setModals(modals => modals.toSpliced(-2, 0, newModal));
    }
  };

  const hideModal = (id: string) => {
    setModals(modals.filter(modal => modal.id !== id));
  };

  const clearModals = () => setModals([]);

  return (
    <PopupModalManagerContext.Provider
      value={{
        modals: modals,
        queueModal,
        hideModal,
        clearModals,
      }}
    >
      {children}
    </PopupModalManagerContext.Provider>
  );
};

export { PopupModalManagerContext, PopupManagerProvider };
