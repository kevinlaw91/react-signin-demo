import { motion } from 'framer-motion';

interface IAlertModal {
  icon?: React.ReactNode;
  message?: string;
  dismiss?: () => void;
}

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
        className="bg-white/20 shadow-lg min-w-[400px] flex flex-col gap-3 justify-center items-center rounded-3xl p-6"
        style={{ backdropFilter: 'saturate(200%) blur(30px)' }}
      >
        {icon}
        {message && (
          <h2 className="text-md text-white/90 font-medium text-center" id="alert-modal-title">
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
          <button onClick={dismiss} className="bg-white/20 hover:bg-primary-300/80 text-white text-sm px-4 py-2 mt-4 rounded-lg">
            Close
          </button>
        </div>
      </section>
    </motion.div>
  );
}
