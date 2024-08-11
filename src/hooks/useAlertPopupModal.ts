import { useCallback } from 'react';
import { usePopupModalManager } from '@/hooks/usePopupModalManager.ts';

export const useAlertPopupModal = () => {
  const { queueModal } = usePopupModalManager();
  const queueAlertModal = useCallback((msg: string) => {
    queueModal({
      type: 'alert',
      props: {
        message: msg,
      },
    });
  }, [queueModal]);

  return { queueAlertModal };
};
