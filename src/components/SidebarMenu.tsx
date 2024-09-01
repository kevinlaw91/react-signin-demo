import { SyntheticEvent, MouseEventHandler, useCallback, useContext } from 'react';
import { SessionContext } from '@/contexts/SessionContext.tsx';
import { Link, type LinkProps, useNavigate } from 'react-router-dom';
import { Icon, IconifyIconProperties } from '@iconify-icon/react';
import { twMerge } from 'tailwind-merge';

function SidebarMenuProfileCard() {
  const { user } = useContext(SessionContext);

  return (
    <div className="flex m-2 bg-neutral-100/10 rounded-lg">
      <div className="flex content-center justify-center flex-wrap">
        <img
          src={user?.avatarSrc || '/assets/images/profile-picture-blank.jpg'}
          alt="Profile picture"
          className="m-4 object-cover object-center rounded-full h-12 aspect-square"
        />
      </div>
      <div className="pt-4 flex flex-col grow">
        <div>
          <Link to={user?.id ? `/profile/${user.id}` : ''} className="text-md text-white leading-8 font-semibold">{user?.username || user?.id}</Link>
        </div>
        <div className="text-xs leading-none dark:text-neutral-400">Basic Plan</div>
      </div>
    </div>
  );
}

function SidebarMenuItem({ to, href, icon, label, onClick }: {
  to?: LinkProps['to'];
  href?: string;
  icon: IconifyIconProperties['icon'];
  label: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const commonProps = {
    className: twMerge('flex w-fulltext-md mx-2 gap-4 px-8 py-4 text-white rounded-lg hover:bg-white/10 active:bg-primary transition-colors', !to && 'cursor-pointer'),
    onClick,
  };

  const content = (
    <>
      <div className="flex items-center">
        <Icon icon={icon} className="text-inherit -mt-1" height="24" />
      </div>
      <div>{label}</div>
    </>
  );

  return (
    <li>
      {to
        ? (
            <Link to={to} {...commonProps}>
              {content}
            </Link>
          )
        : (
            <a href={href} {...commonProps}>
              {content}
            </a>
          )}
    </li>
  );
}

export function SidebarMenu() {
  const { clearSession } = useContext(SessionContext);
  const navigate = useNavigate();

  const handleSignOut = useCallback((evt: SyntheticEvent) => {
    sessionStorage.removeItem('user:1234:username');
    clearSession();
    navigate('/', { replace: true });
    evt.preventDefault();
    return;
  }, [clearSession, navigate]);

  return (
    <div className="h-full w-[70svw] min-w-[200px] max-w-[350px]">
      <SidebarMenuProfileCard />
      <ul>
        <SidebarMenuItem icon="icon-park-solid:setting-two" label="Settings" />
        <SidebarMenuItem onClick={handleSignOut} icon="ic:twotone-logout" label="Sign Out" />
      </ul>
      <div className="mt-16 px-8 text-neutral-300 text-sm">
        <p>Made by Kevin Law</p>
        <a href="https://www.github.com/kevinlaw91" title="GitHub" target="_blank" rel="noreferrer" className="inline-block m-1 leading-[0] text-neutral-500 hover:text-neutral-300">
          <Icon icon="mdi:github" className="transition-colors" width="24" />
        </a>
        <a href="https://www.linkedin.com/in/kevinlawchinhao/" title="LinkedIn" target="_blank" rel="noreferrer" className="inline-block m-1 leading-[0] text-neutral-500 hover:text-neutral-300">
          <Icon icon="mdi:linkedin" className="transition-colors" width="24" />
        </a>
      </div>
    </div>
  );
}
