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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
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

  return (
    <Card>
      <CardContent>
        <List sx={{ width: '100%' }}>
          {employees.map((employee, index) => (
            <React.Fragment key={employee.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="primary" />
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
                        sx={{ cursor: 'pointer' }}
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
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(employee.id)}
                        size="small"
                      >
                        <DeleteIcon />
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