import React, { useState, useEffect } from 'react';
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
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from '@mui/icons-material/Sort';
import { motion } from 'framer-motion';
import { deleteEmployee, updateEmployee } from '../utils/storage';
import ConfirmDialog from './ConfirmDialog';
import EmployeeInfoModal from './EmployeeInfoModal';

const EmployeeList = ({ employees, onEmployeeDeleted }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    employeeId: null,
  });
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [hoveredEmployeeId, setHoveredEmployeeId] = useState(null);
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'asc', 'desc'
  const [sortedEmployees, setSortedEmployees] = useState([]);

  // Ordenar empleados cuando cambia el orden o la lista de empleados
  useEffect(() => {
    let sorted = [...employees];
    
    if (sortOrder === 'asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setSortedEmployees(sorted);
  }, [sortOrder, employees]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

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

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setInfoModalOpen(true);
  };

  const handleCloseInfoModal = () => {
    setInfoModalOpen(false);
  };
  
  const handleMouseEnter = (employeeId) => {
    setHoveredEmployeeId(employeeId);
  };
  
  const handleMouseLeave = () => {
    setHoveredEmployeeId(null);
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
      borderRadius: 1,
      boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(to bottom, rgba(35,35,40,0.8), rgba(25,25,30,0.95))' 
        : 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(250,250,255,0.95))',
      backdropFilter: 'blur(20px)',
    }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Colaboradores ({sortedEmployees.length})
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120, ml: 1 }}>
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            displayEmpty
            variant="outlined"
            startAdornment={<SortIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7, color: 'action.active' }} />}
            sx={{ 
              '& .MuiSelect-select': { 
                px: 1, 
                py: 0.5, 
                fontSize: '0.875rem',
                fontWeight: 500
              },
              '& fieldset': {
                borderColor: alpha(theme.palette.divider, 0.3),
              }
            }}
          >
            <MenuItem value="default">Por defecto</MenuItem>
            <MenuItem value="asc">A-Z</MenuItem>
            <MenuItem value="desc">Z-A</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <CardContent sx={{ p: 0 }}>
        <List sx={{ width: '100%', pt: 0 }}>
          {sortedEmployees.map((employee, index) => (
            <motion.div 
              key={employee.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {index > 0 && <Divider variant="fullWidth" sx={{ opacity: 0.6 }} />}
              <ListItem 
                sx={{
                  py: 1.2,
                  px: 2,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                  cursor: editingId === employee.id ? 'default' : 'pointer',
                }}
                onClick={() => {
                  if (editingId !== employee.id) {
                    handleEmployeeClick(employee);
                  }
                }}
                onMouseEnter={() => handleMouseEnter(employee.id)}
                onMouseLeave={handleMouseLeave}
              >
                <ListItemIcon>
                  <Avatar 
                    sx={{ 
                      bgcolor: getAvatarColor(employee.name),
                      width: 40,
                      height: 40,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      transition: 'all 0.2s ease',
                      ...(hoveredEmployeeId === employee.id && {
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }),
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '16px',
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? alpha(theme.palette.background.paper, 0.15) 
                                : alpha(theme.palette.background.paper, 0.8),
                              backdropFilter: 'blur(8px)',
                              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSave}
                          disabled={!editingName.trim()}
                          sx={{
                            borderRadius: '28px',
                            boxShadow: 'none',
                            px: 2.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                              backgroundColor: theme.palette.primary.dark,
                            }
                          }}
                        >
                          Guardar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleCancel}
                          sx={{
                            borderRadius: '28px',
                            px: 2,
                            fontWeight: 500,
                            textTransform: 'none',
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                              borderColor: theme.palette.primary.dark,
                            }
                          }}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          variant="subtitle1"
                          color="text.primary"
                          sx={{ 
                            fontWeight: 500,
                            fontSize: '1rem',
                            transition: 'color 0.2s ease',
                            ...(hoveredEmployeeId === employee.id && {
                              color: theme.palette.primary.main,
                            }),
                          }}
                        >
                          {employee.name}
                        </Typography>
                        {hoveredEmployeeId === employee.id && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              ml: 1.5,
                              color: theme.palette.primary.main,
                              display: 'flex',
                              alignItems: 'center',
                              opacity: 0.8,
                              transition: 'opacity 0.2s ease',
                            }}
                          >
                            <VisibilityIcon fontSize="inherit" sx={{ mr: 0.5, fontSize: '1rem' }} />
                            Ver detalles
                          </Typography>
                        )}
                      </Box>
                    )
                  }
                />
                <ListItemSecondaryAction>
                  {editingId !== employee.id && (
                    <Box sx={{ 
                      display: 'flex',
                      opacity: hoveredEmployeeId === employee.id ? 1 : 0,
                      transition: 'opacity 0.2s ease-in-out',
                      '.MuiListItem-root:hover &': {
                        opacity: 1
                      }
                    }}>
                      <Tooltip title="Editar" placement="top" arrow>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(employee);
                          }}
                          size="small"
                          sx={{ 
                            mr: 1,
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.08),
                              color: theme.palette.primary.main,
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar" placement="top" arrow>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(employee.id);
                          }}
                          size="small"
                          sx={{ 
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.08),
                              color: theme.palette.error.main,
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  {editingId === employee.id && (
                    <Box sx={{ display: 'flex' }}>
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={handleSave}
                        sx={{ 
                          mr: 1,
                          textTransform: 'none',
                          fontWeight: 500,
                          borderRadius: 1
                        }}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="text"
                        color="inherit"
                        size="small"
                        onClick={handleCancel}
                        sx={{ 
                          textTransform: 'none',
                          fontWeight: 500,
                          borderRadius: 1
                        }}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            </motion.div>
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
      <EmployeeInfoModal 
        open={infoModalOpen}
        employee={selectedEmployee}
        onClose={handleCloseInfoModal}
      />
    </Card>
  );
};

export default EmployeeList;