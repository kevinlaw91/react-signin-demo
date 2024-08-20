import { useCallback, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthSignUpForm from '@/components/AuthSignUpForm.tsx';
import BusyScreen from '@/components/BusyScreen.tsx';
import { SessionContext, SessionUserMetadata } from '@/contexts/SessionContext';
import { useAlertPopupModal } from '@/hooks/useAlertPopupModal.ts';
import GoogleSignInButton from '@/features/signin/GoogleSignInButton';
import { createPortal } from 'react-dom';
import { usePopupModalManager } from '@/hooks/usePopupModalManager.ts';

const BUSY_MODAL = 'SIGNUP_BUSY';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { user, updateSessionUser } = useContext(SessionContext);
  const { modals, queueModal, hideModal } = usePopupModalManager();
  const { queueAlertModal } = useAlertPopupModal();

  useEffect(() => {
    // If already signed in, redirect to home
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const showBusyScreenModal = useCallback((show: boolean) => {
    if (show) {
      queueModal({ id: BUSY_MODAL, type: 'placeholder' });
    } else {
      hideModal(BUSY_MODAL);
    }
  }, [queueModal, hideModal]);

  const onFormSignUpSubmit = () => {
    showBusyScreenModal(true);
  };

  const onFormSignUpSuccess = useCallback((user: SessionUserMetadata) => {
    showBusyScreenModal(false);

    // Change app's state to signed in
    updateSessionUser({ id: user.id });

    // Go to home page
    navigate('/', { replace: true });
  }, [showBusyScreenModal, updateSessionUser, navigate]);

  const onFormSignUpError = (err?: string) => {
    showBusyScreenModal(false);
    queueAlertModal(err || 'Sign up failed');
  };

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
      {modals.some(m => m.id === BUSY_MODAL) && createPortal(<BusyScreen message="Creating account" messageClassName="text-white/90" />, document.body, BUSY_MODAL)}
    </>
  );
}
