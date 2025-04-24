import { RouterProvider } from 'react-router-dom';
import { UserSessionProvider } from '@/contexts/SessionContext';
import router from '@/router.tsx';
import { HelmetProvider } from 'react-helmet-async';
import '@/index.css';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { theme } from '@/mui.theme.ts';

export default function App() {
  return (
    <HelmetProvider>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <ThemeProvider theme={theme}>
          <UserSessionProvider>
            <RouterProvider router={router} />
          </UserSessionProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </HelmetProvider>
  );
}
