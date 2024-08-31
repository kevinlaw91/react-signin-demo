import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthSignUpForm from '@/features/signup/AuthSignUpForm';
import { SessionContext, SessionUserMetadata } from '@/contexts/SessionContext';
import AlertDialog from '@/components/AlertDialog';
import { useDialogManager } from '@/hooks/useDialogManager';
import GoogleSignInButton from '@/features/signin/GoogleSignInButton';
import SignUpSuccess from '@/features/signup/SignUpSuccess';
import { InProgressScreen } from '@/features/account/InProgressScreen';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateSessionUser } = useContext(SessionContext);
  const [apiRequestPending, setApiRequestPending] = useState(false);
  const dialog = useDialogManager();

  useEffect(() => {
    // If already signed in, redirect to home
    if (user && searchParams.get('complete') !== 'true') {
      navigate('/', { replace: true });
    }
  }, [user, navigate, searchParams]);

  const showSigningUpScreen = useCallback((show: boolean) => {
    setApiRequestPending(show);
  }, []);

  const onFormSignUpSubmit = useCallback(() => setApiRequestPending(true), []);

  const onFormSignUpSuccess = useCallback((user: Partial<SessionUserMetadata>) => {
    showSigningUpScreen(false);

    // Change app's state to signed in
    updateSessionUser({ id: user.id });
    sessionStorage.removeItem('user:1234:username');

    // Show success screen
    navigate(`.?complete=true`, { replace: true });
  }, [showSigningUpScreen, updateSessionUser, navigate]);

  const onFormSignUpError = useCallback((err?: string) => {
    showSigningUpScreen(false);
    dialog.show('API_RESPONSE_ERROR', err);
  }, [dialog, showSigningUpScreen]);

  if (searchParams.get('complete') === 'true') {
    return (
      <>
        <Helmet>
          <title>Sign Up Success!</title>
        </Helmet>
        <SignUpSuccess />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className="grid grid-cols-[repeat(5,1fr)] min-h-svh min-w-full isolate">
        <div className="row-span-full col-span-full md:col-span-3 md:col-start-2 lg:col-start-1  lg:col-span-2 flex place-items-center px-4 py-6 z-10 bg-neutral-100 lg:border-r">
          <div className="w-full max-w-md mx-auto px-4">
            <img
              src="/assets/svg/logo.svg"
              alt="Logo"
              className="w-32 h-32 mx-auto my-6"
            />
            <div className="text-sm text-neutral-600 text-center mb-4">
              <h1 className="text-2xl font-bold">Sign Up</h1>
              <div className="mt-4">
                <span>Already have an account? </span>
                <Link to="/signin" className="text-primary font-semibold hover:underline px-1 py-0.5 outline-none focus:ring-1 ring-primary ring-offset-0 rounded">Sign in</Link>
              </div>
            </div>
            <AuthSignUpForm
              onSubmit={onFormSignUpSubmit}
              onSuccess={onFormSignUpSuccess}
              onError={onFormSignUpError}
            />
            <div>
              <div className="relative py-3">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 text-sm text-neutral-400 bg-neutral-100">or</span>
                </div>
              </div>
              <GoogleSignInButton />
            </div>
          </div>
        </div>
        <div className="row-span-full col-span-full bg-[url('/assets/images/pawel-czerwinski-Zd315A95aqg-unsplash.webp')] bg-cover bg-center bg-no-repeat"></div>
      </div>
      <AlertDialog ref={ref => dialog.register('API_RESPONSE_ERROR', ref)} defaultMessage="An error occurred during sign up" />
      <InProgressScreen isOpen={apiRequestPending} title="Creating account" />
    </>
  );
}
