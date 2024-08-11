import ModalAlert from '@/components/ModalAlert.tsx';

const modalComponentRegistry = {
  // Alert modal
  alert: ModalAlert,
  // Placeholder modal, send to lowest priority
  placeholder: null,
};

export type ModalType = keyof typeof modalComponentRegistry;

export function getModalComponent(type: ModalType) {
  return modalComponentRegistry[type];
}
