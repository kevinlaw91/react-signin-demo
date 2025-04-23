import { useCallback, useRef, useState } from 'react';
import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form';
import { arrow, autoUpdate, flip, FloatingArrow, FloatingPortal, offset, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole } from '@floating-ui/react';
import { Link } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import { z } from 'zod';
import { Icon } from '@iconify-icon/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUser, AuthErrorCode } from '@/services/auth.ts';
import { SessionUserMetadata } from '@/contexts/SessionContext.tsx';
import { FormErrorMessage } from '@/features/account/FormErrorMessage';
import { ButtonPrimary } from '@/components/Button.tsx';
import useShakeAnimation from '@/hooks/useShakeAnimation';

/* ===== Types/Schemas ===== */
const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/^[a-zA-Z0-9 !@#$%^&*()\-_+=[\]{}|\\;:'",.<>/?]*$/, { message: 'Can only contains letters, numbers, spaces and symbols' }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export interface SignUpSuccessResponse {
  success: true;
  data: { id: string };
}

export interface SignUpFailureResponse {
  success: false;
  message?: string;
}

export type SignUpResponse = SignUpSuccessResponse | SignUpFailureResponse;

/* ===== Constants ===== */
const MSG_ERR_GENERIC = 'Unable to create account. Please try again later';
const MSG_ERR_REJECTED = 'This email and password combination cannot be used';
const MSG_WARN_PASSWORD_WHITESPACE = 'Your password may contain leading or trailing spaces\\nResubmit if you\'re certain you want to proceed';

/* ===== Mock data ===== */
const responseSuccess: SignUpSuccessResponse = { success: true, data: { id: '1234' } };
const responseErrorSignUpRejected: SignUpFailureResponse = { success: false, message: AuthErrorCode.ERR_ACCOUNT_SIGNUP_REJECTED };

export function AuthSignUpForm(props: {
  onSubmit: () => void;
  onSuccess: (user: Partial<SessionUserMetadata>) => void;
  onError: (err?: string) => void;
}) {
  /* ===== Form controller ===== */
  const {
    register,
    handleSubmit,
    trigger,
    setError,
    getFieldState,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const alertedAboutLeadingTrailingSpace = useRef(false);
  const passwordFieldState = getFieldState('password');

  /* ===== Password tooltip controller ===== */
  const [isPasswordTooltipVisible, setIsPasswordTooltipVisible] = useState(false);
  const tooltipPasswordArrowRef = useRef<SVGSVGElement | null>(null);
  const { refs, floatingStyles, context } = useFloating({
    open: isPasswordTooltipVisible,
    onOpenChange: setIsPasswordTooltipVisible,
    placement: 'top',
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      flip({
        fallbackAxisSideDirection: 'end',
      }),
      shift(),
      arrow({
        element: tooltipPasswordArrowRef,
      }),
    ],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: false }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);

  /* ===== Password field masking controller ===== */
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  /* ===== Responsive password validation ===== */
  const handlePasswordFieldChange = useCallback(
    () => void trigger('password'),
    [trigger],
  );

  const { onSubmit: onSubmitCallback, onSuccess: onSuccessCallback, onError: onErrorCallback } = props;

  // Shake the submit button on validation error
  const [shakeRef, playShakeAnimation] = useShakeAnimation();

  const formSubmitHandler = useCallback<SubmitHandler<SignUpFormData>>(
    (data: SignUpFormData) => {
      // Mask the password field during form submission
      setIsPasswordVisible(false);

      // Warn once if password field has leading or trailing spaces
      if (!alertedAboutLeadingTrailingSpace.current && data.password !== data.password.trim()) {
        alertedAboutLeadingTrailingSpace.current = true;
        onErrorCallback(MSG_WARN_PASSWORD_WHITESPACE);
        return;
      }

      // Tell the parent page form is submitting
      onSubmitCallback();

      // Mock API
      if (data.email !== 'registered@example.com') {
        fetchMock
          .mockGlobal()
          .post(
            'path:/api/account/create',
            {
              status: 200,
              body: responseSuccess,
              headers: {
                'Content-Type': 'application/json',
              },
            },
            { delay: 1000 },
          );
      } else {
        fetchMock
          .mockGlobal()
          .post(
            'path:/api/account/create',
            {
              status: 403,
              body: responseErrorSignUpRejected,
              headers: {
                'Content-Type': 'application/json',
              },
            },
            { delay: 1000 },
          );
      }

      return createUser(data)
        .then((res: SignUpResponse) => {
          if (res.success) {
            // Success, tell the parent component login success
            onSuccessCallback({ id: res.data.id });
            return;
          }
          // Malformed response?
          throw new Error(AuthErrorCode.ERR_UNEXPECTED_ERROR);
        })
        .catch((err) => {
          // Error: Unable to create user account
          if (err instanceof Error && err.message && err.message as AuthErrorCode === AuthErrorCode.ERR_ACCOUNT_SIGNUP_REJECTED) {
            setError('root', { type: 'api', message: MSG_ERR_REJECTED });
            onErrorCallback(MSG_ERR_REJECTED);
          } else {
            setError('root', { type: 'api', message: MSG_ERR_GENERIC });
            onErrorCallback(MSG_ERR_GENERIC);
          }
        })
        .finally(() => {
          // Restore fetch mock
          fetchMock.hardReset();
        });
    },
    [onSubmitCallback, onErrorCallback, onSuccessCallback, setError],
  );

  const formValidationErrorHandler = useCallback<SubmitErrorHandler<SignUpFormData>>((errors) => {
    // Shake the submit button on validation returns error
    if (Object.keys(errors).length > 0) {
      playShakeAnimation();
    }
  }, [playShakeAnimation]);

  return (
    <form onSubmit={handleSubmit(formSubmitHandler, formValidationErrorHandler)}>
      <div className="space-y-3">
        <div>
          <label
            htmlFor="email"
            className="block mb-3 text-sm font-semibold text-neutral-600"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            maxLength={254}
            placeholder="Your email"
            className="block w-full h-12 px-4 py-2 text-neutral-700 rounded-lg appearance-none bg-neutral-200 placeholder-neutral-400 outline-none focus:ring-1 focus:ring-neutral-400 ring-offset-0 text-sm transition duration-150"
            {...register('email', { setValueAs: (value: string) => value.trim() })}
          />
          {errors?.email && (
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          )}
        </div>
        <div className="col-span-full">
          <label
            htmlFor="password"
            className="block mb-3 text-sm font-semibold text-neutral-600"
          >
            <span>Password</span>
            {
              passwordFieldState.isDirty
                ? <Icon ref={refs.setReference} {...getReferenceProps()} icon={passwordFieldState.invalid ? 'mi:circle-error' : 'codicon:pass-filled'} width="16" className={`align-text-bottom ml-2 cursor-help ${passwordFieldState.invalid ? 'text-red-800/60' : 'text-[#008194]'}`} />
                : <Icon ref={refs.setReference} {...getReferenceProps()} icon="material-symbols:info-outline" width="16" className="text-neutral-400 align-text-bottom ml-2 cursor-help" />
            }
          </label>
          <FloatingPortal>
            {isPasswordTooltipVisible && (
              <div
                className="bg-[#222] rounded-lg px-4 py-4 shadow-lg"
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
              >
                <div className="text-sm text-neutral-400">
                  {
                    passwordFieldState.isDirty && !passwordFieldState.invalid
                      ? (
                          <div>Your password is ok.</div>
                        )
                      : (
                          <div>
                            Password
                            <span className="font-bold"> MUST </span>
                            be at least 8 characters long.
                          </div>
                        )
                  }
                  <section className="mt-2 pt-2 opacity-50 border-t border-neutral-600">
                    <div className="font-bold">(Optional)</div>
                    <h3>Strong password:</h3>
                    <p>Use a mix of uppercase, lowercase, numbers, and symbols.</p>
                    <p>Use a longer password.</p>
                  </section>
                </div>
                <FloatingArrow
                  ref={tooltipPasswordArrowRef}
                  context={context}
                  tipRadius={3}
                  className="fill-[#222]"
                />
              </div>
            )}
          </FloatingPortal>
          <div className="relative flex items-center">
            <input
              className="block w-full h-12 px-4 py-2 pr-12 text-neutral-700 rounded-lg appearance-none bg-chalk bg-neutral-200 placeholder-neutral-400 outline-none focus:ring-1 focus:ring-neutral-400 ring-offset-0 text-sm transition duration-150"
              placeholder="At least 8 characters"
              id="password"
              maxLength={255}
              type={isPasswordVisible ? 'text' : 'password'}
              {...register('password', { onChange: handlePasswordFieldChange })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-lg outline-none focus:ring-1 ring-neutral-400"
              onClick={togglePasswordVisibility}
              title={isPasswordVisible ? 'Hide password' : 'Show password'}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              aria-pressed={isPasswordVisible}
            >
              <Icon icon={isPasswordVisible ? 'basil:eye-outline' : 'basil:eye-closed-outline'} width="24" className="text-neutral-400 align-middle p-1" />
            </button>
          </div>
          {errors.password && (
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          )}
        </div>
        <div className="text-xs text-neutral-600 text-center py-1">
          <span>By clicking &quot;Create Account&quot; you agree to our </span>
          <div>
            <Link to="/terms" className="px-1 py-0.5 text-primary hover:underline outline-none focus:ring-1 focus:ring-primary focus:bg-neutral-100 ring-offset-0 rounded">Terms of Service</Link>
            <span> and </span>
            <Link to="/privacy" className="px-0.5 py-0.5 text-primary hover:underline outline-none focus:ring-1 focus:ring-primary focus:bg-neutral-100 ring-offset-0 rounded">Privacy Policy</Link>
          </div>
        </div>
        <div ref={shakeRef} className="col-span-full">
          <ButtonPrimary type="submit" className="w-full">Create Account</ButtonPrimary>
        </div>
        {errors?.root && (
          <FormErrorMessage icon={<Icon icon="ion:warning" inline width="24" className="align-bottom mr-1" />}>
            {errors?.root?.message}
          </FormErrorMessage>
        )}
      </div>
    </form>
  );
}
