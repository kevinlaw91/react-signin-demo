import { createTheme } from '@mui/material/styles';

// Integrate tailwind theme into MUI theme
export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: 'var(--color-primary)',
          light: 'var(--color-primary-400)',
          dark: 'var(--color-primary-800)',
        },
        secondary: {
          main: 'var(--color-secondary)',
          light: 'var(--color-secondary-400)',
          dark: 'var(--color-secondary-800)',
        },
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-sans)',
  },
});
