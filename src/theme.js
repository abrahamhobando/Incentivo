import { createTheme } from '@mui/material/styles';

// Tema claro (estilo Apple)
const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#0A84FF',  // Azul iOS
      light: '#5AC8FA',
      dark: '#007AFF',
    },
    secondary: {
      main: '#5E5CE6',  // Violeta iOS
      light: '#BF5AF2',
      dark: '#5E5CE6',
    },
    taskTypes: {
      PRA: 'rgba(187, 222, 251, 0.8)',  // Azul translúcido
      Validation: 'rgba(200, 230, 201, 0.8)',  // Verde translúcido
      "STD Times": 'rgba(255, 245, 157, 0.8)',  // Amarillo translúcido
      "Entrenamientos (Recibe)": 'rgba(179, 229, 252, 0.8)',  // Azul claro translúcido
      "Entrenamientos (Brinda)": 'rgba(248, 187, 208, 0.8)',  // Rosa translúcido
      "Práctica de procesos": 'rgba(165, 214, 167, 0.8)',  // Verde claro translúcido
      "Refrescamientos (Brinda)": 'rgba(255, 171, 145, 0.8)'  // Naranja translúcido
    },
    success: {
      main: '#34C759',  // Verde iOS
      light: '#34C759',
      dark: '#248A3D',
    },
    error: {
      main: '#FF3B30',  // Rojo iOS
      light: '#FF6B6B',
      dark: '#D70015',
    },
    info: {
      main: '#5AC8FA',  // Azul claro iOS
      light: '#64D2FF',
      dark: '#0A84FF',
    },
    warning: {
      main: '#FF9500',  // Naranja iOS
      light: '#FFB340',
      dark: '#C93400',
    },
    background: {
      default: '#F2F2F7',  // Fondo gris claro iOS
      paper: 'rgba(255, 255, 255, 0.8)',  // Papel translúcido
    },
    text: {
      primary: '#000000',
      secondary: '#8E8E93',  // Gris iOS
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Roboto", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.008em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.008em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '-0.003em',
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '-0.003em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.003em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          backdropFilter: 'blur(5px)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(to right, #0A84FF, #4DA2FF)',
        },
        containedSecondary: {
          backgroundImage: 'linear-gradient(to right, #5E5CE6, #BF5AF2)',
        },
        outlined: {
          borderWidth: 1.5,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderColor: 'rgba(0, 0, 0, 0.05)',
          boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
        },
        elevation1: {
          boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
        },
        elevation2: {
          boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
        },
        elevation3: {
          boxShadow: '0 6px 14px rgba(0,0,0,0.07)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0A84FF',
              borderWidth: 1.5,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease-in-out',
          fontWeight: 500,
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }
        },
        colorPrimary: {
          background: 'linear-gradient(to right, #0A84FF, #4DA2FF)',
          color: 'white',
        },
        colorSecondary: {
          background: 'linear-gradient(to right, #5E5CE6, #BF5AF2)',
          color: 'white',
        },
        colorSuccess: {
          background: 'linear-gradient(to right, #28CD41, #34D058)',
          color: 'white',
        },
        colorError: {
          background: 'linear-gradient(to right, #FF3B30, #FF6B6B)',
          color: 'white',
        },
        colorWarning: {
          background: 'linear-gradient(to right, #FF9500, #FFB340)',
          color: 'white',
        },
        colorInfo: {
          background: 'linear-gradient(to right, #5AC8FA, #64D2FF)',
          color: 'white',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
        },
        indicator: {
          height: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, #0A84FF, #4DA2FF)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'rgba(250, 250, 250, 0.7)',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(242, 242, 247, 0.6)',
            backdropFilter: 'blur(10px)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

// Tema oscuro (estilo Apple)
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0A84FF',  // Azul iOS
      light: '#5AC8FA',
      dark: '#0A84FF',
    },
    secondary: {
      main: '#5E5CE6',  // Violeta iOS
      light: '#BF5AF2',
      dark: '#5E5CE6',
    },
    taskTypes: {
      PRA: 'rgba(33, 83, 131, 0.8)',  // Azul oscuro translúcido
      Validation: 'rgba(46, 125, 50, 0.8)',  // Verde oscuro translúcido
      "STD Times": 'rgba(251, 192, 45, 0.8)',  // Amarillo translúcido
      "Entrenamientos (Recibe)": 'rgba(2, 136, 209, 0.8)',  // Azul translúcido 
      "Entrenamientos (Brinda)": 'rgba(194, 24, 91, 0.8)',  // Rosa translúcido
      "Práctica de procesos": 'rgba(56, 142, 60, 0.8)',  // Verde claro translúcido
      "Refrescamientos (Brinda)": 'rgba(230, 74, 25, 0.8)'  // Naranja translúcido
    },
    success: {
      main: '#30D158',  // Verde iOS oscuro
      light: '#34C759',
      dark: '#248A3D',
    },
    error: {
      main: '#FF453A',  // Rojo iOS oscuro
      light: '#FF6961',
      dark: '#D70015',
    },
    info: {
      main: '#5AC8FA',  // Azul claro iOS oscuro
      light: '#64D2FF',
      dark: '#0A84FF',
    },
    warning: {
      main: '#FF9F0A',  // Naranja iOS oscuro
      light: '#FFBD59',
      dark: '#C93400',
    },
    background: {
      default: '#000000',  // Negro puro iOS
      paper: 'rgba(28, 28, 30, 0.85)',  // Gris oscuro translúcido
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8E8E93',  // Gris iOS
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Roboto", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.008em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.008em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '-0.003em',
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '-0.003em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.003em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(28, 28, 30, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          backdropFilter: 'blur(5px)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          },
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(to right, #0A84FF, #4DA2FF)',
        },
        containedSecondary: {
          backgroundImage: 'linear-gradient(to right, #5E5CE6, #BF5AF2)',
        },
        outlined: {
          borderWidth: 1.5,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(44, 44, 46, 0.7)',
          borderColor: 'rgba(255, 255, 255, 0.05)',
          boxShadow: '0 2px 14px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 18px rgba(0,0,0,0.3)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundImage: 'none',
          backgroundColor: 'rgba(44, 44, 46, 0.7)',
          backdropFilter: 'blur(10px)',
        },
        elevation1: {
          boxShadow: '0 2px 14px rgba(0,0,0,0.25)',
        },
        elevation2: {
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
        },
        elevation3: {
          boxShadow: '0 6px 14px rgba(0,0,0,0.35)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(44, 44, 46, 0.6)',
            backdropFilter: 'blur(8px)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0A84FF',
              borderWidth: 1.5,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 12,
          backgroundColor: 'rgba(44, 44, 46, 0.6)',
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease-in-out',
          fontWeight: 500,
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }
        },
        colorPrimary: {
          background: 'linear-gradient(to right, #0A84FF, #4DA2FF)',
          color: 'white',
        },
        colorSecondary: {
          background: 'linear-gradient(to right, #5E5CE6, #BF5AF2)',
          color: 'white',
        },
        colorSuccess: {
          background: 'linear-gradient(to right, #28CD41, #34D058)',
          color: 'white',
        },
        colorError: {
          background: 'linear-gradient(to right, #FF3B30, #FF6B6B)',
          color: 'white',
        },
        colorWarning: {
          background: 'linear-gradient(to right, #FF9500, #FFB340)',
          color: 'white',
        },
        colorInfo: {
          background: 'linear-gradient(to right, #5AC8FA, #64D2FF)',
          color: 'white',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(44, 44, 46, 0.5)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
        },
        indicator: {
          height: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, #0A84FF, #4DA2FF)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(28, 28, 30, 0.5)',
          boxShadow: '0 2px 14px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: 'rgba(44, 44, 46, 0.7)',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(44, 44, 46, 0.3)',
            backdropFilter: 'blur(10px)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.05)',
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