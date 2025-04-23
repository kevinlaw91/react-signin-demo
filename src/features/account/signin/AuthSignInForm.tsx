import { useCallback } from 'react';
import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form';
import fetchMock from 'fetch-mock';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authenticateUser, AuthErrorCode } from '@/services/auth.ts';
import { SessionUserMetadata } from '@/contexts/SessionContext';
import { FormErrorMessage } from '@/features/account/FormErrorMessage';
import { ButtonPrimary } from '@/components/Button.tsx';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Link } from 'react-router-dom';
import useShakeAnimation from '@/hooks/useShakeAnimation';
import { Icon } from '@iconify-icon/react';

/* ===== Types/Schemas ===== */
const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
  remember: z.boolean().default(false),
});

type SignInFormData = z.infer<typeof signInSchema>;

export interface SignInSuccessResponse {
  success: true;
  data: { id: string };
}

export interface SignInFailureResponse {
  success: false;
  message?: string;
}

export type SignInResponse = SignInSuccessResponse | SignInFailureResponse;

/* ===== Constants ===== */
const MSG_ERR_SIGN_IN = 'Sign in error. Please try again later';
const MSG_ERR_INVALID_CREDENTIALS = 'Incorrect email or password';

/* ===== Mock data ===== */
const responseSuccess: SignInSuccessResponse = { success: true, data: { id: '1234' } };
const responseErrorUnauthorized: SignInFailureResponse = { success: false, message: 'INVALID_CREDENTIALS' };

export function AuthSignInForm(props: {
  onSubmit: () => void;
  onSuccess: (userMetadata: Partial<SessionUserMetadata>) => void;
  onError: (err?: string) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const { onSubmit: onSubmitCallback, onSuccess: onSuccessCallback, onError: onErrorCallback } = props;

  // Shake the submit button on validation error
  const [shakeRef, playShakeAnimation] = useShakeAnimation();

  const formSubmitHandler: SubmitHandler<SignInFormData> = useCallback(
    (data: SignInFormData) => {
      // Clear password field for safety
      setValue('password', '', { shouldValidate: false });

      // Tell the parent page form is submitting
      onSubmitCallback();

      // Mock API

      // Email: Use any valid email
      // Success: password = 'success'
      // Fail: password = 'error'

      if (data.password === 'success') {
        fetchMock.post('path:/api/signin',
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
        fetchMock.post('path:/api/signin',
          {
            status: 401,
            body: responseErrorUnauthorized,
            headers: {
              'Content-Type': 'application/json',
            },
          },
          { delay: 1000 },
        );
      }

      return authenticateUser(data)
        .then((res: SignInResponse) => {
          if (!res.success) throw new Error(AuthErrorCode.ERR_UNEXPECTED_ERROR);

          // Success, tell the parent component sign in success
          return onSuccessCallback({
            id: res.data.id,
            username: data.email.split('@')[0],
          });
        })
        .catch((err) => {
          if (err instanceof Error && err.message && err.message as AuthErrorCode === AuthErrorCode.ERR_INVALID_CREDENTIALS) {
            setError('password', { type: 'api', message: MSG_ERR_INVALID_CREDENTIALS }, { shouldFocus: true });
            onErrorCallback(MSG_ERR_INVALID_CREDENTIALS);
          } else {
            setError('root', { type: 'api', message: MSG_ERR_SIGN_IN });
            onErrorCallback(MSG_ERR_SIGN_IN);
          }
        })
        .finally(() => {
          // Restore fetch mock
          fetchMock.restore();
        });
    },
    [onSubmitCallback, onSuccessCallback, onErrorCallback, setValue, setError],
  );

  const formValidationErrorHandler = useCallback<SubmitErrorHandler<SignInFormData>>((errors) => {
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
            placeholder="Use any fake email. Nothing send to the server"
            className="block w-full h-12 px-4 py-2 text-neutral-700 rounded-lg appearance-none bg-neutral-200 placeholder-neutral-400 outline-none focus:ring-1 focus:ring-neutral-400/50 ring-offset-0 text-sm transition duration-150"
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
            Password
          </label>
          <input
            className="block w-full h-12 px-4 py-2 text-neutral-700 rounded-lg appearance-none bg-neutral-200 placeholder-neutral-400 outline-none focus:ring-1 focus:ring-neutral-400/50 ring-offset-0 text-sm transition duration-150"
            placeholder="Try &quot;success&quot;"
            id="password"
            maxLength={255}
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
          )}
        </div>
        <div className="flex flex-row items-center justify-between text-neutral-600">
          <FormControlLabel
            label="Keep me signed in"
            control={<Checkbox {...register('remember')} />}
            classes={{
              label: 'mt-0.5 text-sm',
            }}
          />
          <div>
            <Link
              to="/recovery"
              className="text-sm text-primary-500 hover:text-primary-400 font-semibold whitespace-nowrap px-2 py-1 -mr-1 outline-none focus:ring-2 ring-primary ring-offset-0 rounded transition duration-150"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
        {errors?.root && (
          <FormErrorMessage icon={<Icon icon="ion:warning" inline width="24" className="align-bottom mr-1" />}>
            {errors?.root?.message}
          </FormErrorMessage>
        )}
        <div
          ref={shakeRef}
          className="col-span-full"
        >
          <ButtonPrimary type="submit" className="w-full">Sign In</ButtonPrimary>
        </div>
      </div>
    </form>
  );
}
