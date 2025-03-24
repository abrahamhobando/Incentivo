import React, { useContext } from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { ColorModeContext } from '../main';
import { motion } from 'framer-motion';

// Iconos minimalistas de sol y luna usando SVG con animación
const SunIcon = () => (
  <motion.svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1, rotate: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
    <motion.path 
      d="M12 4V2" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    />
    <motion.path 
      d="M12 22V20" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
    />
    <motion.path 
      d="M20 12L22 12" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    />
    <motion.path 
      d="M2 12L4 12" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
    />
    <motion.path 
      d="M17.7 6.3L19.1 4.9" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    />
    <motion.path 
      d="M4.9 19.1L6.3 17.7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35 }}
    />
    <motion.path 
      d="M17.7 17.7L19.1 19.1" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    />
    <motion.path 
      d="M4.9 4.9L6.3 6.3" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45 }}
    />
  </motion.svg>
);

const MoonIcon = () => (
  <motion.svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1, rotate: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <motion.path 
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  </motion.svg>
);

const ThemeToggle = () => {
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  return (
    <Tooltip title={mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton 
          onClick={toggleColorMode} 
          color="inherit" 
          aria-label="toggle theme"
          sx={{
            transition: 'background-color 0.3s',
            '&:hover': {
              backgroundColor: mode === 'light' 
                ? 'rgba(0, 0, 0, 0.08)' 
                : 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          {mode === 'light' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default ThemeToggle;