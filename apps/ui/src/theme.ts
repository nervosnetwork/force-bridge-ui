import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6b7280',
      light: '#ffffff',
    },
    secondary: {
      main: '#00CC9B',
      light: '#232323',
    },
    text: {
      primary: '#E5E7EB',
      secondary: '#484D4E',
    },
    info: {
      main: '#9b18ef',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    h1: {
      fontSize: 30,
      fontWeight: 500,
      color: '#ffffff',
    },
    h2: {
      fontSize: 18,
      fontWeight: 500,
    },
    body1: {
      fontSize: 16,
      fontWeight: 500,
    },
    body2: {
      fontSize: 14,
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 16,
          borderRadius: '0.375rem',
          ':disabled': {
            color: '#000000',
            backgroundColor: '#484d4e',
          },
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
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(72,77,78,0.4)',
        },
      },
    },
  },
});
