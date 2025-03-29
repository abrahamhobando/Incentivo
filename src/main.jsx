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
              transition={{ duration: 0.3 }}
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
                  ? 'linear-gradient(135deg, #F5F5F7 0%, rgba(214,229,250,0.5) 100%)' 
                  : 'linear-gradient(135deg, #000000 0%, rgba(39,39,42,0.7) 100%)',
                zIndex: 9999
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 240, 
                  damping: 20,
                  delay: 0.15
                }}
              >
                <motion.div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, #0A84FF, #5AC8FA)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 28,
                    boxShadow: '0 8px 24px rgba(10, 132, 255, 0.25)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  animate={{ 
                    scale: [1, 1.015, 1]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 1.5,
                    ease: "easeInOut" 
                  }}
                >
                  {/* Efecto de brillo translúcido */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      right: '-50%',
                      bottom: '-50%',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                      opacity: 0.5
                    }}
                    animate={{
                      x: ['-15%', '15%'],
                      y: ['-15%', '15%']
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 2.5,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.svg 
                    width="48" 
                    height="48" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      rotate: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      },
                      scale: {
                        duration: 1.2,
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
              <motion.div
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  color: mode === 'light' ? '#1D1D1F' : '#F5F5F7',
                  margin: 0,
                  textAlign: 'center',
                  letterSpacing: '-0.022em',
                  marginBottom: 12
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.3,
                  duration: 0.5,
                  ease: "easeOut" 
                }}
              >
                Sistema de Asignaciones
              </motion.div>
              <motion.div
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  color: mode === 'light' ? 'rgba(0, 0, 0, 0.65)' : 'rgba(255, 255, 255, 0.65)',
                  textAlign: 'center',
                  maxWidth: 240,
                  letterSpacing: '-0.01em',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  delay: 0.5,
                  duration: 0.5,
                  ease: "easeOut" 
                }}
              >
                Gestión eficiente de tareas y colaboradores
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