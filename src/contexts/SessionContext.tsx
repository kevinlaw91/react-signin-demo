import { ReactNode, createContext, useState, useRef, useCallback } from 'react';

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
  clearSession: () => void;
}

const SessionContext = createContext<ISessionContext>({
  user: undefined,
  updateSessionUser: () => {},
  clearSession: () => {},
});

const UserSessionProvider = ({ children }: { children: ReactNode }) => {
  const rememberedSession = useRef<Partial<SessionUserMetadata> | undefined>();
  const storedUsername = sessionStorage.getItem('user:1234:username');

  if (storedUsername && storedUsername?.trim() !== '') {
    rememberedSession.current = {
      id: '1234',
      username: storedUsername?.trim(),
    };
  }

  const [sessionUserMetadata, setSessionUserMetadata] = useState<Partial<SessionUserMetadata> | undefined>(rememberedSession.current);

  const updateSessionUser = useCallback((metadata: Partial<SessionUserMetadata>) => {
    setSessionUserMetadata(currentUserMetadata => ({
      ...currentUserMetadata,
      ...metadata,
    }));
  }, []);

  const clearSession = useCallback(() => {
    setSessionUserMetadata(undefined);
  }, []);

  return (
    <SessionContext.Provider value={{
      user: sessionUserMetadata,
      updateSessionUser,
      clearSession,
    }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, UserSessionProvider };
