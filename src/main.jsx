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
    }, 1600);
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
                  ? 'linear-gradient(145deg, rgba(241,245,249,1) 0%, rgba(214,229,250,0.8) 100%)' 
                  : 'linear-gradient(145deg, #000000 0%, rgba(39,39,42,0.9) 100%)',
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
                    width: 120,
                    height: 120,
                    borderRadius: 30,
                    background: mode === 'light' 
                      ? 'linear-gradient(135deg, #0A84FF, #5AC8FA)' 
                      : 'linear-gradient(135deg, #0A84FF, #4DA2FF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 32,
                    boxShadow: '0 10px 30px rgba(10, 132, 255, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  animate={{ 
                    rotate: [0, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    repeatType: "mirror",
                    duration: 1.8,
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
                      x: ['-20%', '20%'],
                      y: ['-20%', '20%']
                    }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "mirror",
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <motion.svg 
                    width="56" 
                    height="56" 
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
              <motion.div
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  color: mode === 'light' ? '#000000' : '#FFFFFF',
                  margin: 0,
                  textAlign: 'center',
                  letterSpacing: '-0.02em',
                  marginBottom: 16
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
              </motion.div>
              <motion.div
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: mode === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'center',
                  maxWidth: 260,
                  letterSpacing: '-0.01em',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  delay: 0.6,
                  duration: 0.6,
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