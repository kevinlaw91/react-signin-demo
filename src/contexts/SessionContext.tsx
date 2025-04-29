import { ReactNode, createContext, useState, useRef, useCallback } from 'react';

export type SessionUserMetadata = {
  id: string;
  username: string;
  avatarSrc: string;
  // BELOW ARE DEMO ONLY - DO NOT USE
  _avatarBlob: Blob | null;
};

interface ISessionContext {
  user: Partial<SessionUserMetadata> | null;
  updateSessionUser: (metadata: Partial<SessionUserMetadata>) => void;
  clearSession: () => void;
}

const SessionContext = createContext<ISessionContext>({
  user: null,
  updateSessionUser: () => {},
  clearSession: () => {},
});

const UserSessionProvider = ({ children }: { children: ReactNode }) => {
  const rememberedSession = useRef<Partial<SessionUserMetadata>>(null);
  const storedUsername = sessionStorage.getItem('user:1234:username');

  if (storedUsername && storedUsername?.trim() !== '') {
    rememberedSession.current = {
      id: '1234',
      username: storedUsername?.trim(),
    };
  }

  const [sessionUserMetadata, setSessionUserMetadata] = useState<Partial<SessionUserMetadata> | null>(rememberedSession.current);

  const updateSessionUser = useCallback((metadata: Partial<SessionUserMetadata>) => {
    setSessionUserMetadata(currentUserMetadata => ({
      ...currentUserMetadata,
      ...metadata,
    }));
  }, []);

  const clearSession = useCallback(() => {
    setSessionUserMetadata(null);
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
