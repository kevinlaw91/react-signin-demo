import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import fetchMock from 'fetch-mock';
import { useSwiper, useSwiperSlide } from 'swiper/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { IMaskInput } from 'react-imask';
import { z } from 'zod';
import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AlertDialog from '@/components/AlertDialog';
import { useDialogManager } from '@/hooks/useDialogManager';
import { ButtonBusy, ButtonPrimary } from '@/components/Button.tsx';
import { LoaderPulsingDotsCircular } from '@/components/loaders/LoaderPulsingDots.tsx';
import { checkUsernameAvailability, ProfileErrorCode, saveUsername } from '@/services/profile.ts';
import { SessionContext } from '@/contexts/SessionContext';
import Swiper from 'swiper';
import useShakeAnimation from '@/hooks/useShakeAnimation';
import { twMerge } from 'tailwind-merge';

// Username awaiting availability check
const usernameSchema = z.object({
  username: z.string()
    .min(1, { message: 'Please enter a username' })
    .min(6, { message: 'Username needs to be at least 6 characters long' })
    .max(32, { message: 'Username cannot be longer than 32 characters' })
    .regex(/^[a-z0-9_]*$/, { message: 'Username can only contain letters (a-z), numbers (0-9), and underscores (_)' }),
});

// Unclaimed username
const candidateSchema = z.object({
  candidate: z.string()
    .min(1, { message: 'Please enter a username' }),
});

type UsernameFormData = z.infer<typeof usernameSchema>;
type CandidateFormData = z.infer<typeof candidateSchema>;

const MSG_USERNAME_AVAILABLE = 'Username is available';
const MSG_USERNAME_ALREADY_TAKEN = 'Username is already taken';
const MSG_USERNAME_CLAIM_FAILED = 'This username is unavailable. Try a different one.';
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

function UsernameCheckResultMessage({ isAvailable }: { isAvailable: boolean }) {
  return (
    <div className="flex gap-2 my-2 items-center">
      <div className="flex justify-center ">
        {isAvailable ? animatedTick : animatedError}
      </div>
      <div className={twMerge('text-xs font-semibold', isAvailable ? 'text-lime-600' : 'text-red-500')}>
        {isAvailable ? MSG_USERNAME_AVAILABLE : MSG_USERNAME_ALREADY_TAKEN}
      </div>
    </div>
  );
}

export default function ProfileSetupUsername() {
  const dialog = useDialogManager();

  // Wizard slide
  const swiper = useSwiper();
  const swiperSlide = useSwiperSlide();

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const runningUsernameCheck = useRef<AbortController | null>(null);

  // Shake animation should run once only for each failed username check
  // Re-renders should not trigger the shake
  const [lastShakeId, setLastShakeId] = useState<string | undefined>();

  const { updateSessionUser } = useContext(SessionContext);

  const goToNextStep = useCallback(() => swiper.slideNext(), [swiper]);

  const frmCheckUsername = useForm({
    resolver: zodResolver(usernameSchema),
  });

  const frmClaimUsername = useForm({
    resolver: zodResolver(candidateSchema),
  });

  const handleSubmitCheckUsername = useCallback<SubmitHandler<UsernameFormData>>(({ username }) => {
    // Discard any unfinished checks
    runningUsernameCheck.current?.abort?.();
    runningUsernameCheck.current = new AbortController();

    // Hide errors and display loading spinner
    setIsAvailable(null);
    frmClaimUsername.setValue('candidate', '');

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

    return checkUsernameAvailability(username, runningUsernameCheck.current.signal)
      .then((res) => {
        const available = res.data.isAvailable;

        if (available) {
          frmClaimUsername.setValue('candidate', username);
        } else {
          // Reselect input field if username is not available
          frmCheckUsername.setFocus('username');
          frmClaimUsername.setValue('candidate', '');

          // Reset shake animation
          setLastShakeId(Date.now().toString());
        }

        setIsAvailable(available);
        return;
      })
      .catch((err) => {
        // Aborted requests are not error
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error(err);
        dialog.show('API_RESPONSE_ERROR');
      })
      .finally(() => {
        // Restore fetch mock
        fetchMock.restore();
      });
  }, [dialog, frmCheckUsername, frmClaimUsername]);

  const usernameValidationErrorHandler = useCallback<SubmitErrorHandler<UsernameFormData>>((errors) => {
    // Show error dialog if field is blank
    if (errors.username) {
      dialog.show('VALIDATION_ERROR', errors?.username?.message);
    }
  }, [dialog]);

  const {
    ref: setUsernameInputRef, // Needed by setFocus()
    onChange: _, // Not used by IMaskInput
    ...otherFieldProps
  } = frmCheckUsername.register('username');

  // Shake the submit button on validation error
  const [shakeRef, playShakeAnimation] = useShakeAnimation();
  useEffect(() => {
    if (frmCheckUsername.formState.isSubmitSuccessful && !isAvailable) {
      if (lastShakeId) {
        playShakeAnimation();

        // Animation handled. Reset the lastShakeId
        setLastShakeId(undefined);
      }
    }
  }, [frmCheckUsername.formState.isSubmitSuccessful, isAvailable, playShakeAnimation, lastShakeId]);

  const handleSubmitClaimUsername = useCallback<SubmitHandler<CandidateFormData>>(async (data) => {
    const profileId = '1234';
    const _isAvailable = mockIsAvailable(data.candidate);

    // Mock request response
    fetchMock.patch(`path:/api/profile/${profileId}/username`,
      {
        status: _isAvailable ? 200 : 409,
        body: _isAvailable
          ? {
              success: true,
              data: {
                id: profileId,
                username: data.candidate,
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
    let res;
    try {
      res = await saveUsername({ profileId, username: data.candidate });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message && err.message as ProfileErrorCode === ProfileErrorCode.ERR_PROFILE_USERNAME_TAKEN) {
          dialog.show('API_RESPONSE_ERROR', MSG_USERNAME_CLAIM_FAILED);
        } else {
          dialog.show('API_RESPONSE_ERROR');
        }
      }
    } finally {
      // Restore fetch mock
      fetchMock.restore();
    }

    // Success
    if (res?.success) {
      // Update session username
      updateSessionUser({ username: res.data.username });
      sessionStorage.setItem('user:1234:username', res.data.username);
      goToNextStep();
      return;
    } else {
      dialog.show('API_RESPONSE_ERROR');
      throw new Error(ProfileErrorCode.ERR_UNEXPECTED_ERROR);
    }
  }, [dialog, goToNextStep, updateSessionUser]);

  const candidateValidationErrorHandler = useCallback<SubmitErrorHandler<UsernameFormData>>((errors) => {
    // Show error dialog if field is blank
    if (errors.username) {
      dialog.show('VALIDATION_ERROR', errors?.username?.message);
    }
  }, [dialog]);

  const formAction = isAvailable
    ? frmClaimUsername.handleSubmit(handleSubmitClaimUsername, candidateValidationErrorHandler)
    : frmCheckUsername.handleSubmit(handleSubmitCheckUsername, usernameValidationErrorHandler);

  // Autofocus input for first time
  const [focusedUsernameInputOnce, setFocusedUsernameInputOnce] = useState(false);
  const focusUsernameInput = useCallback((evtSwiper: Swiper) => {
    if (!swiperSlide.isActive) return;
    if (focusedUsernameInputOnce) return;
    frmCheckUsername.setFocus('username');
    setFocusedUsernameInputOnce(true);
    evtSwiper.off('slideChangeTransitionEnd', focusUsernameInput);
  }, [focusedUsernameInputOnce, frmCheckUsername, swiperSlide.isActive]);

  useEffect(() => {
    swiper.on('slideChangeTransitionEnd', focusUsernameInput);
    return () => {
      swiper.off('slideChangeTransitionEnd', focusUsernameInput);
    };
  }, [swiper, focusUsernameInput]);

  return (
    <>
      <Helmet>
        <title>Set Username</title>
      </Helmet>
      <section className="flex justify-center items-center min-h-svh mx-auto px-4 py-12 max-w-md md:max-w-sm md:px-0 md:w-96 sm:px-4">
        <div>
          <div className="py-6">
            <img
              src="/assets/svg/logo.svg"
              alt="Logo"
              className="w-24 h-24 mx-auto"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-center my-4 text-neutral-600">Let&apos;s pick your username</h1>
          <div className="text-neutral-400 text-xs text-center my-2" role="note">
            You can use letters (a-z), numbers (0-9), and underscores (_)
          </div>
          <form onSubmit={formAction}>
            <div className="mt-6">
              <IMaskInput
                inputRef={setUsernameInputRef}
                mask={/^[a-zA-Z0-9_]*$/}
                className="block w-full h-12 px-4 py-2 text-neutral-700 text-center rounded-lg appearance-none bg-neutral-200 placeholder-neutral-400 outline-none focus:ring-1 focus:ring-neutral-400 ring-offset-0 sm:text-sm transition duration-150"
                maxLength={32}
                prepareChar={str => str.trim().toLowerCase()}
                onAccept={(value) => {
                  setIsAvailable(null);
                  frmCheckUsername.setValue('username', value);
                  frmClaimUsername.setValue('candidate', '');
                }}
                defaultValue=""
                placeholder="Enter a username..."
                value={frmCheckUsername.watch('username')}
                {...otherFieldProps}
              />
            </div>
            {
              frmCheckUsername.formState.isSubmitting && (
                <div className="flex gap-2 my-2 items-center text-neutral-600">
                  <div className="flex justify-center ">
                    <LoaderPulsingDotsCircular className="size-6" />
                  </div>
                  <div className="text-xs">
                    Checking availability...
                  </div>
                </div>
              )
            }
            {isAvailable !== null && <UsernameCheckResultMessage isAvailable={isAvailable} />}
            <div ref={shakeRef} className="pt-3">
              {
                (frmCheckUsername.formState.isSubmitting || frmClaimUsername.formState.isSubmitting)
                && <ButtonBusy className="w-full" />
              }
              {
                !frmCheckUsername.formState.isSubmitting && !isAvailable && (
                  <ButtonPrimary type="submit" className="w-full">Check Availability</ButtonPrimary>
                )
              }
              {
                (!frmClaimUsername.formState.isSubmitSuccessful && !frmClaimUsername.formState.isSubmitting && isAvailable === true)
                && (
                  <AnimatePresence>
                    (
                    isAvailable === true &&
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <ButtonPrimary type="submit" className="w-full">Confirm</ButtonPrimary>
                    </motion.div>
                    )
                  </AnimatePresence>
                )
              }
            </div>
          </form>
        </div>
      </section>
      <AlertDialog ref={ref => dialog.register('VALIDATION_ERROR', ref)} />
      <AlertDialog ref={ref => dialog.register('API_RESPONSE_ERROR', ref)} defaultMessage="An error occurred. Please try again later" />
    </>
  );
}
