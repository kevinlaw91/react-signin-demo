import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import AuthContext, { AuthenticatedUser } from '@/context/AuthContext.tsx';
import router from '@/router.tsx';
import '@/index.css';

export default function App() {
  const [activeUser, setActiveUser] = useState<null | AuthenticatedUser>(null);

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}
