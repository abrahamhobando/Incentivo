import React, { useState, useMemo, createContext, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import { themes } from './theme'
import { motion, AnimatePresence } from 'framer-motion'

// Crear contexto para el tema
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light',
})

const ThemeApp = () => {
  // Obtener el tema guardado en localStorage o usar 'light' por defecto
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  // Estado para controlar la animación inicial
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para simular carga y mostrar animación
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Guardar el tema en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(() => themes[mode], [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.default,
                zIndex: 9999
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.2
                }}
              >
                <motion.div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 16,
                    backgroundColor: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24
                  }}
                  animate={{ 
                    rotate: [0, 10, 0, -10, 0],
                    scale: [1, 1.05, 1, 1.05, 1]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 2,
                    ease: "easeInOut" 
                  }}
                >
                  <motion.svg 
                    width="40" 
                    height="40" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear"
                      },
                      scale: {
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="white"/>
                  </motion.svg>
                </motion.div>
              </motion.div>
              <motion.h1
                style={{
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  margin: 0
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.4,
                  duration: 0.6,
                  ease: "easeOut" 
                }}
              >
                Sistema de Asignaciones
              </motion.h1>
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: '100%', height: '100%' }}
            >
              <App />
            </motion.div>
          )}
        </AnimatePresence>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeApp />
  </React.StrictMode>,
)