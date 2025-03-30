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
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Guardar el tema en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    
    // Emitir un evento personalizado cuando cambie el tema
    // para que el script en index.html pueda actualizar el favicon
    document.dispatchEvent(
      new CustomEvent('themeChanged', { detail: { mode } })
    );
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
                background: mode === 'light' 
                  ? '#FFFFFF' 
                  : '#000000',
                zIndex: 9999
              }}
            >
              <motion.div
                style={{
                  position: 'relative',
                  width: 36,
                  height: 36,
                  marginBottom: 24
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  ease: 'easeOut'
                }}
              >
                {/* Spinner ultra minimalista */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: `1.5px solid ${mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'}`,
                    borderTopColor: mode === 'light' ? '#0A84FF' : '#0A84FF',
                    boxSizing: 'border-box'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    ease: "linear",
                    repeat: Infinity
                  }}
                />
              </motion.div>
              
              <motion.div
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: mode === 'light' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
                  textAlign: 'center',
                  letterSpacing: '-0.015em'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  delay: 0.2,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                Sistema de Asignaciones
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
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