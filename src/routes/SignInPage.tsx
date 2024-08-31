import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthSignInForm from '@/features/signin/AuthSignInForm';
import { SessionContext, SessionUserMetadata } from '@/contexts/SessionContext';
import GoogleSignInButton from '@/features/signin/GoogleSignInButton';
import AlertDialog from '@/components/AlertDialog';
import { useDialogManager } from '@/hooks/useDialogManager';
import { InProgressScreen } from '@/features/account/InProgressScreen';

export default function SignInPage() {
  const navigate = useNavigate();
  const { user, updateSessionUser } = useContext(SessionContext);
  const [apiRequestPending, setApiRequestPending] = useState(false);
  const dialog = useDialogManager();

  useEffect(() => {
    // If already signed in, skip sign in screen and redirect to home
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const showSigningInScreen = useCallback((show: boolean) => {
    setApiRequestPending(show);
  }, []);

  const onFormSignInSubmit = useCallback(() => showSigningInScreen(true), [showSigningInScreen]);

  const onFormSignInSuccess = useCallback((user: Partial<SessionUserMetadata>) => {
    showSigningInScreen(false);
    // Change app's state to signed in
    updateSessionUser({
      id: user.id ?? '1234',
      username: user.username ?? user.id ?? 'User',
    });
    sessionStorage.setItem('user:1234:username', user.username ?? user.id ?? 'User');
    // Go to home page
    navigate('/', { replace: true });
  }, [showSigningInScreen, updateSessionUser, navigate]);

  const onFormSignInError = useCallback((err?: string) => {
    showSigningInScreen(false);
    dialog.show('API_RESPONSE_ERROR', err);
  }, [showSigningInScreen, dialog]);

  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div className="grid grid-cols-[repeat(5,1fr)] min-h-svh min-w-full isolate">
        <div className="row-span-full col-span-full md:col-span-3 md:col-start-2 lg:col-start-1  lg:col-span-2 flex place-items-center px-4 py-6 z-10 bg-neutral-100 lg:border-r">
          <div className="w-full max-w-md mx-auto px-4">
            <img
              src="assets/svg/logo.svg"
              alt="Logo"
              className="w-32 h-32 mx-auto my-6"
            />
            <div className="mt-8">
              <GoogleSignInButton />
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
            </div>
            <AuthSignInForm
              onSubmit={onFormSignInSubmit}
              onSuccess={onFormSignInSuccess}
              onError={onFormSignInError}
            />
            <div className="text-center mt-3">
              <Link
                to="/signup"
                className="text-sm text-neutral-800 font-semibold hover:text-primary-500 px-6 py-2 outline-none focus:ring-2 ring-primary ring-offset-0 rounded transition duration-150"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
        <div className="row-span-full col-span-full bg-[url('/assets/images/pawel-czerwinski-Zd315A95aqg-unsplash.webp')] bg-cover bg-center bg-no-repeat"></div>
      </div>
      <AlertDialog ref={ref => dialog.register('API_RESPONSE_ERROR', ref)} defaultMessage="An error occurred during sign in" />
      <InProgressScreen isOpen={apiRequestPending} title="Signing In" />
    </>
  );
}
