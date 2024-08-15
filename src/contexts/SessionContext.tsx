import { ReactNode, createContext, useState } from 'react';

export type SessionUserMetadata = {
  id: string;
  username: string;
  avatarSrc: string;
  // BELOW ARE DEMO ONLY - DO NOT USE
  _avatarBlob: Blob;
};

interface ISessionContext {
  user?: Partial<SessionUserMetadata>;
  updateSessionUser: (metadata: Partial<SessionUserMetadata>) => void;
}

const SessionContext = createContext<ISessionContext>({
  user: undefined,
  updateSessionUser: () => {},
});

const UserSessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionUserMetadata, setSessionUserMetadata] = useState<Partial<SessionUserMetadata>>();

  const updateSessionUser = (metadata: Partial<SessionUserMetadata>) => {
    setSessionUserMetadata(currentUserMetadata => ({
      ...currentUserMetadata,
      ...metadata,
    }));
  };

  return (
    <SessionContext.Provider value={{
      user: sessionUserMetadata,
      updateSessionUser,
    }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, UserSessionProvider };
