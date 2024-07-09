import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IMaskInput } from 'react-imask';
import clsx from 'clsx';
import { z } from 'zod';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Spinner from '@/components/Spinner.tsx';
import AlertModal from '@/components/AlertModal.tsx';

const userNameSchema = z.object({
  username: z.string()
    .min(1, { message: 'Please enter a username' })
    .min(6, { message: 'Username needs to be at least 6 characters long' })
    .max(32, { message: 'Username cannot be longer than 32 characters' })
    .regex(/^[a-z0-9_]*$/, { message: 'Username can only contain letters (a-z), numbers (0-9), and underscores (_)' }),
});

type UserNameFormData = z.infer<typeof userNameSchema>;

const MSG_USERNAME_AVAILABLE = 'Username is available';
const MSG_USERNAME_TAKEN = 'Username is taken';

const animatedTick = (
  <svg viewBox="0 0 24 24" className="text-lime-600 size-6">
    { /* ci:check */}
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      strokeDasharray="0 1"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth="3"
      d="m6 12l4.243 4.243l8.484-8.486"
    />
  </svg>
);

const animatedError = (
  <svg viewBox="0 0 24 24" className="text-red-600 size-5">
    {/* ci:close-md */}
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{
        duration: 0.15,
        ease: 'easeInOut',
      }}
      strokeDasharray="0 1"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth="3"
      d="M6 6l12 12"
    />
    <motion.path
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        pathLength: {
          delay: 0.15,
          duration: 0.3,
          ease: 'easeInOut',
        },
        opacity: {
          delay: 0.15,
          duration: 0.01,
        },
      }}
      strokeDasharray="0 1"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      strokeWidth="3"
      d="M18 6L6 18"
    />
  </svg>
);

export default function ProfileSetupPage() {
  const {
    register,
    setValue,
    getValues,
    setFocus,
    watch,
    handleSubmit,
  } = useForm<UserNameFormData>({
    resolver: zodResolver(userNameSchema),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const pendingCheck = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submitHandler: SubmitHandler<UserNameFormData> = useCallback((data: UserNameFormData) => {
    // Check if username is available
    if (isAvailable) {
      // Register the username
      void data.username;
      return;
    }

    // Hasn't confirmed availability yet, so we do that now
    // Clear any pending check
    if (pendingCheck.current) {
      clearTimeout(pendingCheck.current);
      pendingCheck.current = null;
    }

    const username = getValues('username').trim();
    // Hide errors and display loading spinner
    setIsAvailable(null);
    setIsValidating(true);

    pendingCheck.current = setTimeout(() => {
      // Hide spinner
      setIsValidating(false);

      // Mock availability check using username str length
      const _isAvailable = username.length % 2 === 0;
      setIsAvailable(_isAvailable);

      // Reselect input field if username is not available
      if (!_isAvailable) {
        setFocus('username');
      }
    }, 300);
  }, [getValues, isAvailable, setFocus]);

  const validationFailedHandler: SubmitErrorHandler<UserNameFormData> = useCallback((errors) => {
    // Show error dialog if field is blank
    if (errors.username) {
      setAlertModalMessage(errors?.username?.message || '');
      setIsModalOpen(true);
      setIsAlertModalOpen(true);
    }
  }, []);

  const {
    ref: setUserNameInputRef, // Needed by setFocus()
    onChange: _, // Not used by IMaskInput
    ...otherFieldProps
  } = register('username');

  const handleAlertModalDismiss = () => {
    setIsModalOpen(false);
    setIsAlertModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Create Profile</title>
      </Helmet>
      <section className="w-full mx-auto px-4 py-12 max-w-md md:max-w-sm md:px-0 md:w-96 sm:px-4">
        <form onSubmit={handleSubmit(submitHandler, validationFailedHandler)}>
          <div className="py-6">
            <img
              src="/assets/svg/logo.svg"
              alt="Logo"
              className="w-24 h-24 mx-auto"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-center my-4 text-neutral-700">Let&apos;s pick your username</h1>
          <div className="text-neutral-400 text-xs text-center my-2" role="note">
            You can use letters (a-z), numbers (0-9), and underscores (_)
          </div>
          <div className="mt-6">
            <IMaskInput
              inputRef={setUserNameInputRef}
              mask={/^[a-zA-Z0-9_]*$/}
              className="block w-full h-12 px-4 py-2 text-neutral-800 text-center rounded-3xl appearance-none bg-neutral-200 placeholder-neutral-50 focus:border-neutral-300 outline-none sm:text-sm transition duration-150"
              maxLength={32}
              prepareChar={str => str.trim().toLowerCase()}
              onAccept={(value) => {
                setIsAvailable(null);
                setValue('username', value);
              }}
              defaultValue=""
              autoFocus
              placeholder="Try different length to pass"
              value={watch('username')}
              {...otherFieldProps}
            />
          </div>
          {
            isValidating && (
              <div className="flex gap-2 my-2 items-center">
                <div className="flex justify-center ">
                  <Spinner className="text-lime-600 size-6" />
                </div>
                <div className="text-neutral-500 text-xs">
                  Checking availability...
                </div>
              </div>
            )
          }
          {
            isAvailable !== null && (
              <div className="flex gap-2 my-2 items-center">
                <div className="flex justify-center ">
                  {isAvailable ? animatedTick : animatedError }
                </div>
                <div className={clsx('text-xs font-medium', isAvailable ? 'text-lime-600' : 'text-red-500')}>
                  {isAvailable ? MSG_USERNAME_AVAILABLE : MSG_USERNAME_TAKEN}
                </div>
              </div>
            )
          }
          <div className="pt-3">
            {
              (isAvailable === null || !isAvailable) && (

                <button
                  type="submit"
                  className="w-full h-12 px-5 py-3 font-medium text-neutral-50 bg-primary-600 hover:bg-primary-500 outline-none rounded-xl focus:ring-2 ring-offset-2 ring-primary-300 transition duration-150"
                >
                  Check Availability
                </button>
              )
            }
            <AnimatePresence>
              {
                isAvailable && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button
                      type="submit"
                      className="w-full h-12 px-5 py-3 font-medium text-white bg-primary hover:bg-primary-500 outline-none rounded-xl focus:ring-2 ring-offset-2 ring-primary-300 transition duration-150"
                    >
                      Confirm
                    </button>
                  </motion.div>
                )
              }
            </AnimatePresence>
          </div>
        </form>
      </section>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ backdropFilter: 'blur(0px)', opacity: 0 }}
            animate={{ backdropFilter: 'blur(10px)', opacity: 1 }}
            exit={{ backdropFilter: 'blur(0px)', opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAlertModalOpen && (
          <AlertModal
            message={alertModalMessage}
            dismiss={handleAlertModalDismiss}
          />
        )}
      </AnimatePresence>
    </>
  );
}
