import { useRef } from 'react';
import { AlertDialogRef } from '@/components/AlertDialog';

export function useDialogManager() {
  const dialogRegistry = useRef<Map<string, AlertDialogRef['show']>>(new Map());

  /**
   * Register a dialog
   * @param id Id of the dialog
   * @param dialog Ref of the dialog
   *
   * @example
   * const dialog = useDialogManager();
   *
   * <Dialog ref={ref => dialog.register('DIALOG_ID', ref)} />
   */
  const register = (id: string, dialog: AlertDialogRef | null) => {
    if (dialog) {
      dialogRegistry.current.set(id, dialog.show);
    } else {
      dialogRegistry.current.delete(id);
    }
  };

  /**
   * Show a dialog
   * @param id Id of the registered dialog
   * @param message Dialog message to be shown. If omitted, default message will be shown.
   *
   * @example
   * const dialog = useDialogManager();
   * dialog.show('DIALOG_ID', err);
   */
  const show = (id: string, message?: string) => {
    if (!dialogRegistry.current.has(id)) throw new Error(`Cannot find dialog '${id}'`);
    dialogRegistry.current?.get(id)?.(message);
  };

  return { register, show };
}
