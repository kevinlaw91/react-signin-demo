import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { SessionContext } from '@/contexts/SessionContext';
import { Button } from '@/components/Button.tsx';
import { Drawer, IconButton } from '@mui/material';
import { Icon } from '@iconify-icon/react';
import { SidebarMenu } from '@/components/SidebarMenu';
import { motion } from 'motion/react';
import { handleDbUpgrade, INDEXEDDB_DBNAME, INDEXEDDB_VERSION } from '@/services/indexeddb.ts';
import { loadSavedAvatar } from '@/features/profile/avatar.ts';
import srcBlankProfileImage from '/assets/images/profile-picture-blank.jpg';

function UserWelcomeScreen() {
  const { user, updateSessionUser } = useContext(SessionContext);
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const loadAvatar = useCallback((event: Event) => {
    loadSavedAvatar(event)
      .then((blob) => {
        // Update avatar in session
        if (blob) {
          updateSessionUser({
            _avatarBlob: blob,
            // Generate object url for loaded image blob
            avatarSrc: URL.createObjectURL(blob),
          });
        }
        return;
      })
      .catch((err) => {
        console.error(err);
      });
  }, [updateSessionUser]);

  useEffect(() => {
    // Load saved avatar from IndexedDB
    if (!user?.avatarSrc) {
      // Check IndexedDB support
      if (!indexedDB) return;
      const dbHandle = indexedDB.open(INDEXEDDB_DBNAME, INDEXEDDB_VERSION);
      dbHandle.onupgradeneeded = handleDbUpgrade;
      dbHandle.onsuccess = loadAvatar;
    }

    // Load avatar onmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return null;

  const profileLink = `/profile/${user.id}`;

  return (
    <section className="min-h-svh min-w-[320px] bg-linear-to-b from-neutral-50 to-amber-50">
      <title>
        {`Welcome ${(user?.username || user?.id) ? `, ${user?.username || user?.id}` : ''}`}
      </title>
      <section className="flex content-start flex-wrap justify-end bg-linear-to-r from-orange-800 via-orange-500 to-amber-500 rounded-b-2xl h-32">
        <IconButton aria-label="Menu" size="large" onClick={toggleDrawer(true)}>
          <Icon icon="solar:menu-dots-bold" className="text-white" />
        </IconButton>
      </section>
      <section className="-mt-12 mx-auto md:mx-16">
        <div className="flex content-end flex-wrap justify-between">
          <div className="ml-6 rounded-full border-4 border-white shadow-xs overflow-hidden">
            <a href={profileLink}>
              <img
                src={user.avatarSrc || srcBlankProfileImage}
                alt="Profile picture"
                className="size-24 md:size-36"
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
      <section className="mx-2 md:mx-8">
        <section className="relative h-[300px] my-6 px-8 py-12 rounded-lg shadow-lg bg-linear-to-tr from-neutral-800 via-neutral-950 via-70% to-orange-950 overflow-hidden">
          <div className="h-[100px] w-[100px] border-2 border-white/10 absolute right-[5%] -bottom-[30px] rotate-45" role="presentation"></div>
          <h2 className="font-bold text-3xl text-white">Basic Plan</h2>
          <div className="my-6">
            <Button className="text-white hover:text-white text-xs border border-white/20 hover:border-white/50">Upgrade</Button>
          </div>
          <div className="my-6">
            <div className="h-[1px] bg-linear-to-r from-neutral-200/30 to-neutral-200/10" />
          </div>
        </section>
      </section>
      <section className="mt-16 mb-24 mx-2 md:mx-8">
        <h2 className="inline-block font-bold text-3xl bg-clip-text text-transparent bg-linear-to-r from-amber-800 to-orange-600 px-6">Discover</h2>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.4 } },
          }}
          initial="hidden"
          animate="visible"
          whileInView="visible"
          viewport={{ once: true }}
          className="my-6 grid auto-rows-[260px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4"
        >
          {Array(4).fill(0).map((_, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { duration: 1 } },
              }}
              className="bg-neutral-200 rounded-lg"
            />
          ))}
        </motion.div>
      </section>
      <section className="mx-2 md:mx-8 my-16 text-center text-neutral-500">
        <p className="text-sm">
          <>Made by </>
          <span className="font-semibold">Kevin Law</span>
        </p>
        <div className="my-2">
          <a href="https://www.github.com/kevinlaw91" title="GitHub" target="_blank" rel="noreferrer">
            <Icon icon="mdi:github" className="text-neutral-500 hover:text-[#181717] transition-colors" width="36" />
          </a>
          <a href="https://www.linkedin.com/in/kevinlawchinhao/" title="LinkedIn" target="_blank" rel="noreferrer">
            <Icon icon="mdi:linkedin" className="text-neutral-500 hover:text-[#0077B5] transition-colors" width="36" />
          </a>
        </div>
      </section>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        classes={{
          paper: 'bg-neutral-800/80 backdrop-blur-lg',
        }}
      >
        <SidebarMenu />
      </Drawer>
    </section>
  );
}

export function Component() {
  const navigate = useNavigate();
  const { user } = useContext(SessionContext);

  useEffect(() => {
    // Redirect to sign in form if not signed in
    if (!user) void navigate('/signin', { replace: true });
  }, [navigate, user]);

  if (!user) return null;

  return (
    <UserWelcomeScreen />
  );
}

Component.displayName = 'IndexPage';
