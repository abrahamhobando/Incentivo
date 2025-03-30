import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import StatsSection from './StatsSection';
import { motion } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AddIcon from '@mui/icons-material/Add';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import { ColorModeContext } from '../main';
import TaskPreviewModal from './TaskPreviewModal';
import { deleteTask } from '../utils/storage';
import EmployeeInfoModal from './EmployeeInfoModal';

// Variantes de animación para elementos del dashboard
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  }
};

const statCardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: index => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.1 + (index * 0.1),
      ease: [0.25, 0.1, 0.25, 1.0],
    }
  })
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: index => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: 0.2 + (index * 0.05),
      ease: [0.25, 0.1, 0.25, 1.0],
    }
  })
};

const DashboardTab = ({ employees, tasks, onTabChange }) => {
  // Definir los tipos de tareas y sus criterios para pasarlos a StatsSection
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
  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  // Agregar estados para la previsualización
  const [selectedTask, setSelectedTask] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  useEffect(() => {
    // Calcular estadísticas
    const completedTasks = tasks.filter(task => task.totalScore !== undefined && task.totalScore !== null).length;
    const pendingTasks = tasks.length - completedTasks;

    setStats({
      totalEmployees: employees.length,
      totalTasks: tasks.length,
      completedTasks,
      pendingTasks,
    });
  }, [employees, tasks]);

  // Obtener los últimos 7 empleados
  const recentEmployees = [...employees].sort((a, b) => b.id - a.id).slice(0, 7);

  // Obtener las últimas 5 tareas
  const recentTasks = [...tasks].sort((a, b) => b.id - a.id).slice(0, 5);

  // Función para navegar a otras pestañas
  const navigateToTab = (tabIndex) => {
    if (onTabChange) {
      // Pasar null como primer parámetro (event) y el tabIndex como segundo parámetro (newValue)
      onTabChange(null, tabIndex);
    }
  };

  // Función para obtener el color de la tarea según su tipo
  const getTaskTypeColor = (type) => {
    const taskTypes = {
      "Práctica de procesos": '#e8f5e9',
      "PRA": '#e3f2fd',
      "Validacion": '#f3e5f5',
      "STD Times": '#fff8e1',
      "Entrenamientos (Recibe)": '#e1f5fe',
      "Entrenamientos (Brinda)": '#f8bbd0',
      "Refrescamientos (Brinda)": '#ffccbc',
    };

    // Usar los colores del tema según el modo actual
    if (mode === 'dark') {
      return theme.palette.taskTypes[type] || '#333333';
    } else {
      return taskTypes[type] || '#ffffff';
    }
  };

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

  // Función para obtener el color del estado de la tarea
  const getTaskStatusColor = (task) => {
    if (task.totalScore === undefined || task.totalScore === null) {
      return 'warning';
    }
    if (task.totalScore >= 90) return 'success';
    if (task.totalScore >= 70) return 'primary';
    if (task.totalScore >= 50) return 'info';
    return 'error';
  };

  // Función para obtener el nombre del empleado
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Desconocido';
  };

  // Función para manejar la previsualización de una tarea
  const handlePreviewTask = (task) => {
    setSelectedTask(task);
    setPreviewModalOpen(true);
  };
  
  // Función para editar una tarea (redirige a la pestaña de tareas)
  const handleEditTask = (task) => {
    // Cerrar el modal
    setPreviewModalOpen(false);
    
    // Navegar a la pestaña de tareas (índice 2)
    if (onTabChange) {
      onTabChange(null, 2);
    }
  };
  
  // Función para eliminar una tarea
  const handleDeleteTask = (taskId) => {
    // Cerrar el modal
    setPreviewModalOpen(false);
    
    // Eliminar la tarea (esta acción debería desencadenar una actualización del estado global)
    deleteTask(taskId);
    
    // Recargar la página o actualizar los datos
    window.location.reload();
  };

  return (
    <Box>
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 500,
            color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.main'
          }}>
            <motion.div
              initial={{ rotate: -5, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.25, 0.1, 0.25, 1.0],
                delay: 0.2
              }}
            >
              <DashboardIcon sx={{ mr: 1 }} />
            </motion.div>
            Panel Principal
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
            Bienvenido al sistema de gestión de asignaciones. Aquí encontrarás un resumen de la información más relevante.
          </Typography>
        </Box>
      </motion.div>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div 
            custom={0}
            variants={statCardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20 
            }}
          >
            <Card sx={{ 
              height: '100%',
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }
            }}>
              <CardContent sx={{ py: 2, px: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" color="text.secondary">
                    Colaboradores
                  </Typography>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.9), 
                    width: 32, 
                    height: 32,
                  }}>
                    <motion.div
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.5,
                        ease: "easeInOut" 
                      }}
                    >
                      <PeopleIcon sx={{ fontSize: '1rem' }} />
                    </motion.div>
                  </Avatar>
                </Box>
                <Typography variant="h3" sx={{ 
                  mt: 2, 
                  mb: 1,
                  fontWeight: 600,
                  fontSize: '2rem',
                  color: 'primary.main'
                }}>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    {stats.totalEmployees}
                  </motion.span>
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  size="small" 
                  variant="text"
                  onClick={() => navigateToTab(1)}
                  sx={{ 
                    mt: 1, 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    px: 0
                  }}
                >
                  Agregar colaborador
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div 
            custom={1}
            variants={statCardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20 
            }}
          >
            <Card sx={{ 
              height: '100%',
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }
            }}>
              <CardContent sx={{ py: 2, px: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" color="text.secondary">
                    Asignaciones totales
                  </Typography>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.info.main, 0.9), 
                    width: 32, 
                    height: 32,
                  }}>
                    <motion.div
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.7,
                        ease: "easeInOut" 
                      }}
                    >
                      <AssignmentIcon sx={{ fontSize: '1rem' }} />
                    </motion.div>
                  </Avatar>
                </Box>
                <Typography variant="h3" sx={{ 
                  mt: 2, 
                  mb: 1,
                  fontWeight: 600,
                  fontSize: '2rem',
                  color: 'info.main'
                }}>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    {stats.totalTasks}
                  </motion.span>
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  size="small" 
                  color="info"
                  variant="text"
                  onClick={() => navigateToTab(2)}
                  sx={{ 
                    mt: 1, 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    px: 0
                  }}
                >
                  Crear asignación
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <motion.div 
            custom={2}
            variants={statCardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20 
            }}
          >
            <Card sx={{ 
              height: '100%',
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }
            }}>
              <CardContent sx={{ py: 2, px: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" color="text.secondary">
                    Evaluadas
                  </Typography>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.success.main, 0.9), 
                    width: 32, 
                    height: 32,
                  }}>
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.9,
                        ease: "easeInOut" 
                      }}
                    >
                      <AssessmentIcon sx={{ fontSize: '1rem' }} />
                    </motion.div>
                  </Avatar>
                </Box>
                <Typography variant="h3" sx={{ 
                  mt: 2, 
                  mb: 1,
                  fontWeight: 600,
                  fontSize: '2rem',
                  color: 'success.main'
                }}>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                  >
                    {stats.completedTasks}
                  </motion.span>
                </Typography>
                <Button 
                  endIcon={<ArrowForwardIcon />} 
                  size="small" 
                  color="success"
                  variant="text"
                  onClick={() => navigateToTab(3)}
                  sx={{ 
                    mt: 1, 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    px: 0
                  }}
                >
                  Ver informes
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <motion.div 
            custom={3}
            variants={statCardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20 
            }}
          >
            <Card sx={{ 
              height: '100%',
              borderRadius: 1,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }
            }}>
              <CardContent sx={{ py: 2, px: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" color="text.secondary">
                    Pendientes
                  </Typography>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.warning.main, 0.9), 
                    width: 32, 
                    height: 32,
                  }}>
                    <motion.div
                      animate={{ y: [0, 2, 0, -2, 0] }}
                      transition={{ 
                        duration: 1, 
                        delay: 1.1,
                        ease: "easeInOut", 
                        repeat: 1
                      }}
                    >
                      <AssignmentIcon sx={{ fontSize: '1rem' }} />
                    </motion.div>
                  </Avatar>
                </Box>
                <Typography variant="h3" sx={{ 
                  mt: 2, 
                  mb: 1,
                  fontWeight: 600,
                  fontSize: '2rem',
                  color: 'warning.main'
                }}>
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                  >
                    {stats.pendingTasks}
                  </motion.span>
                </Typography>
                <Button 
                  endIcon={<ArrowForwardIcon />} 
                  size="small" 
                  color="warning"
                  variant="text"
                  onClick={() => navigateToTab(2)}
                  sx={{ 
                    mt: 1, 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    px: 0
                  }}
                >
                  Ver pendientes
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Secciones principales */}
      <Grid container spacing={3}>
        {/* CADS recientes */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              height: '100%',
              borderRadius: 1,
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" component="h2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                <PeopleIcon sx={{ mr: 1 }} fontSize="small" /> CADS Recientes
              </Typography>
              <Button 
                size="small" 
                startIcon={<AddIcon />}
                variant="text"
                onClick={() => navigateToTab(1)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Agregar
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {recentEmployees.length > 0 ? (
                recentEmployees.map((employee) => (
                  <ListItem 
                    key={employee.id} 
                    sx={{ 
                      px: 1, 
                      py: 0.5,
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        transform: 'translateY(-1px)'
                      },
                    }}
                    onClick={() => {
                      // Set the selected employee and open modal
                      setSelectedEmployee(employee);
                      setSelectedTask(null); // Reset selected task
                      setInfoModalOpen(true);
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getAvatarColor(employee.name),
                          width: 28,
                          height: 28,
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {employee.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={employee.name} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No hay CADS registrados
                </Typography>
              )}
            </List>
            {employees.length > 5 && (
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  variant="text"
                  onClick={() => navigateToTab(1)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Ver todos ({employees.length})
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Tareas recientes */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              height: '100%',
              borderRadius: 1,
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" component="h2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
                <AssignmentIcon sx={{ mr: 1 }} fontSize="small" /> Tareas Recientes
              </Typography>
              <Button 
                size="small" 
                startIcon={<AddIcon />}
                variant="text"
                onClick={() => navigateToTab(2)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Agregar
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <ListItem 
                    key={task.id} 
                    sx={{ 
                      px: 1.5, 
                      py: 1,
                      mb: 0.5,
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid transparent',
                      '&:hover': { 
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        transform: 'translateY(-1px)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        borderColor: alpha(theme.palette.primary.main, 0.08)
                      },
                      ...(hoveredTaskId === task.id && {
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        transform: 'translateY(-1px)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      })
                    }}
                    onClick={() => handlePreviewTask(task)}
                    onMouseEnter={() => setHoveredTaskId(task.id)}
                    onMouseLeave={() => setHoveredTaskId(null)}
                  >
                    <ListItemText 
                      primary={task.title}
                      secondary={getEmployeeName(task.employeeId)}
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        fontWeight: 500,
                        color: hoveredTaskId === task.id ? 'primary.main' : 'text.primary',
                        sx: { transition: 'color 0.2s ease' }
                      }}
                      secondaryTypographyProps={{ 
                        variant: 'caption',
                        sx: { 
                          display: 'flex',
                          alignItems: 'center'
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip 
                        label={task.type} 
                        size="small" 
                        sx={{ 
                          bgcolor: getTaskTypeColor(task.type),
                          fontSize: '0.7rem',
                          height: 20,
                          transition: 'all 0.2s ease',
                          ...(hoveredTaskId === task.id && {
                            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                          }),
                        }} 
                      />
                      <Chip 
                        label={task.totalScore !== undefined && task.totalScore !== null ? 
                          `${task.totalScore.toFixed(0)}%` : 'Pendiente'} 
                        size="small" 
                        color={getTaskStatusColor(task)}
                        variant={hoveredTaskId === task.id ? "filled" : "outlined"}
                        sx={{ 
                          fontSize: '0.75rem',
                          height: 22,
                          fontWeight: 'bold',
                          boxShadow: hoveredTaskId === task.id ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                          transition: 'all 0.2s ease'
                        }} 
                      />
                    </Box>
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No hay tareas registradas
                </Typography>
              )}
            </List>
            {tasks.length > 5 && (
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  size="small" 
                  endIcon={<ArrowForwardIcon />}
                  variant="text"
                  onClick={() => navigateToTab(2)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Ver todos ({tasks.length})
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sección de informes */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mt: 2,
              borderRadius: 1,
              boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
              bgcolor: mode === 'dark' ? 'rgba(20,20,25,0.4)' : 'rgba(252,252,255,0.6)',
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>
                  Generar Informes y Estadísticas
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Accede a informes detallados sobre el rendimiento de los CADS, estadísticas de tareas completadas y evaluaciones realizadas.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    endIcon={<AssessmentIcon />}
                    onClick={() => navigateToTab(3)}
                    sx={{ 
                      mt: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Ver Informes
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="warning"
                    endIcon={<BarChartIcon />}
                    onClick={() => navigateToTab(3)}
                    sx={{ 
                      mt: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Tareas con Bajo Rendimiento
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <motion.div
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <AssessmentIcon 
                    sx={{ 
                      fontSize: { xs: 80, md: 120 },
                      color: alpha(theme.palette.primary.main, 0.15),
                    }} 
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Sección de estadísticas */}
      <StatsSection tasks={tasks} taskTypes={taskTypes} />

      {/* Modal de previsualización de tareas */}
      <TaskPreviewModal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        task={selectedTask}
        taskTypes={taskTypes}
        employees={employees}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
      
      {/* Modal de información del empleado */}
      {selectedEmployee && (
        <EmployeeInfoModal
          open={infoModalOpen}
          onClose={() => setInfoModalOpen(false)}
          employee={selectedEmployee}
          tasks={tasks}
        />
      )}
    </Box>
  );
};

export default DashboardTab;