import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import AuthSignUpForm from '@/components/AuthSignUpForm.tsx';
import BusyScreen from '@/components/BusyScreen.tsx';
import AuthContext, { AuthenticatedUser } from '@/contexts/AuthContext.tsx';
import AlertModal from '@/components/AlertModal.tsx';
import GoogleSignInButton from '@/components/GoogleSignInButton.tsx';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { activeUser, setActiveUser } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState<string | undefined>();

  useEffect(() => {
    // If already signed in, redirect to home
    if (activeUser) {
      navigate('/', { replace: true });
    }
  }, [activeUser, navigate]);

  const onFormSignUpSubmit = () => {
    setIsModalOpen(true);
    setIsSubmitting(true);
  };

  const onFormSignUpSuccess = useCallback((user: AuthenticatedUser) => {
    setIsModalOpen(false);
    setIsSubmitting(false);

    // Change app's state to signed in
    setActiveUser({ id: user.id });

    // Go to home page
    navigate('/', { replace: true });
  }, [setActiveUser, navigate]);

  const onFormSignUpError = (err?: string) => {
    setIsModalOpen(true);
    setIsSubmitting(false);
    setIsAlertModalOpen(true);
    setAlertModalMessage(err || 'Sign up failed');
  };

  const handleAlertModalDismiss = () => {
    setIsModalOpen(false);
    setIsAlertModalOpen(false);
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
        {isSubmitting && <BusyScreen message="Creating account" messageClassName="text-white/90" />}
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
