import { motion } from 'framer-motion';
import styles from './BusyScreen.module.css';

export default function BusyScreen({ message }: { message?: string }) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex justify-center items-center"
    >
      <section className="flex flex-col w-1/2 gap-3 justify-center items-center">
        {message && (
          <h2 className="text-md text-white/90 font-medium">{message}</h2>
        )}
        <div className={`${styles.progressbar} h-[4px] w-[400px] max-w-[20svw]`} />
      </section>
    </motion.div>
  );
}
