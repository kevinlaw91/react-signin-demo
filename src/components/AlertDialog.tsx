import { forwardRef, ReactNode, useImperativeHandle, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Icon } from '@iconify-icon/react';

interface AlertDialogProps {
  icon?: ReactNode;
  defaultMessage?: string;
}

export interface AlertDialogRef {
  show: (message?: string) => void;
}

const defaultIcon = (
  <Icon
    icon="ion:warning"
    width="36"
    className="text-[#ff4545]"
  />
);

const AlertDialog = forwardRef<AlertDialogRef, AlertDialogProps>(({ icon, defaultMessage }: AlertDialogProps, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  useImperativeHandle(ref, () => ({
    show: (message?: string) => {
      if (message) setMessage(message);
      setIsOpen(true);
    },
  }));

  const multilineMessage = useMemo(() => {
    if (!message) return null;
    return message
      .split('\\n')
      .map(
        (str, key) => {
          return <p key={key}>{str ? str : <>&nbsp;</>}</p>;
        },
      );
  }, [message]);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ backdropFilter: 'blur(0px)', opacity: 0 }}
                animate={{ backdropFilter: 'blur(10px)', opacity: 1 }}
                exit={{ backdropFilter: 'blur(0px)', opacity: 0, transition: { delay: 0.15 } }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/60"
              />
            </Dialog.Overlay>
            <Dialog.Content
              className="fixed inset-0 bottom-auto min-h-full flex justify-center items-center"
              style={{ pointerEvents: 'none' }}
            >
              <motion.div
                className="bg-white/80 shadow-lg flex flex-col gap-3 justify-center items-center rounded-3xl px-10 py-6 pointer-events-auto"
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
                exit={{ opacity: 0, y: 25 }}
                transition={{ duration: 0.1 }}
                style={{ minWidth: 'min(400px, 100%)' }}
              >
                {icon ?? defaultIcon}
                <Dialog.Title className="hidden">
                  Error
                </Dialog.Title>
                <Dialog.Description asChild>
                  <div className="text-md text-neutral-700 font-medium text-center">
                    {multilineMessage}
                  </div>
                </Dialog.Description>
                <div className="mt-4">
                  <Dialog.Close className="bg-neutral-400/40 hover:bg-neutral-400/60 text-neutral-700 text-sm font-semibold px-4 py-2 outline-hidden focus:ring-2 ring-neutral-500/70 rounded-lg">
                    Close
                  </Dialog.Close>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
});

AlertDialog.displayName = 'Alert';

export default AlertDialog;
