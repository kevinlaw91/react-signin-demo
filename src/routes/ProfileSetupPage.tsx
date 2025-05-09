import { useContext, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Wizard, useWizard } from 'react-use-wizard';
import ProfileSetupUsername, { type ProfileSetupUsernameMethods } from '@/features/profile/setup/ProfileSetupUsername.tsx';
import ProfileSetupProfilePicture from '@/features/profile/setup/ProfileSetupProfilePicture.tsx';
import ProfileSetupComplete from '@/features/profile/setup/ProfileSetupComplete.tsx';
import { IndeterminateProgressBar } from '@/components/IndeterminateProgressBar.tsx';
import { SessionContext } from '@/contexts/SessionContext.tsx';
import { useNavigate } from 'react-router';

function WizardLoading() {
  const { goToStep, nextStep } = useWizard();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Username already set
      if (localStorage.getItem('demo:username')) {
        void goToStep(2);
      } else {
        void nextStep();
      }
    }, 2300);

    return () => {
      clearTimeout(timer);
    };
    // Simulate loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex justify-center items-center min-h-svh mx-auto md:w-96 max-w-md md:max-w-sm">
      <IndeterminateProgressBar className="h-[4px] w-[400px] max-w-[40svw]" />
    </section>
  );
}

export function Component() {
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);

  const stepUsernameRef = useRef<ProfileSetupUsernameMethods | null>(null);

  useEffect(() => {
    // If no session, redirect to home
    if (!user) {
      void navigate('/', { replace: true });
      return;
    }

    // Init wizard only when onmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animationVariants = {
    initial: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    hidden: { x: '-100%', opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  useEffect(() => {
    document.documentElement.style.scrollbarGutter = 'stable';
    document.body.classList.add('bg-neutral-100', 'overflow-x-hidden');

    return () => {
      document.documentElement.style.removeProperty('scrollbar-gutter');
      document.body.classList.remove('bg-neutral-100', 'overflow-x-hidden');
    };
  }, []);

  return (
    <section className="isolate min-h-dvh max-w-full">
      <title>Profile Setup</title>
      <Wizard
        wrapper={(
          <AnimatePresence
            mode="popLayout"
          />
        )}
      >
        <motion.section
          key="step-loading"
          variants={animationVariants}
          initial={false}
          animate="visible"
          exit="hidden"
        >
          <WizardLoading />
        </motion.section>
        <motion.section
          key="step-username"
          variants={animationVariants}
          initial="initial"
          animate="visible"
          exit="hidden"
          onAnimationComplete={(latest) => {
            if (latest === 'visible') {
              void stepUsernameRef.current?.onEnter();
            }
          }}
        >
          <ProfileSetupUsername
            ref={stepUsernameRef}
          />
        </motion.section>
        <motion.section
          key="step-avatar"
          variants={animationVariants}
          initial="initial"
          animate="visible"
          exit="hidden"
          className="min-h-full"
        >
          <ProfileSetupProfilePicture />
        </motion.section>
        <motion.section
          key="step-complete"
          variants={animationVariants}
          initial="initial"
          animate="visible"
          exit="hidden"
        >
          <ProfileSetupComplete />
        </motion.section>
      </Wizard>
    </section>
  );
}

Component.displayName = 'ProfileSetupPage';
