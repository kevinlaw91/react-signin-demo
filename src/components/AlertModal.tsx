import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify-icon/react';

interface IAlertModal {
  icon?: ReactNode;
  message?: string;
  dismiss?: () => void;
}

const defaultIcon = (
  <Icon
    icon="ion:warning"
    width="36"
    className="text-[#ff4545]"
  />
);

export default function AlertModal({ icon, message, dismiss }: IAlertModal) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 25 }}
      transition={{ duration: 0.1 }}
      className="fixed inset-0 flex justify-center items-center"
    >
      <section
        id="alert-modal"
        role="alertdialog"
        aria-labelledby="alert-modal-title"
        className="bg-white/80 shadow-lg flex flex-col gap-3 justify-center items-center rounded-3xl p-6"
        style={{ backdropFilter: 'saturate(200%) blur(30px)', minWidth: 'min(400px, 100%)' }}
      >
        {icon || defaultIcon}
        {message && (
          <h2 className="text-md text-neutral-700 font-semibold text-center" id="alert-modal-title">
            {
              message
                .split('\n')
                .map(
                  (i, key) => <div key={key}>{i}</div>,
                )
            }
          </h2>
        )}
        <div>
          <button onClick={dismiss} className="bg-neutral-300 hover:bg-neutral-400/50 text-neutral-700 text-sm font-semibold px-4 py-2 mt-4 rounded-lg">
            Close
          </button>
        </div>
      </section>
    </motion.div>
  );
}
