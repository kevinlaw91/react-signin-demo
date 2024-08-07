import { createTheme } from '@mui/material/styles';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfigFile from '../tailwind.config.js';

interface TailwindColor { [key: string]: string }
interface TailwindColors { [key: string]: TailwindColor }

const tailwindConfig = resolveConfig(tailwindConfigFile);
const twColors: TailwindColors = tailwindConfig.theme.colors as unknown as TailwindColors;

// Integrate tailwind theme into MUI theme
export const theme = createTheme({
  palette: {
    primary: {
      main: twColors.primary.DEFAULT,
      light: twColors.primary['400'],
      dark: twColors.primary['800'],
    },
    secondary: {
      main: twColors.secondary.DEFAULT,
      light: twColors.secondary['400'],
      dark: twColors.secondary['800'],
    },
  },
  typography: {
    fontFamily: tailwindConfig.theme.fontFamily['sans'].join(','),
  },
});
