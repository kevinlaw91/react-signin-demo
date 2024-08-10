import ModalAlert from '@/components/ModalAlert.tsx';

const modalComponentRegistry = {
  alert: ModalAlert,
};

export type ModalType = keyof typeof modalComponentRegistry;

export function getModalComponent(type: ModalType) {
  return modalComponentRegistry[type];
}
