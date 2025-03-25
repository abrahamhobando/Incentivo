import React, { useContext } from 'react';
import { Box, Paper, Typography, alpha, useTheme } from '@mui/material';
import { ColorModeContext } from '../main';

const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);

  if (!active || !payload || !payload.length) {
    return null;
  }

  // Estilos condicionales basados en el modo del tema
  const tooltipStyles = {
    backgroundColor: mode === 'dark' 
      ? alpha(theme.palette.background.paper, 0.9) 
      : '#fff',
    border: `1px solid ${mode === 'dark' 
      ? alpha(theme.palette.divider, 0.2) 
      : alpha(theme.palette.divider, 0.5)}`,
    boxShadow: mode === 'dark'
      ? `0 2px 10px ${alpha(theme.palette.common.black, 0.5)}`
      : `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
    color: mode === 'dark' 
      ? theme.palette.text.primary 
      : '#333',
    borderRadius: 2,
    padding: '8px 12px',
  };

  return (
    <Paper elevation={0} sx={tooltipStyles}>
      <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
        {label}
      </Typography>
      {payload.map((entry, index) => (
        <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box 
            component="span" 
            sx={{ 
              width: 12, 
              height: 12, 
              backgroundColor: entry.color || entry.fill, 
              mr: 1,
              borderRadius: '2px'
            }} 
          />
          <Typography variant="body2" component="span" sx={{ mr: 1 }}>
            {entry.name}: 
          </Typography>
          <Typography variant="body2" component="span" sx={{ fontWeight: 'medium' }}>
            {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            {entry.unit || ''}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default CustomTooltip;