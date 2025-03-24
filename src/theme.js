import { createTheme } from '@mui/material/styles';

// Tema claro (predeterminado)
const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#1a5f7a',  // Azul oscuro moderno
      light: '#3d8ba4',
      dark: '#0d3b4d',
    },
    secondary: {
      main: '#2c6e49',  // Verde oscuro moderno
      light: '#4d8c69',
      dark: '#1a4d33',
    },
    taskTypes: {
      PRA: '#e0f2f1',
      Validation: '#e8f5e9',
      "STD Times": '#fff8e1',
      "Entrenamientos (Recibe)": '#e1f5fe',
      "Entrenamientos (Brinda)": '#f8bbd0',
      "Práctica de procesos": '#c8e6c9',
      "Refrescamientos (Brinda)": '#ffccbc'
    },
    success: {
      main: '#a5d6a7',  // Verde pastel
      light: '#c8e6c9',
      dark: '#75a478',
    },
    error: {
      main: '#ef9a9a',  // Rojo pastel
      light: '#ffcdd2',
      dark: '#b71c1c',
    },
    info: {
      main: '#90caf9',  // Azul pastel
      light: '#bbdefb',
      dark: '#1976d2',
    },
    warning: {
      main: '#ffcc80',  // Naranja pastel
      light: '#ffe0b2',
      dark: '#f57c00',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

// Tema oscuro
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#64b5f6',
      light: '#90caf9',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#b388ff',
      light: '#d1c4e9',
      dark: '#7c4dff',
    },
    taskTypes: {
      PRA: '#2c4356',
      Validation: '#4a3f6b',
      "STD Times": '#4e4238',
      "Entrenamientos (Recibe)": '#1e4d6b',
      "Entrenamientos (Brinda)": '#614b5e',
      "Práctica de procesos": '#2d4a3e',
      "Refrescamientos (Brinda)": '#5c4037',
    },
    success: {
      main: '#81c784',  // Verde pastel oscuro
      light: '#a5d6a7',
      dark: '#388e3c',
    },
    error: {
      main: '#e57373',  // Rojo pastel oscuro
      light: '#ef9a9a',
      dark: '#c62828',
    },
    info: {
      main: '#64b5f6',  // Azul pastel oscuro
      light: '#90caf9',
      dark: '#1565c0',
    },
    warning: {
      main: '#ffb74d',  // Naranja pastel oscuro
      light: '#ffcc80',
      dark: '#ef6c00',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(255,255,255,0.1)',
          },
        },
        contained: {
          boxShadow: '0 1px 3px rgba(255,255,255,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255,255,255,0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

const themes = {
  light: lightTheme,
  dark: darkTheme
};

export { themes };
export default lightTheme;