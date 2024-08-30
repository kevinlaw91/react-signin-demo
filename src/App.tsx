import { RouterProvider } from 'react-router-dom';
import { UserSessionProvider } from '@/contexts/SessionContext';
import { PopupManagerProvider } from '@/contexts/PopupModalManagerContext.tsx';
import router from '@/router.tsx';
import { HelmetProvider } from 'react-helmet-async';
import '@/index.css';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { theme } from '@/mui.theme.ts';
import { ModalOverlay } from '@/components/ModalOverlay.tsx';

export default function App() {
  return (
    <HelmetProvider>
      {/*
      <StyledEngineProvider>
      Fix CSS injection order so that tailwind classes are applied to MUI without needing setting important
      See: https://mui.com/material-ui/integrations/interoperability/#setup
      */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <PopupManagerProvider>
            <UserSessionProvider>
              <RouterProvider router={router} />
              <ModalOverlay />
            </UserSessionProvider>
          </PopupManagerProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </HelmetProvider>
  );
}
