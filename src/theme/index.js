import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Create theme function that handles both light and dark modes
const createAppTheme = (darkMode) => {
  // Create base theme
  let theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#00bcd4',
        light: '#5ddef4',
        dark: '#008ba3',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ff9800',
        light: '#ffc947',
        dark: '#c66900',
        contrastText: '#000000',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        '@media (max-width:600px)': {
          fontSize: '2rem',
        },
      },
      h2: {
        fontSize: '2.2rem',
        '@media (max-width:600px)': {
          fontSize: '1.8rem',
        },
      },
      h3: {
        fontSize: '1.8rem',
        '@media (max-width:600px)': {
          fontSize: '1.5rem',
        },
      },
      h4: {
        fontSize: '1.5rem',
        '@media (max-width:600px)': {
          fontSize: '1.3rem',
        },
      },
      h5: {
        fontSize: '1.3rem',
        '@media (max-width:600px)': {
          fontSize: '1.1rem',
        },
      },
      h6: {
        fontSize: '1.1rem',
        '@media (max-width:600px)': {
          fontSize: '1rem',
        },
      },
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: '16px',
            paddingRight: '16px',
            '@media (min-width:600px)': {
              paddingLeft: '24px',
              paddingRight: '24px',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            overflow: 'hidden',
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    spacing: (factor) => `${0.25 * factor}rem`,
  });

  // Apply responsive font sizes
  theme = responsiveFontSizes(theme);

  return theme;
};

export default createAppTheme; 