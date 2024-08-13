import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import AuthContext, { AuthenticatedUser } from '@/contexts/AuthContext.tsx';
import { PopupManagerProvider } from '@/contexts/PopupModalManagerContext.tsx';
import router from '@/router.tsx';
import { HelmetProvider } from 'react-helmet-async';
import '@/index.css';
import { CssVarsProvider } from '@mui/material/styles';
import { theme } from '@/mui.theme.ts';
import { ModalOverlay } from '@/components/ModalOverlay.tsx';
import { ModalsContainer } from '@/components/ModalsContainer.tsx';

export default function App() {
  const [activeUser, setActiveUser] = useState<null | AuthenticatedUser>(null);

  return (
    <HelmetProvider>
      <CssVarsProvider theme={theme}>
        <PopupManagerProvider>
          <AuthContext.Provider value={{ activeUser, setActiveUser }}>
            <RouterProvider router={router} />
            <ModalOverlay />
            <ModalsContainer />
          </AuthContext.Provider>
        </PopupManagerProvider>
      </CssVarsProvider>
    </HelmetProvider>
  );
}
