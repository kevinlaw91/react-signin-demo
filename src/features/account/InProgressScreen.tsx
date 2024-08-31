import * as Portal from '@radix-ui/react-portal';
import { AnimatePresence, motion } from 'framer-motion';
import { IndeterminateProgressBar } from '@/components/IndeterminateProgressBar.tsx';

export function InProgressScreen({ isOpen, title }: { isOpen: boolean; title?: string }) {
  return (
    <Portal.Root asChild>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ backdropFilter: 'blur(0px)', opacity: 0 }}
              animate={{ backdropFilter: 'blur(10px)', opacity: 1 }}
              exit={{ backdropFilter: 'blur(0px)', opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60"
            />
            <motion.div
              key="contents"
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex justify-center items-center text-white/90"
            >
              <section className="flex flex-col w-1/2 gap-3 justify-center items-center">
                {title && <h1 className="text-md text-current font-semibold">{title}</h1>}
                <IndeterminateProgressBar className="h-[4px] w-[400px] max-w-[20svw]" />
              </section>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal.Root>
  );
}
