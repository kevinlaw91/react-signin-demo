import { SyntheticEvent, useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SessionContext } from '@/contexts/SessionContext';

function UserWelcomeScreen() {
  const navigate = useNavigate();
  const { user, clearSession } = useContext(SessionContext);

  const handleSignOut = useCallback((evt: SyntheticEvent<HTMLAnchorElement>) => {
    sessionStorage.removeItem('user:1234:username');
    clearSession();
    navigate('/', { replace: true });
    evt.preventDefault();
    return;
  }, [clearSession, navigate]);

  if (!user) return null;

  return (
    <section>
      <img src={user.avatarSrc || '/assets/images/profile-picture-blank.jpg'} alt="Profile picture" className="size-8 rounded-full" />
      {
        user && (
          <h1>
            Welcome,
            <a href={`/profile/${user.id}`}>{user.username || user.id}</a>
            <a href="" onClick={handleSignOut}>Sign out</a>
          </h1>
        )
      }
    </section>
  );
}

export default function IndexPage() {
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);

  useEffect(() => {
    // Redirect to sign in form if not signed in
    if (!user) navigate('/signin', { replace: true });
  }, [navigate, user]);

  return (
    <>
      <Helmet>
        <title>
          Welcome
          { (user?.username || user?.id) ? `, ${user?.username || user?.id}` : '' }
        </title>
      </Helmet>
      <UserWelcomeScreen />
    </>
  );
}
