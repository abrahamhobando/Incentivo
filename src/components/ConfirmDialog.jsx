import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  alpha,
  useTheme,
} from '@mui/material';

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  const theme = useTheme();
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle id="confirm-dialog-title">
        <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText id="confirm-dialog-description" sx={{ color: 'text.primary' }}>
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 2, 
        pt: 1,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          variant="text"
          sx={{ 
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="text" 
          autoFocus
          sx={{ 
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;