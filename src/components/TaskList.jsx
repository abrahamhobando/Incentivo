import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteTask, getTasks, saveTasks } from '../utils/storage';
import TaskDialog from './TaskDialog';
import ConfirmDialog from './ConfirmDialog';
import { ColorModeContext } from '../main';

const TaskList = ({ tasks, employees, onTaskDeleted }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    taskId: null,
  });
  const [filters, setFilters] = useState({
    employeeId: '',
    type: '',
    startDate: '',
    endDate: '',
    searchQuery: '',
    onlyUnevaluated: false,
  });

  const taskTypes = {
    PRA: {
      color: '#e3f2fd',
      criteria: [
        { name: 'Calidad', weight: 60 },
        { name: 'Seguimiento de instrucciones', weight: 40 },
      ],
    },
    Validacion: {
      color: '#f3e5f5',
      criteria: [
        { name: 'Calidad', weight: 60 },
        { name: 'Cumplimiento de tiempo', weight: 20 },
        { name: '0 errores encontrados en GA', weight: 20 },
      ],
    },
    "STD Times": {
      color: '#fff8e1',
      criteria: [
        { name: 'Seguimiento de instrucciones', weight: 60 },
        { name: 'Calidad del servicio', weight: 40 },
      ],
    },
    "Entrenamientos (Recibe)": {
      color: '#e1f5fe',
      criteria: [
        { name: 'Pruebas teóricas', weight: 40 },
        { name: 'Pruebas prácticas', weight: 60 },
      ],
    },
    "Entrenamientos (Brinda)": {
      color: '#f8bbd0',
      criteria: [
        { name: 'Manejo del grupo', weight: 25 },
        { name: 'Transmisión de conocimientos', weight: 0 },
        { name: 'Entregables', weight: 25 },
        { name: 'Resultados obtenidos', weight: 25 },
        { name: 'Calidad del servicio', weight: 25 },
      ],
    },
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = (editedTask) => {
    const allTasks = getTasks();
    const taskIndex = allTasks.findIndex(t => t.id === editedTask.id);
    if (taskIndex !== -1) {
      allTasks[taskIndex] = editedTask;
      saveTasks(allTasks);
      if (onTaskDeleted) onTaskDeleted();
    }
  };
  const getEmployeeName = (employeeId) => {
    return employees.find(emp => emp.id === employeeId)?.name || 'Empleado no encontrado';
  };

  const handleDeleteClick = (taskId) => {
    setConfirmDialog({
      open: true,
      taskId,
    });
  };

  const handleConfirmDelete = () => {
    deleteTask(confirmDialog.taskId);
    setConfirmDialog({
      open: false,
      taskId: null,
    });
    if (onTaskDeleted) onTaskDeleted();
  };

  const handleCancelDelete = () => {
    setConfirmDialog({
      open: false,
      taskId: null,
    });
  };

  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);
  
  const getTaskTypeColor = (type) => {
    // Usar los colores del tema según el modo actual
    if (mode === 'dark') {
      return theme.palette.taskTypes[type] || '#333333';
    } else {
      const colors = {
        PRA: '#e3f2fd',
        Validacion: '#f3e5f5',
        "STD Times": '#fff8e1'
      };
      return colors[type] || '#ffffff';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'error';
  };

  // Aplicar filtros a las tareas
  useEffect(() => {
    let result = [...tasks];
    
    if (filters.employeeId) {
      result = result.filter(task => task.employeeId === filters.employeeId);
    }
    
    if (filters.type) {
      result = result.filter(task => task.type === filters.type);
    }
    
    if (filters.startDate || filters.endDate) {
      result = result.filter(task => {
        const taskDate = new Date(task.date);
        const startDate = filters.startDate ? new Date(filters.startDate) : null;
        const endDate = filters.endDate ? new Date(filters.endDate) : null;
        
        return (!startDate || taskDate >= startDate) && 
               (!endDate || taskDate <= endDate);
      });
    }

    // Filtrar tareas sin evaluar
    if (filters.onlyUnevaluated) {
      result = result.filter(task => task.totalScore === undefined || task.totalScore === null);
    }
    
    // Filtrar por búsqueda
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.comments && task.comments.toLowerCase().includes(query))
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, filters]);

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilters({
      employeeId: '',
      type: '',
      startDate: '',
      endDate: '',
      searchQuery: '',
      onlyUnevaluated: false,
    });
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filtros</Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filtrar por Asignado</InputLabel>
                <Select
                  name="employeeId"
                  value={filters.employeeId}
                  onChange={handleFilterChange}
                  label="Filtrar por Asignado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filtrar por Tipo</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  label="Filtrar por Tipo"
                >
                  <MenuItem value="">Todos</MenuItem>
                  {Object.keys(taskTypes).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Inicio"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Fin"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Buscar"
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
                size="small"
                placeholder="Buscar por título o comentarios"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Solo tareas sin evaluar</Typography>
                  <Button
                    onClick={() => setFilters(prev => ({ ...prev, onlyUnevaluated: !prev.onlyUnevaluated }))}
                    color={filters.onlyUnevaluated ? "primary" : "inherit"}
                    variant={filters.onlyUnevaluated ? "contained" : "outlined"}
                    size="small"
                    sx={{ minWidth: '100px', textTransform: 'none' }}
                  >
                    {filters.onlyUnevaluated ? "Activado" : "Desactivado"}
                  </Button>
                </Box>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={clearFilters}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ minWidth: '120px', textTransform: 'none' }}
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle1" fontWeight="bold">Tarea</Typography></TableCell>
                  <TableCell><Typography variant="subtitle1" fontWeight="bold">Asignado</Typography></TableCell>
                  <TableCell><Typography variant="subtitle1" fontWeight="bold">Tipo</Typography></TableCell>
                  <TableCell><Typography variant="subtitle1" fontWeight="bold">Fecha</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle1" fontWeight="bold">Puntuación</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow
                    key={task.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onMouseEnter={() => setHoveredTaskId(task.id)}
                    onMouseLeave={() => setHoveredTaskId(null)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon color="primary" />
                        <Typography variant="body1">{task.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon color="secondary" />
                        <Typography variant="body1">{getEmployeeName(task.employeeId)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.type}
                        sx={{
                          bgcolor: getTaskTypeColor(task.type),
                          fontWeight: 500,
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {new Date(task.date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Chip
                          label={task.totalScore !== undefined && task.totalScore !== null ? `${task.totalScore}%` : 'Sin evaluar'}
                          color={task.totalScore !== undefined && task.totalScore !== null ? getScoreColor(task.totalScore) : 'default'}
                          size="small"
                        />
                        <Box sx={{ visibility: hoveredTaskId === task.id ? 'visible' : 'hidden' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(task)}
                            color="primary"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(task.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        task={selectedTask}
        taskTypes={taskTypes}
        onSave={handleSaveTask}
        employees={employees}
      />
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
      />
    </>
  );
};

export default TaskList;