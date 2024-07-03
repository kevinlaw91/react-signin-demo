import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import fetchMock from 'fetch-mock';
import { z } from 'zod';
import { Icon } from '@iconify-icon/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { authenticateUser, ERR_INVALID_CREDENTIALS, ERR_UNEXPECTED_ERROR } from '@/services/auth.ts';
import { AuthenticatedUser } from '@/context/AuthContext.tsx';
import FormErrorMessage from '@/components/FormErrorMessage.tsx';

/* ===== Types/Schemas ===== */
const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
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

export default function AuthSignInForm(props: {
  onSubmit: () => void;
  onSuccess: (user: AuthenticatedUser) => void;
  onError: (err?: string) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const { onSubmit: onSubmitCallback, onSuccess: onSuccessCallback, onError: onErrorCallback } = props;

  const formSignInSubmitHandler: SubmitHandler<SignInFormData> = useCallback(
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

      authenticateUser(data)
        .then((res: SignInResponse) => {
          if (res.success) {
            // Success, tell the parent component sign in success
            onSuccessCallback({ id: res.data.id });
            return;
          }

          // Malformed response?
          throw new Error(ERR_UNEXPECTED_ERROR);
        })
        .catch((err) => {
          if (err instanceof Error) {
            // Failure, tell the parent component sign in failed
            if (err.message && err.message === ERR_INVALID_CREDENTIALS) {
              setError('password', { type: 'api', message: MSG_ERR_INVALID_CREDENTIALS }, { shouldFocus: true });
              onErrorCallback(MSG_ERR_INVALID_CREDENTIALS);
            } else {
              setError('root', { type: 'api', message: MSG_ERR_SIGN_IN });
              onErrorCallback(MSG_ERR_SIGN_IN);
            }
          } else {
            setError('root', { type: 'api', message: MSG_ERR_SIGN_IN });
            onErrorCallback(MSG_ERR_SIGN_IN);
          }
        });

      // Restore fetch mock
      fetchMock.restore();
    },
    [onSubmitCallback, onSuccessCallback, onErrorCallback, setValue, setError],
  );

  return (
    <form onSubmit={handleSubmit(formSignInSubmitHandler)}>
      <div className="space-y-3">
        <div>
          <label
            htmlFor="email"
            className="block mb-3 text-sm font-medium text-neutral-600"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            maxLength={254}
            placeholder="Your email"
            className="block w-full h-12 px-4 py-2 text-neutral-800 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 focus:border-primary-200 outline-none ring-primary-300 sm:text-sm transition duration-150"
            {...register('email', { setValueAs: (value: string) => value.trim() })}
          />
          {errors?.email && (
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          )}
        </div>
        <div className="col-span-full">
          <label
            htmlFor="password"
            className="block mb-3 text-sm font-medium text-neutral-600"
          >
            Password
          </label>
          <input
            className="block w-full h-12 px-4 py-2 text-neutral-800 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 focus:border-primary-200 outline-none ring-primary-300 sm:text-sm transition duration-150"
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
        <div className="col-span-full">
          <button
            type="submit"
            className="w-full h-12 gap-3 px-5 py-3 font-medium text-white bg-primary hover:bg-primary-500 outline-none rounded-xl focus:ring-2 ring-offset-2 ring-primary transition duration-150"
          >
            Sign in
          </button>
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
