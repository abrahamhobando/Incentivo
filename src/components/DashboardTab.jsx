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
} from '@mui/material';
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

const DashboardTab = ({ employees, tasks, onTabChange }) => {
  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

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

  // Obtener los últimos 5 empleados
  const recentEmployees = [...employees].sort((a, b) => b.id - a.id).slice(0, 5);

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

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center',
          fontWeight: 500,
          color: 'primary.main'
        }}>
          <DashboardIcon sx={{ mr: 1 }} /> Panel Principal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Bienvenido al sistema de gestión de asignaciones. Aquí encontrarás un resumen de la información más relevante.
        </Typography>
      </Box>

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
                  Total CADS
                </Typography>
                <PeopleIcon color="primary" />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500, my: 1 }}>
                {stats.totalEmployees}
              </Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />} 
                onClick={() => navigateToTab(1)}
                sx={{ mt: 1 }}
              >
                Gestionar CADS
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            backgroundColor: alpha(theme.palette.secondary.main, 0.08),
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography color="text.secondary" variant="subtitle2" gutterBottom>
                  Total Tareas
                </Typography>
                <AssignmentIcon color="secondary" />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500, my: 1 }}>
                {stats.totalTasks}
              </Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />} 
                onClick={() => navigateToTab(2)}
                sx={{ mt: 1 }}
              >
                Gestionar Tareas
              </Button>
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
                {stats.completedTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.totalTasks > 0 ? 
                  `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}% del total` : 
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
                {stats.pendingTasks}
              </Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />} 
                onClick={() => navigateToTab(3)}
                sx={{ mt: 1 }}
              >
                Ver Informes
              </Button>
            </CardContent>
          </Card>
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
              borderRadius: 2,
              boxShadow: theme => `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1 }} fontSize="small" /> CADS Recientes
              </Typography>
              <Button 
                size="small" 
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() => navigateToTab(1)}
              >
                Agregar
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {recentEmployees.length > 0 ? (
                recentEmployees.map((employee) => (
                  <ListItem key={employee.id} sx={{ px: 1, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PersonIcon color="primary" fontSize="small" />
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
                  onClick={() => navigateToTab(1)}
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
              borderRadius: 2,
              boxShadow: theme => `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} fontSize="small" /> Tareas Recientes
              </Typography>
              <Button 
                size="small" 
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={() => navigateToTab(2)}
              >
                Agregar
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <ListItem key={task.id} sx={{ px: 1, py: 0.75 }}>
                    <ListItemText 
                      primary={task.title}
                      secondary={getEmployeeName(task.employeeId)}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip 
                        label={task.type} 
                        size="small" 
                        sx={{ 
                          bgcolor: getTaskTypeColor(task.type),
                          fontSize: '0.7rem',
                          height: 20,
                        }} 
                      />
                      <Chip 
                        label={task.totalScore !== undefined && task.totalScore !== null ? 
                          `${task.totalScore}%` : 'Pendiente'} 
                        size="small" 
                        color={getTaskStatusColor(task)}
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.7rem',
                          height: 20,
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
                  onClick={() => navigateToTab(2)}
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
              borderRadius: 2,
              boxShadow: theme => `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
              background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
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
                <Button 
                  variant="contained" 
                  color="primary"
                  endIcon={<AssessmentIcon />}
                  onClick={() => navigateToTab(3)}
                  sx={{ mt: 1 }}
                >
                  Ver Informes
                </Button>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <AssessmentIcon 
                    sx={{ 
                      fontSize: { xs: 80, md: 120 },
                      color: alpha(theme.palette.primary.main, 0.2),
                    }} 
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardTab;