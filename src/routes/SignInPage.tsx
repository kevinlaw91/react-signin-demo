import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import AuthSignInForm from '@/components/AuthSignInForm.tsx';
import BusyScreen from '@/components/BusyScreen.tsx';
import AuthContext, { AuthenticatedUser } from '@/context/AuthContext.tsx';
import AlertModal from '@/components/AlertModal.tsx';
import GoogleSignInButton from '@/components/GoogleSignInButton.tsx';

export default function SignInPage() {
  const navigate = useNavigate();
  const { activeUser, setActiveUser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState<string | undefined>();

  useEffect(() => {
    // If already signed in, skip sign in screen and redirect to home
    if (activeUser) {
      navigate('/', { replace: true });
    }
  }, [activeUser, navigate]);

  const onFormSignInSubmit = () => {
    setIsModalOpen(true);
    setIsSubmitting(true);
  };

  const onFormSignInSuccess = useCallback((user: AuthenticatedUser) => {
    setIsModalOpen(false);
    setIsSubmitting(false);

    // Change app's state to signed in
    setActiveUser({ id: user.id });

    // Go to home page
    navigate('/', { replace: true });
  }, [setActiveUser, navigate]);

  const onFormSignInError = (err?: string) => {
    setIsModalOpen(true);
    setIsSubmitting(false);
    setIsAlertModalOpen(true);
    setAlertModalMessage(err || 'An error occurred during sign in');
  };

  const handleAlertModalDismiss = () => {
    setIsModalOpen(false);
    setIsAlertModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div className="flex justify-center min-h-svh min-w-full lg:px-0 md:px-12 isolate">
        <div className="relative z-10 flex flex-col flex-1 px-4 py-10 bg-neutral-100 lg:border-r lg:py-24 md:flex-none md:px-28 sm:justify-center">
          <div className="w-full max-w-md mx-auto md:max-w-sm md:px-0 md:w-96 sm:px-4">
            <div className="flex flex-col">
              <img
                src="assets/svg/logo.svg"
                alt="Logo"
                className="w-32 h-32 mx-auto my-6"
              />
            </div>
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
            <div className="mt-6 flex text-sm font-medium text-center place-content-between flex-col sm:flex-row">
              <div className="py-2">
                <Link
                  to="/recovery"
                  className="text-neutral-800 hover:text-primary-500 outline-0 focus:ring-2 ring-offset-2 ring-primary transition duration-150"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="py-2">
                <Link
                  to="/signup"
                  className="text-neutral-800 hover:text-primary-500 outline-0 focus:ring-2 ring-offset-2 ring-primary transition duration-150"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:flex-1 lg:relative sm:contents">
          <div className="absolute w-full h-full">
            <img
              className="object-cover w-full h-full"
              src="assets/images/pawel-czerwinski-Zd315A95aqg-unsplash.webp"
              alt=""
            />
          </div>
        </div>
      </div>
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
        {isSubmitting && <BusyScreen message="Signing In" />}
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
