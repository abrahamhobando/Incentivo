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
  alpha,
  Avatar,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CategoryIcon from '@mui/icons-material/Category';
import { deleteTask, getTasks, saveTasks, getSortPreferences, saveSortPreferences } from '../utils/storage';
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
  
  const [sortConfig, setSortConfig] = useState(getSortPreferences());

  const taskTypes = {
    "Práctica de procesos": {
      color: '#e8f5e9',
      criteria: [
        { name: 'Calidad', weight: 60 },
        { name: 'Seguimiento de instrucciones', weight: 40 },
      ],
    },
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
        { name: 'Manejo del grupo', weight: 20 },
        { name: 'Transmisión de conocimientos', weight: 20 },
        { name: 'Entregables', weight: 20 },
        { name: 'Resultados obtenidos', weight: 20 },
        { name: 'Calidad del servicio', weight: 20 },
      ],
    },
    "Refrescamientos (Brinda)": {
      color: '#ffccbc',
      criteria: [
        { name: 'Contenido adecuado', weight: 20 },
        { name: 'Materiales didácticos', weight: 20 },
        { name: 'Explicación clara', weight: 20 },
        { name: 'Entregables', weight: 40 },
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
  
  // Función para generar un color basado en el nombre
  const getAvatarColor = (name) => {
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
  
  const getTaskTypeColor = (type) => {
    // Usar los colores del tema según el modo actual
    if (mode === 'dark') {
      return theme.palette.taskTypes[type] || '#333333';
    } else {
      return taskTypes[type]?.color || '#ffffff';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'error';
  };

  // Aplicar filtros y ordenamiento a las tareas
  useEffect(() => {
    let result = [...tasks];
    
    // Aplicar filtros
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
    
    // Aplicar ordenamiento
    if (sortConfig.field && sortConfig.direction) {
      result.sort((a, b) => {
        if (sortConfig.field === 'title') {
          // Ordenar alfabéticamente por título
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (sortConfig.direction === 'asc') {
            return titleA.localeCompare(titleB);
          } else {
            return titleB.localeCompare(titleA);
          }
        } else if (sortConfig.field === 'date') {
          // Ordenar por fecha
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (sortConfig.direction === 'asc') {
            return dateA - dateB; // Más antiguo primero
          } else {
            return dateB - dateA; // Más reciente primero
          }
        } else if (sortConfig.field === 'score') {
          // Ordenar por puntuación
          const scoreA = a.totalScore !== undefined && a.totalScore !== null ? a.totalScore : -1;
          const scoreB = b.totalScore !== undefined && b.totalScore !== null ? b.totalScore : -1;
          if (sortConfig.direction === 'asc') {
            return scoreA - scoreB;
          } else {
            return scoreB - scoreA;
          }
        }
        return 0;
      });
    }
    
    setFilteredTasks(result);
  }, [tasks, filters, sortConfig]);

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
  
  // Manejar cambios en la configuración de ordenamiento
  const handleSortChange = (field, direction) => {
    const newSortConfig = { field, direction };
    setSortConfig(newSortConfig);
    saveSortPreferences(newSortConfig);
  };

  return (
    <>
      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                  Total Tareas
                </Typography>
                <AssignmentIcon color="primary" />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500, my: 1 }}>
                {filteredTasks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tasks.length > 0 ? 
                  `${Math.round((filteredTasks.length / tasks.length) * 100)}% del total` : 
                  '0% del total'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: alpha(theme.palette.warning.main, 0.08),
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                  Tareas Pendientes
                </Typography>
                <AssessmentIcon color="warning" />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500, my: 1 }}>
                {filteredTasks.filter(task => task.totalScore === undefined || task.totalScore === null).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredTasks.length > 0 ? 
                  `${Math.round((filteredTasks.filter(task => task.totalScore === undefined || task.totalScore === null).length / filteredTasks.length) * 100)}% sin evaluar` : 
                  '0% sin evaluar'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: alpha(theme.palette.success.main, 0.08),
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                  Tareas Evaluadas
                </Typography>
                <BarChartIcon color="success" />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500, my: 1 }}>
                {filteredTasks.length > 0 && filteredTasks.filter(task => task.totalScore !== undefined && task.totalScore !== null).length > 0 ? 
                  `${(filteredTasks.filter(task => task.totalScore !== undefined && task.totalScore !== null).reduce((sum, task) => sum + task.totalScore, 0) / filteredTasks.filter(task => task.totalScore !== undefined && task.totalScore !== null).length || 0).toFixed(1)}%` : 
                  '0%'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calificación promedio
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: alpha(theme.palette.info.main, 0.08),
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                  Tipos de Tarea
                </Typography>
                <CategoryIcon color="info" />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500, my: 1 }}>
                {[...new Set(filteredTasks.map(task => task.type))].length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Object.keys(taskTypes).length} tipos disponibles
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
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
                    fullWidth
                    sx={{ 
                      minHeight: '40px',
                      textTransform: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {filters.onlyUnevaluated ? "Mostrar solo tareas sin evaluar" : "Mostrar todas las tareas"}
                  </Button>
                </Box>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sortConfig.field}
                  onChange={(e) => handleSortChange(e.target.value, sortConfig.direction)}
                  label="Ordenar por"
                >
                  <MenuItem value="title">Nombre de tarea</MenuItem>
                  <MenuItem value="date">Fecha</MenuItem>
                  <MenuItem value="score">Puntuación</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Dirección</InputLabel>
                <Select
                  value={sortConfig.direction}
                  onChange={(e) => handleSortChange(sortConfig.field, e.target.value)}
                  label="Dirección"
                >
                  <MenuItem value="asc">{sortConfig.field === 'date' ? 'Más antiguo primero' : 'Ascendente (A-Z)'}</MenuItem>
                  <MenuItem value="desc">{sortConfig.field === 'date' ? 'Más reciente primero' : 'Descendente (Z-A)'}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                onClick={clearFilters}
                color="primary"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ 
                  minHeight: '40px',
                  textTransform: 'none'
                }}
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
                  <TableCell align="center"><Typography variant="subtitle1" fontWeight="bold">Puntuación</Typography></TableCell>
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
                        <Avatar 
                          sx={{ 
                            bgcolor: getAvatarColor(getEmployeeName(task.employeeId)),
                            width: 28,
                            height: 28,
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {getEmployeeName(task.employeeId).charAt(0).toUpperCase()}
                        </Avatar>
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
                        {new Date(task.date + 'T00:00:00').toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Chip
                          label={task.totalScore !== undefined && task.totalScore !== null ? `${task.totalScore.toFixed(2)}%` : 'Sin evaluar'}
                          color={task.totalScore !== undefined && task.totalScore !== null ? getScoreColor(task.totalScore) : 'default'}
                          size="small"
                          sx={{
                            ...(task.totalScore === undefined || task.totalScore === null ? {
                              bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                              fontStyle: 'italic',
                              '&:hover': {
                                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'
                              }
                            } : {})
                          }}
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