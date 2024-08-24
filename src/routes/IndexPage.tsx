import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SessionContext } from '@/contexts/SessionContext';
import { Button } from '@/components/Button.tsx';
import { Drawer, IconButton } from '@mui/material';
import { Icon } from '@iconify-icon/react';
import SidebarMenu from '@/components/SidebarMenu.tsx';

function UserWelcomeScreen() {
  const { user } = useContext(SessionContext);
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  if (!user) return null;

  const profileLink = `/profile/${user.id}`;

  return (
    <section className="min-h-svh bg-neutral-50">
      <section className="flex content-start flex-wrap justify-end bg-gradient-to-r from-orange-300 to-rose-300 rounded-b-2xl h-32">
        <IconButton aria-label="Menu" size="large" onClick={toggleDrawer(true)}>
          <Icon icon="solar:menu-dots-bold" className="text-white" />
        </IconButton>
        <Drawer
          open={open}
          onClose={toggleDrawer(false)}
          anchor="right"
          classes={{
            paper: '!bg-neutral-800/80 backdrop-blur-lg',
          }}
        >
          <SidebarMenu />
        </Drawer>
      </section>
      <section className="-mt-12 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
        <div className="flex content-end flex-wrap justify-between">
          <div className="ml-6">
            <a href={profileLink}>
              <img
                src={user.avatarSrc || '/assets/images/profile-picture-blank.jpg'}
                alt="Profile picture"
                className="size-24 md:size-36 rounded-full border-2 border-white shadow-sm"
              />
            </a>
          </div>
          <div className="mr-2 flex content-end flex-wrap">
            <Button className="bg-neutral-50/30 text-neutral-600 hover:text-neutral-500 text-xs border border-neutral-800/20 hover:border-neutral-600/20">Message</Button>
          </div>
        </div>
        <div className="ml-6 text-neutral-600">
          <h1 className="my-2">
            <span className="text-sm md:text-lg">Welcome,&nbsp;</span>
            <Link to={profileLink} className="text-md md:text-lg font-semibold hover:text-primary">{user.username || user.id}</Link>
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
