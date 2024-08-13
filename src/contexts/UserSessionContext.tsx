import { ReactNode, createContext, useState } from 'react';

export type AuthenticatedUser = {
  id: string;
};

interface IAvatar {
  data?: Blob;
  src: string;
}

interface IUserSessionContext {
  activeUser?: AuthenticatedUser;
  setActiveUser: React.Dispatch<React.SetStateAction<AuthenticatedUser | undefined>>;
  avatarSrc?: string;
  setAvatar: React.Dispatch<React.SetStateAction<IAvatar | undefined>>;
}

const UserSessionContext = createContext<IUserSessionContext>({
  activeUser: undefined,
  setActiveUser: () => {},
  avatarSrc: undefined,
  setAvatar: () => {},
});

const UserSessionProvider = ({ children }: { children: ReactNode }) => {
  const [activeUser, setActiveUser] = useState<AuthenticatedUser>();
  const [avatar, setAvatar] = useState<IAvatar>();

  return (
    <UserSessionContext.Provider value={{
      activeUser,
      setActiveUser,
      avatarSrc: avatar?.src,
      setAvatar,
    }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};

export { UserSessionContext, UserSessionProvider };
