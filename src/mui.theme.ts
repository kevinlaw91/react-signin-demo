import { createTheme } from '@mui/material/styles';

// Integrate tailwind theme into MUI theme
export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: 'rgb(var(--color-primary))',
          light: 'rgb(var(--color-primary-400))',
          dark: 'rgb(var(--color-primary-800))',
        },
        secondary: {
          main: 'rgb(var(--color-secondary))',
          light: 'rgb(var(--color-secondary-400))',
          dark: 'rgb(var(--color-secondary-800))',
        },
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-sans)',
  },
});
