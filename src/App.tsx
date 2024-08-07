import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import AuthContext, { AuthenticatedUser } from '@/contexts/AuthContext.tsx';
import router from '@/router.tsx';
import '@/index.css';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/mui.theme.ts';

export default function App() {
  const [activeUser, setActiveUser] = useState<null | AuthenticatedUser>(null);

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ activeUser, setActiveUser }}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
