import { motion } from 'framer-motion';
import styles from './BusyScreen.module.css';
import { twMerge } from 'tailwind-merge';

export default function BusyScreen({ message, messageClassName, progressValueColor, progressBarColor }: {
  message?: string;
  messageClassName?: string;
  // Progressbar fill color
  progressValueColor?: string;
  // Progressbar background color
  progressBarColor?: string;
}) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center"
    >
      <section className="flex flex-col w-1/2 gap-3 justify-center items-center">
        {message && (
          <h1 className={twMerge('text-md text-current font-semibold', messageClassName)}>{message}</h1>
        )}
        <div
          role="progressbar"
          className={`${styles.progressbar} h-[4px] w-[400px] max-w-[20svw]`}
          style={{
            '--progress-value-fill': progressValueColor,
            '--progress-bar-fill': progressBarColor,
          }}
        />
      </section>
    </motion.div>
  );
}
