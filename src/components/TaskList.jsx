import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteTask, getTasks, saveTasks } from '../utils/storage';
import TaskDialog from './TaskDialog';

const TaskList = ({ tasks, employees, onTaskDeleted }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({
    employeeId: '',
    type: '',
    date: '',
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

  const handleDelete = (taskId) => {
    deleteTask(taskId);
    if (onTaskDeleted) onTaskDeleted();
  };

  const getTaskTypeColor = (type) => {
    const colors = {
      PRA: '#e3f2fd',
      Validacion: '#f3e5f5',
    };
    return colors[type] || '#ffffff';
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
    
    if (filters.date) {
      const filterDate = new Date(filters.date).toISOString().split('T')[0];
      result = result.filter(task => {
        const taskDate = new Date(task.date).toISOString().split('T')[0];
        return taskDate === filterDate;
      });
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
      date: '',
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
                <InputLabel>Filtrar por Empleado</InputLabel>
                <Select
                  name="employeeId"
                  value={filters.employeeId}
                  onChange={handleFilterChange}
                  label="Filtrar por Empleado"
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
                label="Filtrar por Fecha"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
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
                  <TableCell><Typography variant="subtitle1" fontWeight="bold">Empleado</Typography></TableCell>
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
                        <Box>
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
                            onClick={() => handleDelete(task.id)}
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
    </>
  );
};

export default TaskList;