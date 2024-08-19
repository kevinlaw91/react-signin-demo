import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { IndeterminateProgressBar } from '@/components/IndeterminateProgressBar.tsx';

interface IBusyScreenProps {
  message?: string;
  messageClassName?: string;
}

export default function BusyScreen({ message, messageClassName }: IBusyScreenProps) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center"
    >
      <section className="flex flex-col w-1/2 gap-3 justify-center items-center">
        {message && (
          <h1 className={twMerge('text-md text-current font-semibold', messageClassName)}>{message}</h1>
        )}
        <IndeterminateProgressBar className="h-[4px] w-[400px] max-w-[20svw]" />
      </section>
    </motion.div>
  );
}
