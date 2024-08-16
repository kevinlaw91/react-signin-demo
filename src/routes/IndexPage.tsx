import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SessionUserMetadata, SessionContext } from '@/contexts/SessionContext';

function UserWelcomeScreen({ user }: { user?: Partial<SessionUserMetadata> }) {
  if (!user) return null;

  return (
    <section>
      <img src={user.avatarSrc || '/assets/images/profile-picture-blank.jpg'} alt="Profile picture" className="size-8 rounded-full" />
      {
        user && (
          <h1>
            Welcome,
            <a href={`/profile/${user.id}`}>{user.username}</a>
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
        <title>{`Welcome, ${user?.username}`}</title>
      </Helmet>
      <UserWelcomeScreen user={user} />
    </>
  );
}
