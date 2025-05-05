import { createContext, ReactNode, useCallback, useState } from 'react';
import { clearUserData } from '@/features/profile/userdata.ts';
import { clearBrowserSession } from '@/features/account/signin/utils.ts';

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
  // Load saved username
  const username = localStorage.getItem('demo:username');

  // Load session data from browser storage
  // For offline demo only
  // In real world session will be passed in http-only cookie
  const sessionUser = localStorage.getItem('SESSION_USER_ID');

  const activeSession = sessionUser
    ? {
        id: sessionUser,
        username: username?.trim(),
      }
    : null;

  const [sessionUserMetadata, setSessionUserMetadata] = useState<Partial<SessionUserMetadata> | null>(activeSession);

  const updateSessionUser = useCallback((metadata: Partial<SessionUserMetadata>) => {
    setSessionUserMetadata(currentUserMetadata => ({
      ...currentUserMetadata,
      ...metadata,
    }));
  }, []);

  const clearSession = useCallback(() => {
    // Clear saved user data from local storage
    clearUserData();

    // Clear SESSION_USER_ID in browser storage to indicate no active session
    clearBrowserSession();

    // Clear app current session state
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
