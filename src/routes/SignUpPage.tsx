import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthContext from '@/context/AuthContext.tsx';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { activeUser, setActiveUser } = useContext(AuthContext);

  useEffect(() => {
    // If already signed in, redirect to home
    if (activeUser) {
      navigate('/', { replace: true });
    }
  }, [activeUser, navigate]);

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
    </>
  );
}
