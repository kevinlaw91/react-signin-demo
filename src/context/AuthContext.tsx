import React, { createContext } from 'react';

export type AuthenticatedUser = {
  id: string;
};

interface IAuthContext {
  activeUser: null | AuthenticatedUser;
  setActiveUser: React.Dispatch<React.SetStateAction<null | AuthenticatedUser>>;
}

const AuthContext = createContext<IAuthContext>({
  activeUser: null,
  setActiveUser: () => {},
});

export default AuthContext;
