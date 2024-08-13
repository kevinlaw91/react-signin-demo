import { useCallback, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthSignInForm from '@/components/AuthSignInForm.tsx';
import BusyScreen from '@/components/BusyScreen.tsx';
import { UserSessionContext, AuthenticatedUser } from '@/contexts/UserSessionContext';
import { useAlertPopupModal } from '@/hooks/useAlertPopupModal.ts';
import GoogleSignInButton from '@/components/GoogleSignInButton.tsx';
import { createPortal } from 'react-dom';
import { usePopupModalManager } from '@/hooks/usePopupModalManager.ts';

const BUSY_MODAL = 'SIGNIN_BUSY';

export default function SignInPage() {
  const navigate = useNavigate();
  const { activeUser, setActiveUser } = useContext(UserSessionContext);
  const { modals, queueModal, hideModal } = usePopupModalManager();
  const { queueAlertModal } = useAlertPopupModal();

  useEffect(() => {
    // If already signed in, skip sign in screen and redirect to home
    if (activeUser) {
      navigate('/', { replace: true });
    }
  }, [activeUser, navigate]);

  const showBusyScreenModal = useCallback((show: boolean) => {
    if (show) {
      queueModal({ id: BUSY_MODAL, type: 'placeholder' });
    } else {
      hideModal(BUSY_MODAL);
    }
  }, [queueModal, hideModal]);

  const onFormSignInSubmit = () => {
    showBusyScreenModal(true);
  };

  const onFormSignInSuccess = useCallback((user: AuthenticatedUser) => {
    showBusyScreenModal(false);
    // Change app's state to signed in
    setActiveUser({ id: user.id });
    // Go to home page
    navigate('/', { replace: true });
  }, [showBusyScreenModal, setActiveUser, navigate]);

  const onFormSignInError = (err?: string) => {
    showBusyScreenModal(false);
    queueAlertModal(err || 'An error occurred during sign in');
  };
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
            <div className="mt-6 flex text-sm text-center place-content-between flex-col sm:flex-row">
              <div className="py-2">
                <Link
                  to="/recovery"
                  className="text-neutral-800 font-semibold hover:text-primary-500 px-1 py-0.5 outline-none focus:ring-2 ring-primary ring-offset-0 rounded transition duration-150"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="py-2">
                <Link
                  to="/signup"
                  className="text-neutral-800 font-semibold hover:text-primary-500 px-1 py-0.5 outline-none focus:ring-2 ring-primary ring-offset-0 rounded transition duration-150"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-full col-span-full bg-[url('/assets/images/pawel-czerwinski-Zd315A95aqg-unsplash.webp')] bg-cover bg-center bg-no-repeat"></div>
      </div>
      {modals.some(m => m.id === BUSY_MODAL) && createPortal(<BusyScreen message="Signing In" messageClassName="text-white/90" />, document.body, BUSY_MODAL)}
    </>
  );
}
