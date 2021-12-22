import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6b7280',
    },
    secondary: {
      main: '#00CC9B',
      light: '#232323',
    },
    text: {
      primary: '#E5E7EB',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    body1: {
      fontSize: 16,
      fontWeight: 500,
    },
    body2: {
      fontSize: 14,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 16,
          borderRadius: '0.375rem',
        },
        outlined: {
          color: '#ffffff',
          borderColor: '#00CC9B',
        },
        startIcon: {
          width: '1.25rem',
          height: '1.25rem',
          color: '#00CC9B',
        },
      },
    },
  },
});
