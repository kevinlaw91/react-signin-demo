import { SyntheticEvent, useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SessionContext } from '@/contexts/SessionContext';
import { Button } from '@/components/Button.tsx';
import { IconButton } from '@mui/material';
import { Icon } from '@iconify-icon/react';

function UserWelcomeScreen() {
  const navigate = useNavigate();
  const { user, clearSession } = useContext(SessionContext);

  const handleSignOut = useCallback((evt: SyntheticEvent) => {
    sessionStorage.removeItem('user:1234:username');
    clearSession();
    navigate('/', { replace: true });
    evt.preventDefault();
    return;
  }, [clearSession, navigate]);

  if (!user) return null;

  const profileLink = `/profile/${user.id}`;

  return (
    <section>
      <style>
        {`
        body {
        background: #111;
      }
      `}
      </style>
      <section className="flex content-start flex-wrap justify-end bg-gradient-to-r from-orange-300 to-rose-300 rounded-b-2xl h-32">
        <IconButton aria-label="Menu" size="large">
          <Icon icon="solar:menu-dots-bold" className="text-white" />
        </IconButton>
      </section>
      <section className="-mt-12">
        <div className="flex content-end flex-wrap justify-between">
          <div className="ml-6">
            <a href={profileLink}>
              <img
                src={user.avatarSrc || '/assets/images/profile-picture-blank.jpg'}
                alt="Profile picture"
                className="size-24 rounded-full border-2 border-white"
              />
            </a>
          </div>
          <div className="mr-2 flex content-end flex-wrap">
            <Button className="text-white text-xs border border-neutral-100/20 hover:border-neutral-100/40">Message</Button>
            &nbsp;
            <Button onClick={handleSignOut} className="text-white text-xs border border-neutral-100/20 hover:border-neutral-100/40">Sign Out</Button>
          </div>
        </div>
        <div className="ml-6 text-white">
          <h1 className="text-lg my-2">
            Welcome,&nbsp;
            <a href={profileLink} className="font-bold">{user.username || user.id}</a>
          </h1>
        </div>
      </section>
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
