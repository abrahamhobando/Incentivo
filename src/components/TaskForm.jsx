import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Stack,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel,
  Checkbox,
  OutlinedInput,
  ListItemText,
  Collapse,
  Fade,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CommentIcon from '@mui/icons-material/Comment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getEmployees, addTask } from '../utils/storage';
import { ColorModeContext } from '../main';
import { useTheme } from '@mui/material/styles';

const TaskForm = ({ employees, onTaskAdded }) => {
  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);
  const [formVisible, setFormVisible] = useState(false);
  const [multipleAssignment, setMultipleAssignment] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [taskData, setTaskData] = useState({
    title: '',
    employeeId: '',
    type: '',
    date: '',
    evaluations: {},
    comments: '',
  });

  const taskTypes = {
    "Práctica de procesos": {
      color: mode === 'dark' ? theme.palette.taskTypes["Práctica de procesos"] : '#e8f5e9',
      criteria: [
        { 
          name: 'Calidad', 
          weight: 60,
          description: 'Se revisa una muestra del 5% al 15% de los casos realizados. Si la calidad es menor al 70%, se pierde todo el porcentaje.'
        },
        { 
          name: 'Seguimiento de instrucciones', 
          weight: 40,
          description: 'Cumplir indicaciones del responsable del proceso.'
        },
      ],
    },
    PRA: {
      color: mode === 'dark' ? theme.palette.taskTypes.PRA : '#e3f2fd',
      criteria: [
        { 
          name: 'Calidad', 
          weight: 60,
          description: 'Se revisa una muestra del 5% al 15% de los casos realizados, dependiendo de la población del estudio.'
        },
        { 
          name: 'Seguimiento de instrucciones', 
          weight: 40,
          description: 'Se siguen las instrucciones del ingeniero a cargo de la prueba para la realización de la misma. Retroalimentación recibida por el ingeniero a cargo de la prueba.'
        },
      ],
    },
    Validacion: {
      color: mode === 'dark' ? theme.palette.taskTypes.Validation : '#f3e5f5',
      criteria: [
        { 
          name: 'Calidad', 
          weight: 60,
          description: 'Se revisa una muestra del 15% de los casos realizados en la asignación.'
        },
        { 
          name: 'Cumplimiento de tiempo', 
          weight: 20,
          description: 'La validación se realiza dentro del periodo establecido.'
        },
        { 
          name: '0 errores encontrados en GA', 
          weight: 20,
          description: 'Se realiza la validación correctamente para asegurar que la nueva versión de Treat no tenga errores en GA.'
        },
      ],
    },
    "STD Times": {
      color: mode === 'dark' ? theme.palette.taskTypes["STD Times"] : '#fff8e1',
      criteria: [
        { 
          name: 'Seguimiento de instrucciones', 
          weight: 60,
          description: 'Cumplir indicaciones del ingeniero.'
        },
        { 
          name: 'Calidad del servicio', 
          weight: 40,
          description: 'Retroalimentación del ingeniero. Retroalimentación de producción: Evaluación aleatoria del equipo de producción.'
        },
      ],
    },
    "Entrenamientos (Recibe)": {
      color: mode === 'dark' ? theme.palette.taskTypes["Entrenamientos (Recibe)"] : '#e1f5fe',
      criteria: [
        { 
          name: 'Pruebas teóricas', 
          weight: 40,
          description: 'Aprueba las pruebas teóricas asignadas al entrenamiento.'
        },
        { 
          name: 'Pruebas prácticas', 
          weight: 60,
          description: 'Aprueba las pruebas prácticas asignadas al entrenamiento.'
        },
      ],
    },
    "Entrenamientos (Brinda)": {
      color: mode === 'dark' ? theme.palette.taskTypes["Entrenamientos (Brinda)"] : '#f8bbd0',
      criteria: [
        { 
          name: 'Manejo del grupo', 
          weight: 20,
          description: 'Material y ambiente adecuados.'
        },
        { 
          name: 'Transmisión de conocimientos', 
          weight: 20,
          description: 'Claridad en la enseñanza.'
        },
        { 
          name: 'Entregables', 
          weight: 20,
          description: 'Documentación entregada a tiempo.'
        },
        { 
          name: 'Resultados obtenidos', 
          weight: 20,
          description: 'Responsabilidad y feedback individual.'
        },
        { 
          name: 'Calidad del servicio', 
          weight: 20,
          description: 'Retroalimentación de los participantes.'
        },
      ],
    },
    "Refrescamientos (Brinda)": {
      color: mode === 'dark' ? theme.palette.taskTypes["Refrescamientos (Brinda)"] : '#ffccbc',
      criteria: [
        { 
          name: 'Contenido adecuado', 
          weight: 20,
          description: 'El contenido es apropiado para el tema y audiencia.'
        },
        { 
          name: 'Materiales didácticos', 
          weight: 20,
          description: 'Calidad y efectividad de los materiales utilizados.'
        },
        { 
          name: 'Explicación clara', 
          weight: 20,
          description: 'Claridad en la comunicación y explicación de conceptos.'
        },
        { 
          name: 'Entregables', 
          weight: 40,
          description: 'Información entregada a tiempo y en formato correcto.'
        },
      ],
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setTaskData(prev => ({
        ...prev,
        [name]: value,
        evaluations: {},
      }));
    } else {
      setTaskData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleMultipleAssignmentChange = (event) => {
    setMultipleAssignment(event.target.checked);
    // Limpiar la selección de empleados cuando se cambia el modo
    if (!event.target.checked) {
      setTaskData(prev => ({
        ...prev,
        employeeId: '',
      }));
    } else {
      setSelectedEmployees([]);
    }
  };
  
  const handleEmployeeSelectionChange = (event) => {
    const { value } = event.target;
    setSelectedEmployees(value);
  };

  const handleEvaluationChange = (criteriaName, value) => {
    setTaskData(prev => ({
      ...prev,
      evaluations: {
        ...prev.evaluations,
        [criteriaName]: parseFloat(value) || 0,
      },
    }));
  };

  const calculateTotalScore = () => {
    if (!taskData.type || !taskTypes[taskData.type]) return null;
    
    // Verificar si hay al menos un criterio evaluado
    const hasEvaluations = taskTypes[taskData.type].criteria.some(
      criterion => taskData.evaluations[criterion.name] !== undefined && 
                 taskData.evaluations[criterion.name] !== null && 
                 taskData.evaluations[criterion.name] !== ''
    );
    
    if (!hasEvaluations) return null;
    
    return taskTypes[taskData.type].criteria.reduce((total, criterion) => {
      let score = taskData.evaluations[criterion.name] || 0;
      
      // Aplicar regla especial para criterio de Calidad en tareas PRA y Validacion
      if ((taskData.type === 'PRA' || taskData.type === 'Validacion') && 
          criterion.name === 'Calidad' && score < 70) {
        // Si calidad es menor a 70%, se pierde todo el porcentaje
        return total;
      }
      
      // Aplicar regla especial para Entrenamientos (Recibe)
      if (taskData.type === 'Entrenamientos (Recibe)') {
        if (criterion.name === 'Pruebas teóricas' && score < 75) {
          // Si pruebas teóricas es menor a 75%, se pierde todo el porcentaje
          return total;
        }
        if (criterion.name === 'Pruebas prácticas' && score < 75) {
          // Si pruebas prácticas es menor a 75%, se pierde todo el porcentaje
          return total;
        }
      }
      
      return total + (score * criterion.weight) / 100;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalScore = calculateTotalScore();
    const baseTask = {
      ...taskData,
      totalScore,
      date: taskData.date,
    };
    
    if (multipleAssignment && selectedEmployees.length > 0) {
      // Crear una tarea para cada empleado seleccionado
      selectedEmployees.forEach(employeeId => {
        const employeeTask = {
          ...baseTask,
          employeeId
        };
        addTask(employeeTask);
      });
    } else {
      // Modo normal: crear una sola tarea
      addTask(baseTask);
    }
    
    // Resetear el formulario
    setTaskData({
      title: '',
      employeeId: '',
      type: '',
      date: '',
      evaluations: {},
      comments: '',
    });
    setSelectedEmployees([]);
    if (onTaskAdded) onTaskAdded();
  };

  const toggleFormVisibility = () => {
    setFormVisible(prev => !prev);
  };

  return (
    <Card elevation={3} sx={{ borderRadius: '12px', overflow: 'visible' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
            <AddTaskIcon sx={{ mr: 1 }} /> Nueva Tarea
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setFormVisible(!formVisible)}
            startIcon={formVisible ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            sx={{
              mb: formVisible ? 2 : 0,
              transition: 'margin-bottom 0.3s',
              borderRadius: '8px',
            }}
          >
            Crear
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Collapse in={formVisible} timeout="auto">
          <Fade in={formVisible} timeout={600}>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: '8px' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
              Información Básica
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Título de la Tarea"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  required
                  size="small"
                  InputProps={{
                    startAdornment: <AssignmentIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                {!multipleAssignment ? (
                  <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                    <InputLabel>Asignado</InputLabel>
                    <Select
                      name="employeeId"
                      value={taskData.employeeId}
                      onChange={handleChange}
                      label="Asignado"
                      required
                      startAdornment={<PersonIcon color="action" sx={{ ml: 1, mr: 1 }} />}
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                    <InputLabel>Asignada a</InputLabel>
                    <Select
                      multiple
                      value={selectedEmployees}
                      onChange={handleEmployeeSelectionChange}
                      input={<OutlinedInput label="Seleccionar Asignados" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const employee = employees.find(emp => emp.id === value);
                            return (
                              <Chip 
                                key={value} 
                                label={employee ? employee.name : value} 
                                size="small" 
                                sx={{ borderRadius: '4px' }}
                              />
                            );
                          })}
                        </Box>
                      )}
                      startAdornment={<PersonIcon color="action" sx={{ ml: 1, mr: 1 }} />}
                    >
                      {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          <Checkbox checked={selectedEmployees.indexOf(employee.id) > -1} />
                          <ListItemText primary={employee.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                  <InputLabel>Tipo de Tarea</InputLabel>
                  <Select
                    name="type"
                    value={taskData.type}
                    onChange={handleChange}
                    label="Tipo de Tarea"
                    required
                    startAdornment={<CategoryIcon color="action" sx={{ ml: 1, mr: 1 }} />}
                  >
                    {Object.keys(taskTypes).map((type) => (
                      <MenuItem key={type} value={type}>
                        <Chip 
                          label={type} 
                          size="small" 
                          sx={{ 
                            bgcolor: taskTypes[type].color,
                            color: mode === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.87)',
                            fontWeight: 'medium',
                            border: mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
                            '& .MuiChip-label': { px: 1 },
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              opacity: 0.9,
                              transform: 'translateY(-1px)'
                            }
                          }} 
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha"
                  name="date"
                  value={taskData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  InputProps={{
                    startAdornment: <DateRangeIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
            </Grid>
          </Paper>
          
          {taskData.type && (
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: '8px' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 2, display: 'flex', alignItems: 'center' }}>
                Criterios de Evaluación
                <Tooltip title="Los criterios varían según el tipo de tarea seleccionado">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              
              <Grid container spacing={3}>
                {taskTypes[taskData.type].criteria.map((criterion) => (
                  <Grid item xs={12} md={6} key={criterion.name}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        {criterion.name} <Chip label={`${criterion.weight}%`} size="small" color="primary" variant="outlined" sx={{ mx: 1 }} />
                        {(taskData.type === 'PRA' || taskData.type === 'Validacion') && criterion.name === 'Calidad' && (
                          <Tooltip title="Si la calificación es menor al 70%, se pierde todo el porcentaje de este rubro" arrow placement="top">
                            <InfoOutlinedIcon fontSize="small" color="warning" />
                          </Tooltip>
                        )}
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="Ingrese calificación (0-100)"
                        value={taskData.evaluations[criterion.name] || ''}
                        onChange={(e) => handleEvaluationChange(criterion.name, e.target.value)}
                        InputProps={{ 
                          inputProps: { min: 0, max: 100 },
                        }}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {criterion.description}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
              
              {calculateTotalScore() !== null && (
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  borderRadius: '12px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: theme => {
                    const score = calculateTotalScore();
                    let color;
                    if (score >= 90) color = theme.palette.success.main;
                    else if (score >= 70) color = theme.palette.primary.main;
                    else if (score >= 50) color = theme.palette.warning.main;
                    else color = theme.palette.error.main;
                    
                    return `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`;
                  },
                  boxShadow: theme => {
                    const score = calculateTotalScore();
                    let color;
                    if (score >= 90) color = theme.palette.success.main;
                    else if (score >= 70) color = theme.palette.primary.main;
                    else if (score >= 50) color = theme.palette.warning.main;
                    else color = theme.palette.error.main;
                    
                    return `0 4px 12px ${color}33`;
                  },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme => {
                      const score = calculateTotalScore();
                      let color;
                      if (score >= 90) color = theme.palette.success.main;
                      else if (score >= 70) color = theme.palette.primary.main;
                      else if (score >= 50) color = theme.palette.warning.main;
                      else color = theme.palette.error.main;
                      
                      return `0 6px 16px ${color}55`;
                    },
                  }
                }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5, opacity: 0.8 }}>
                    Puntuación Total
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                  }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: theme => {
                          const score = calculateTotalScore();
                          if (score >= 90) return theme.palette.success.main;
                          if (score >= 70) return theme.palette.primary.main;
                          if (score >= 50) return theme.palette.warning.main;
                          return theme.palette.error.main;
                        }
                      }}
                    >
                      {calculateTotalScore().toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          )}
          
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: '8px' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
              Comentarios Adicionales
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              name="comments"
              value={taskData.comments || ''}
              onChange={handleChange}
              placeholder="Ingrese comentarios adicionales sobre la tarea"
              InputProps={{
                startAdornment: <CommentIcon color="action" sx={{ mt: 1.5, mr: 1 }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Paper>
          
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: '8px' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
              Opciones de Asignación
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={multipleAssignment}
                  onChange={handleMultipleAssignmentChange}
                  color="primary"
                />
              }
              label="Asignación múltiple"
            />
            {multipleAssignment && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                La tarea se creará para cada CAD seleccionado con los mismos detalles y evaluaciones.
              </Typography>
            )}
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddTaskIcon />}
              sx={{ 
                borderRadius: '8px', 
                px: 3,
                py: 1,
                fontWeight: 'bold',
                boxShadow: 2
              }}
              disabled={multipleAssignment && selectedEmployees.length === 0}
            >
              Agregar Tarea{multipleAssignment && selectedEmployees.length > 0 ? `s (${selectedEmployees.length})` : ''}
            </Button>
          </Box>
          </Box>
          </Fade>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default TaskForm;