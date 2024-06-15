import React, { createContext } from 'react';

export type AuthenticatedUser = {
  id: string;
};

const AuthContext = createContext<{ activeUser: null | AuthenticatedUser; setActiveUser: React.Dispatch<React.SetStateAction<null | AuthenticatedUser>> }>({
  activeUser: null,
  setActiveUser: () => {},
});

export default AuthContext;
