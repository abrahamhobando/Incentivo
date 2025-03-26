import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  TextField,
  Button,
  Avatar,
  alpha,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteEmployee, updateEmployee } from '../utils/storage';
import ConfirmDialog from './ConfirmDialog';

const EmployeeList = ({ employees, onEmployeeDeleted }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    employeeId: null,
  });

  const handleDeleteClick = (employeeId) => {
    setConfirmDialog({
      open: true,
      employeeId,
    });
  };

  const handleConfirmDelete = () => {
    deleteEmployee(confirmDialog.employeeId);
    setConfirmDialog({
      open: false,
      employeeId: null,
    });
    if (onEmployeeDeleted) onEmployeeDeleted();
  };

  const handleCancelDelete = () => {
    setConfirmDialog({
      open: false,
      employeeId: null,
    });
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setEditingName(employee.name);
  };

  const handleSave = () => {
    if (editingId && editingName.trim()) {
      updateEmployee(editingId, { name: editingName.trim() });
      setEditingId(null);
      setEditingName('');
      if (onEmployeeDeleted) onEmployeeDeleted();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Función para generar un color basado en el nombre
  const getAvatarColor = (name) => {
    const theme = useTheme();
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ];
    
    // Usar la suma de los códigos ASCII de las letras del nombre para determinar el color
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  // Obtener la inicial del nombre
  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const theme = useTheme();

  return (
    <Card sx={{ 
      borderRadius: 3,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    }}>
      <CardContent sx={{ p: 2 }}>
        <List sx={{ width: '100%' }}>
          {employees.map((employee, index) => (
            <React.Fragment key={employee.id}>
              {index > 0 && <Divider variant="middle" sx={{ my: 1 }} />}
              <ListItem 
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                  py: 1,
                }}
              >
                <ListItemIcon>
                  <Avatar 
                    sx={{ 
                      bgcolor: getAvatarColor(employee.name),
                      width: 40,
                      height: 40,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {getInitial(employee.name)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    editingId === employee.id ? (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          size="small"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          autoFocus
                          fullWidth
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSave}
                          disabled={!editingName.trim()}
                        >
                          Guardar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleCancel}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    ) : (
                      <Typography
                        variant="subtitle1"
                        color="text.primary"
                        sx={{ 
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '1rem',
                          letterSpacing: '0.2px',
                        }}
                        onClick={() => handleEdit(employee)}
                      >
                        {employee.name}
                      </Typography>
                    )
                  }
                />
                <ListItemSecondaryAction>
                  {editingId !== employee.id && (
                    <>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEdit(employee)}
                        size="small"
                        sx={{ 
                          mr: 1,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(employee.id)}
                        size="small"
                        sx={{ 
                          color: theme.palette.error.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este empleado? Esta acción no se puede deshacer y también eliminará todas las tareas asociadas a este empleado."
      />
    </Card>
  );
};

export default EmployeeList;