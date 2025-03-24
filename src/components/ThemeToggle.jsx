import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { ColorModeContext } from '../main';

// Iconos minimalistas de sol y luna usando SVG
const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
    <path d="M12 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 22V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 12L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 12L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17.7 6.3L19.1 4.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4.9 19.1L6.3 17.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17.7 17.7L19.1 19.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4.9 4.9L6.3 6.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ThemeToggle = () => {
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  return (
    <Tooltip title={mode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
      <IconButton onClick={toggleColorMode} color="inherit" aria-label="toggle theme">
        {mode === 'light' ? <MoonIcon /> : <SunIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;