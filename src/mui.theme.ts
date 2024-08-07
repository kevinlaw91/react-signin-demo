import { createTheme } from '@mui/material/styles';
import { colors } from '../tailwind.config.js';

interface TailwindColor { [key: string]: string }
interface TailwindColors { [key: string]: TailwindColor }

export const theme = createTheme({
  palette: {
    primary: {
      main: (colors as TailwindColors).primary.DEFAULT,
    },
  },
});
