import { ReactNode, createContext, useState, useRef } from 'react';
import { useSessionStorage } from 'react-use';

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
  const [storedSessionUsername] = useSessionStorage<string | undefined>('user:1234:username', '');

  const rememberedSession = useRef<Partial<SessionUserMetadata> | undefined>();

  if (storedSessionUsername?.trim() !== '') {
    rememberedSession.current = {
      id: '1234',
      username: storedSessionUsername?.trim(),
    };
  }

  const [sessionUserMetadata, setSessionUserMetadata] = useState<Partial<SessionUserMetadata> | undefined>(rememberedSession.current);

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
