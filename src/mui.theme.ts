import { createTheme } from '@mui/material/styles';
import twConfig from '@/utils/twConfig.ts';

const colors = twConfig.theme.colors;

// Integrate tailwind theme into MUI theme
export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: colors.primary.DEFAULT,
          light: colors.primary['400'],
          dark: colors.primary['800'],
        },
        secondary: {
          main: colors.secondary.DEFAULT,
          light: colors.secondary['400'],
          dark: colors.secondary['800'],
        },
      },
    },
  },
  typography: {
    fontFamily: twConfig.theme.fontFamily['sans'].join(','),
  },
});
