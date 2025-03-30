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
      PRA: 'rgba(187, 222, 251, 0.65)',  // Azul translúcido
      Validation: 'rgba(200, 230, 201, 0.65)',  // Verde translúcido
      "STD Times": 'rgba(255, 245, 157, 0.65)',  // Amarillo translúcido
      "Entrenamientos (Recibe)": 'rgba(179, 229, 252, 0.65)',  // Azul claro translúcido
      "Entrenamientos (Brinda)": 'rgba(248, 187, 208, 0.65)',  // Rosa translúcido
      "Práctica de procesos": 'rgba(165, 214, 167, 0.65)',  // Verde claro translúcido
      "Refrescamientos (Brinda)": 'rgba(255, 171, 145, 0.65)'  // Naranja translúcido
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
      default: '#F5F5F7',  // Fondo gris claro Apple
      paper: 'rgba(255, 255, 255, 0.65)',  // Papel translúcido
    },
    text: {
      primary: '#1D1D1F',  // Color Apple oscuro
      secondary: '#86868B',  // Gris secundario Apple
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Roboto", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.022em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.021em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.018em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.016em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.014em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '-0.006em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 8, // Reducir los bordes redondeados
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          backdropFilter: 'blur(5px)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0A84FF, #5AC8FA)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #5E5CE6, #BF5AF2)',
        },
        outlined: {
          borderWidth: 1,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          borderColor: 'rgba(0, 0, 0, 0.03)',
          boxShadow: '0 1px 5px rgba(0,0,0,0.02)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          '&:hover': {
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(20px) saturate(180%)',
        },
        elevation1: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
        },
        elevation2: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        },
        elevation3: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.18)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0A84FF',
              borderWidth: 1,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(20px)',
          transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          fontWeight: 500,
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #0A84FF, #5AC8FA)',
          color: 'white',
        },
        colorSecondary: {
          background: 'linear-gradient(135deg, #5E5CE6, #BF5AF2)',
          color: 'white',
        },
        colorSuccess: {
          background: 'linear-gradient(135deg, #28CD41, #34D058)',
          color: 'white',
        },
        colorError: {
          background: 'linear-gradient(135deg, #FF3B30, #FF6B6B)',
          color: 'white',
        },
        colorWarning: {
          background: 'linear-gradient(135deg, #FF9500, #FFB340)',
          color: 'white',
        },
        colorInfo: {
          background: 'linear-gradient(135deg, #5AC8FA, #64D2FF)',
          color: 'white',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.6)', 
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 10,
        },
        indicator: {
          height: 3,
          borderRadius: 1.5,
          background: 'linear-gradient(to right, #0A84FF, #5AC8FA)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
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
            letterSpacing: '-0.01em',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          '&:hover': {
            backgroundColor: 'rgba(242, 242, 247, 0.5)',
            backdropFilter: 'blur(20px)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.04)',
          padding: '12px 16px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: '#0A84FF',
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            opacity: 1,
          },
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
      PRA: 'rgba(33, 83, 131, 0.65)',  // Azul oscuro translúcido
      Validation: 'rgba(46, 125, 50, 0.65)',  // Verde oscuro translúcido
      "STD Times": 'rgba(251, 192, 45, 0.65)',  // Amarillo translúcido
      "Entrenamientos (Recibe)": 'rgba(2, 136, 209, 0.65)',  // Azul translúcido 
      "Entrenamientos (Brinda)": 'rgba(194, 24, 91, 0.65)',  // Rosa translúcido
      "Práctica de procesos": 'rgba(56, 142, 60, 0.65)',  // Verde claro translúcido
      "Refrescamientos (Brinda)": 'rgba(230, 74, 25, 0.65)'  // Naranja translúcido
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
      paper: 'rgba(28, 28, 30, 0.65)',  // Gris oscuro translúcido
    },
    text: {
      primary: '#F5F5F7',  // Casi blanco Apple
      secondary: '#98989D',  // Gris iOS
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", "Roboto", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.022em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.021em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.018em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.016em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.014em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '-0.006em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 8, // Reducir los bordes redondeados
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(28, 28, 30, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          backdropFilter: 'blur(5px)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0A84FF, #5AC8FA)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #5E5CE6, #BF5AF2)',
        },
        outlined: {
          borderWidth: 1,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: 'rgba(44, 44, 46, 0.65)',
          borderColor: 'rgba(255, 255, 255, 0.05)',
          boxShadow: '0 1px 5px rgba(0,0,0,0.14)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          '&:hover': {
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
          backgroundColor: 'rgba(44, 44, 46, 0.65)',
          backdropFilter: 'blur(20px) saturate(180%)',
        },
        elevation1: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
        },
        elevation2: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        },
        elevation3: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.22)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(44, 44, 46, 0.65)',
            backdropFilter: 'blur(20px)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.18)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0A84FF',
              borderWidth: 1,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 8,
          backgroundColor: 'rgba(44, 44, 46, 0.65)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(20px)',
          transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          fontWeight: 500,
          border: 'none',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
          }
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #0A84FF, #5AC8FA)',
          color: 'white',
        },
        colorSecondary: {
          background: 'linear-gradient(135deg, #5E5CE6, #BF5AF2)',
          color: 'white',
        },
        colorSuccess: {
          background: 'linear-gradient(135deg, #28CD41, #34D058)',
          color: 'white',
        },
        colorError: {
          background: 'linear-gradient(135deg, #FF3B30, #FF6B6B)',
          color: 'white',
        },
        colorWarning: {
          background: 'linear-gradient(135deg, #FF9500, #FFB340)',
          color: 'white',
        },
        colorInfo: {
          background: 'linear-gradient(135deg, #5AC8FA, #64D2FF)',
          color: 'white',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(44, 44, 46, 0.5)', 
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 10,
        },
        indicator: {
          height: 3,
          borderRadius: 1.5,
          background: 'linear-gradient(to right, #0A84FF, #5AC8FA)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: 'rgba(28, 28, 30, 0.5)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
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
            letterSpacing: '-0.01em',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
          '&:hover': {
            backgroundColor: 'rgba(60, 60, 67, 0.3)',
            backdropFilter: 'blur(20px)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.04)',
          padding: '12px 16px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: '#0A84FF',
                opacity: 1,
                border: 0,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            opacity: 1,
          },
        },
      },
    },
  },
});

const themes = {
  light: lightTheme,
  dark: darkTheme
};
export { themes };export default lightTheme;

