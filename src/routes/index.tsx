import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthContext from '@/context/AuthContext.tsx';

export default function IndexPage() {
  const navigate = useNavigate();
  const { activeUser } = useContext(AuthContext);

  useEffect(() => {
    // Redirect to sign in form if not signed in
    if (!activeUser) navigate('/signin', { replace: true });
  }, [activeUser, navigate]);

  return (
    <>
      <Helmet>
        <title>{`Welcome, ${activeUser?.id}`}</title>
      </Helmet>
      <section></section>
    </>
  );
}
