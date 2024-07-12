import { useCallback, useRef, useState } from 'react';
import fetchMock from 'fetch-mock';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IMaskInput } from 'react-imask';
import clsx from 'clsx';
import { z } from 'zod';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AlertModal from '@/components/AlertModal.tsx';
import { ButtonPrimary, ButtonBusy } from '@/components/Button.tsx';
import { LoaderPulsingDotsCircular } from '@/components/loaders/LoaderPulsingDots.tsx';
import {
  setUsername,
  checkUsernameAvailability,
  ERR_UNEXPECTED_ERROR,
  ERR_USERNAME_TAKEN,
} from '@/services/profile.ts';

const userNameSchema = z.object({
  username: z.string()
    .min(1, { message: 'Please enter a username' })
    .min(6, { message: 'Username needs to be at least 6 characters long' })
    .max(32, { message: 'Username cannot be longer than 32 characters' })
    .regex(/^[a-z0-9_]*$/, { message: 'Username can only contain letters (a-z), numbers (0-9), and underscores (_)' }),
});

type UsernameFormData = z.infer<typeof userNameSchema>;

const MSG_USERNAME_AVAILABLE = 'Username is available';
const MSG_USERNAME_ALREADY_TAKEN = 'Username is already taken';
const MSG_USERNAME_CLAIM_FAILED = 'This username is unavailable. Try a different one.';
const MSG_UNEXPECTED_ERROR = 'An error occurred. Please try again later';

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

function mockIsAvailable(username: string) {
  return username.length % 2 === 0;
}

export default function ProfileSetupPage() {
  const {
    register,
    setValue,
    setFocus,
    watch,
    handleSubmit,
  } = useForm<UsernameFormData>({
    resolver: zodResolver(userNameSchema),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const runningCheck = useRef<AbortController | null>(null);

  const claimUsername = useCallback((profileId: string, username: string) => {
    const _isAvailable = mockIsAvailable(username);

    // Mock request response
    fetchMock.patch(`path:/api/profile/${profileId}`,
      {
        status: _isAvailable ? 200 : 409,
        body: _isAvailable
          ? {
              success: true,
              data: {
                id: profileId,
                username: username,
              },
            }
          : {
              success: false,
            },
        headers: {
          'Content-Type': 'application/json',
        },
      },
      { delay: 1000 },
    );

    // Claim the username
    setUsername({ profileId, username })
      .then((res) => {
        if (res.success) {
          alert('ok');
          return;
        }
        throw new Error(ERR_UNEXPECTED_ERROR);
      })
      .catch((err) => {
        if (err instanceof Error) {
          if (err.message === ERR_USERNAME_TAKEN) {
            setAlertModalMessage(MSG_USERNAME_CLAIM_FAILED);
          } else {
            setAlertModalMessage(MSG_UNEXPECTED_ERROR);
          }
          setIsModalOpen(true);
          setIsAlertModalOpen(true);
        }
      });

    // Restore fetch mock
    fetchMock.restore();
  }, []);

  const checkUsername = useCallback((username: string) => {
    // Discard any unfinished checks
    runningCheck.current?.abort?.();
    runningCheck.current = new AbortController();

    // Hide errors and display loading spinner
    setIsAvailable(null);
    setIsValidating(true);

    // Mock request response
    fetchMock.get(
      {
        url: `path:/api/profile`,
        query: {
          action: 'check-username',
        },
      },
      {
        status: 200,
        body: {
          data: {
            username: username,
            isAvailable: mockIsAvailable(username),
          },
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
      { delay: 1000 },
    );

    checkUsernameAvailability(username, runningCheck.current.signal)
      .then((res) => {
        const _isAvailable = res?.data?.isAvailable;
        setIsAvailable(_isAvailable);

        // Reselect input field if username is not available
        if (!_isAvailable) {
          setFocus('username');
        }

        return _isAvailable;
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request is cancelled intentionally, no error here
          return;
        }

        setAlertModalMessage(MSG_UNEXPECTED_ERROR);
        setIsModalOpen(true);
        setIsAlertModalOpen(true);
      })
      .finally(() => {
        // Hide spinner
        setIsValidating(false);
      });

    // Restore fetch mock
    fetchMock.restore();
  }, [setFocus]);

  const submitHandler: SubmitHandler<UsernameFormData> = useCallback((data: UsernameFormData) => {
    const profileId = '1234';

    // Make sure username availability check is passed before claiming it
    if (isAvailable) {
      claimUsername(profileId, data.username);
      return;
    }

    // Hasn't confirmed availability yet, so we do that now
    checkUsername(data.username);
  }, [isAvailable, checkUsername, claimUsername]);

  const validationFailedHandler: SubmitErrorHandler<UsernameFormData> = useCallback((errors) => {
    // Show error dialog if field is blank
    if (errors.username) {
      setAlertModalMessage(errors?.username?.message || '');
      setIsModalOpen(true);
      setIsAlertModalOpen(true);
    }
  }, []);

  const {
    ref: setUsernameInputRef, // Needed by setFocus()
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
      <section className="min-h-svh min-w-svw bg-neutral-100">
        <div className="bg-neutral-100 mx-auto px-4 py-12 max-w-md md:max-w-sm md:px-0 md:w-96 sm:px-4">
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
                inputRef={setUsernameInputRef}
                mask={/^[a-zA-Z0-9_]*$/}
                className="block w-full h-12 px-4 py-2 text-neutral-800 text-center rounded-lg appearance-none bg-neutral-200 placeholder-neutral-400 outline-none focus:ring-1 focus:ring-neutral-400 ring-offset-0 sm:text-sm transition duration-150"
                maxLength={32}
                prepareChar={str => str.trim().toLowerCase()}
                onAccept={(value) => {
                  setIsAvailable(null);
                  setValue('username', value);
                }}
                defaultValue=""
                autoFocus
                placeholder="Enter a username..."
                value={watch('username')}
                {...otherFieldProps}
              />
            </div>
            {
              isValidating && (
                <div className="flex gap-2 my-2 items-center">
                  <div className="flex justify-center ">
                    <LoaderPulsingDotsCircular className="text-lime-600 size-6" />
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
                    {isAvailable ? animatedTick : animatedError}
                  </div>
                  <div className={clsx('text-xs font-medium', isAvailable ? 'text-lime-600' : 'text-red-500')}>
                    {isAvailable ? MSG_USERNAME_AVAILABLE : MSG_USERNAME_ALREADY_TAKEN}
                  </div>
                </div>
              )
            }
            <div className="pt-3">
              { isValidating && <ButtonBusy className="w-full" /> }
              {
                !isValidating && (isAvailable === null || !isAvailable) && (
                  <ButtonPrimary type="submit" className="w-full">Check Availability</ButtonPrimary>
                )
              }
              <AnimatePresence>
                {
                  isAvailable && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <ButtonPrimary type="submit" className="w-full">Confirm</ButtonPrimary>
                    </motion.div>
                  )
                }
              </AnimatePresence>
            </div>
          </form>
        </div>
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
