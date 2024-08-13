import { ModalType } from '@/controllers/Modal.ts';

export interface Modal {
  id: string;
  type: ModalType;
  props?: { [key: string]: unknown };
}

export interface ModalComponentProps<Props> {
  modalId: Modal['id'];
  modalProps?: Props;
}
