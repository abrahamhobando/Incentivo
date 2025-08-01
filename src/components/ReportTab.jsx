import React, { useState, useMemo, useEffect, useContext } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  IconButton,
  Collapse,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CommentIcon from '@mui/icons-material/Comment';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import GeneralReportPDF from './GeneralReportPDF';
import { ColorModeContext } from '../main';
import { useTheme, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.04,
      delayChildren: 0.05,
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1.0]
    } 
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0, scale: 0.97 },
  visible: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

const cardVariants = {
  hidden: { y: 15, opacity: 0, scale: 0.98 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  hover: { 
    y: -6, 
    scale: 1.03,
    boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

const ReportTab = ({ employees, tasks }) => {
  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);
  const [openCriteria, setOpenCriteria] = useState({});
  
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
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  
  const [employeeStats, setEmployeeStats] = useState([]);

  const filteredTasks = useMemo(() => {
    if (!selectedEmployee) return [];

    return tasks.filter(task => {
      // Verificar si la tarea está evaluada (tiene totalScore definido y no es null)
      const isEvaluated = task.totalScore !== undefined && task.totalScore !== null;
      const matchesEmployee = task.employeeId === selectedEmployee;
      const taskDate = new Date(task.date);
      const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
      const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

      const withinDateRange =
        (!startDate || taskDate >= startDate) &&
        (!endDate || taskDate <= endDate);

      // Solo incluir tareas evaluadas que coincidan con el empleado y el rango de fechas
      return isEvaluated && matchesEmployee && withinDateRange;
    });
  }, [tasks, selectedEmployee, dateRange]);

  const statistics = useMemo(() => {
    if (filteredTasks.length === 0) return null;

    const totalScore = filteredTasks.reduce((sum, task) => sum + task.totalScore, 0);
    const averageScore = totalScore / filteredTasks.length;
    // Calcula el bono proporcional (30% es el máximo para un promedio de 100%)
    const bonusPercentage = ((averageScore / 100) * 30).toFixed(2);

    const tasksByType = filteredTasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalTasks: filteredTasks.length,
      averageScore,
      bonusPercentage,
      tasksByType,
    };
  }, [filteredTasks]);
  
  // Calcular estadísticas para todos los empleados
  useEffect(() => {
    if (employees.length > 0 && tasks.length > 0) {
      const stats = employees.map(employee => {
        // Filtrar solo tareas evaluadas para este empleado
        const employeeTasks = tasks.filter(task => 
          task.employeeId === employee.id && 
          task.totalScore !== undefined && 
          task.totalScore !== null
        );
        
        if (employeeTasks.length === 0) {
          return {
            employee,
            totalTasks: 0,
            averageScore: 0,
            bonusPercentage: '0.00'
          };
        }
        
        const totalScore = employeeTasks.reduce((sum, task) => sum + task.totalScore, 0);
        const averageScore = totalScore / employeeTasks.length;
        const bonusPercentage = ((averageScore / 100) * 30).toFixed(2);
        
        return {
          employee,
          totalTasks: employeeTasks.length,
          averageScore,
          bonusPercentage
        };
      });
      
      setEmployeeStats(stats);
    }
  }, [employees, tasks]);

  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  const handleDateChange = (field) => (event) => {
    setDateRange(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const selectedEmployeeName = useMemo(() => {
    const employee = employees.find(emp => emp.id === selectedEmployee);
    return employee ? employee.name : '';
  }, [employees, selectedEmployee]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Seleccionar colaborador</InputLabel>
              <Select
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                label="Seleccionar colaborador"
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="date"
              label="Periodo"
              value={dateRange.startDate}
              onChange={handleDateChange('startDate')}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="date"
              label="Fecha Fin"
              value={dateRange.endDate}
              onChange={handleDateChange('endDate')}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
        </Grid>
      </motion.div>
      
      {!selectedEmployee && (
        <motion.div variants={itemVariants}>
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <motion.div
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
              >
                <Typography variant="h5" gutterBottom>
                  Informes
                </Typography>
              </motion.div>
              <motion.div
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0], delay: 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <PDFDownloadLink 
                  document={
                    <GeneralReportPDF 
                      employees={employees} 
                      tasks={tasks} 
                      dateRange={dateRange} 
                    />
                  } 
                  fileName={`informe_general_${new Date().toISOString().split('T')[0]}.pdf`}
                  style={{ textDecoration: 'none' }}
                >
                  {({ blob, url, loading, error }) => (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<SummarizeIcon />}
                      disabled={loading}
                      sx={{ 
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      {loading ? 'Generando PDF...' : 'Descargar Informe General'}
                    </Button>
                  )}
                </PDFDownloadLink>
              </motion.div>
            </Box>
            <Grid container spacing={2}>
              {employeeStats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={stat.employee.id}>
                  <motion.div
                    variants={cardVariants}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    transition={{ delay: 0.1 + index * 0.08 }}
                  >
                    <Card 
                      onClick={() => setSelectedEmployee(stat.employee.id)}
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        cursor: 'pointer',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      }}
                    >
                      <CardContent sx={{ p: 2, pb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <motion.div
                            whileHover={{ 
                              rotate: [0, -5, 5, 0], 
                              scale: 1.1,
                              transition: { duration: 0.3, repeat: 0 }
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: getAvatarColor(stat.employee.name),
                                width: 40,
                                height: 40,
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                mr: 1.5
                              }}
                            >
                              {stat.employee.name.charAt(0).toUpperCase()}
                            </Avatar>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.05, duration: 0.25 }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                              {stat.employee.name}
                            </Typography>
                          </motion.div>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <motion.div 
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + index * 0.05, duration: 0.2 }}
                            style={{ width: '30%' }}
                          >
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                Tareas
                              </Typography>
                              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                                {stat.totalTasks}
                              </Typography>
                            </Box>
                          </motion.div>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.05, duration: 0.2 }}
                            style={{ width: '30%' }}
                          >
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                Promedio
                              </Typography>
                              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                                {stat.averageScore.toFixed(1)}%
                              </Typography>
                            </Box>
                          </motion.div>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 + index * 0.05, duration: 0.2 }}
                            style={{ width: '30%' }}
                          >
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                Bono
                              </Typography>
                              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                                {stat.bonusPercentage}%
                              </Typography>
                            </Box>
                          </motion.div>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      )}

      {selectedEmployee && statistics && (
        <motion.div variants={itemVariants}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: getAvatarColor(selectedEmployeeName),
                    width: 36,
                    height: 36,
                    mr: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  {selectedEmployeeName.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  {selectedEmployeeName}
                </Typography>
              </Box>
              <PDFDownloadLink 
                document={
                  <ReportPDF 
                    employeeName={selectedEmployeeName} 
                    dateRange={dateRange} 
                    statistics={statistics} 
                    tasks={filteredTasks} 
                  />
                } 
                fileName={`informe_${selectedEmployeeName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`}
                style={{ textDecoration: 'none' }}
              >
                {({ blob, url, loading, error }) => (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<DownloadIcon sx={{ fontSize: '1rem' }} />}
                    disabled={loading}
                    size="small"
                    sx={{ 
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      px: 2,
                      py: 0.75
                    }}
                  >
                    {loading ? 'Generando...' : 'Exportar PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
                  whileHover={{ 
                    y: -4, 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card elevation={0} sx={{ 
                    border: '1px solid', 
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 2,
                    height: '100%',
                  }}>
                    <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Total de asignaciones
                      </Typography>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 500 }}>
                        {statistics.totalTasks}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.05, ease: [0.25, 0.1, 0.25, 1.0] }}
                  whileHover={{ 
                    y: -4, 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card elevation={0} sx={{ 
                    border: '1px solid', 
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 2,
                    height: '100%',
                  }}>
                    <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Promedio de desempeño
                      </Typography>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 500 }}>
                        {statistics.averageScore.toFixed(1)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
                  whileHover={{ 
                    y: -4, 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card elevation={0} sx={{ 
                    border: '1px solid', 
                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 2,
                    height: '100%',
                  }}>
                    <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Incentivo calculado
                      </Typography>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 500 }}>
                        {statistics.bonusPercentage}%
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>

            {/* Nuevo componente de asignaciones individuales */}
            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
                  Asignaciones evaluadas
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                  {Object.entries(statistics.tasksByType).map(([type, count]) => (
                    <Chip
                      key={type}
                      label={`${type}: ${count}`}
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        bgcolor: (theme) => alpha(theme.palette.taskTypes[type] || theme.palette.grey[300], mode === 'dark' ? 0.3 : 1),
                        color: (theme) => mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                        '& .MuiChip-label': { px: 1.5 },
                        border: 'none',
                        boxShadow: 'none',
                        borderRadius: '16px',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }
                      }}
                    />
                  ))}
                </Box>
                {filteredTasks.map((task, taskIndex) => {
                  const taskCriteria = [];
                  if (task.type === 'PRA') {
                    taskCriteria.push({ name: 'Calidad', weight: 60 });
                    taskCriteria.push({ name: 'Seguimiento de instrucciones', weight: 40 });
                  } else if (task.type === 'STD Times') {
                    taskCriteria.push({ name: 'Seguimiento de instrucciones', weight: 60 });
                    taskCriteria.push({ name: 'Calidad del servicio', weight: 40 });
                  } else if (task.type === 'Validacion') {
                    taskCriteria.push({ name: 'Calidad', weight: 60 });
                    taskCriteria.push({ name: 'Cumplimiento de tiempo', weight: 20 });
                    taskCriteria.push({ name: '0 errores encontrados en GA', weight: 20 });
                  } else if (task.type === 'Entrenamientos (Recibe)') {
                    taskCriteria.push({ name: 'Pruebas teóricas', weight: 40 });
                    taskCriteria.push({ name: 'Pruebas prácticas', weight: 60 });
                  } else if (task.type === 'Entrenamientos (Brinda)') {
                    taskCriteria.push({ name: 'Manejo del grupo', weight: 20 });
                    taskCriteria.push({ name: 'Transmisión de conocimientos', weight: 20 });
                    taskCriteria.push({ name: 'Entregables', weight: 20 });
                    taskCriteria.push({ name: 'Resultados obtenidos', weight: 20 });
                    taskCriteria.push({ name: 'Calidad del servicio', weight: 20 });
                  } else if (task.type === 'Refrescamientos (Brinda)') {
                    taskCriteria.push({ name: 'Contenido adecuado', weight: 20 });
                    taskCriteria.push({ name: 'Materiales didácticos', weight: 20 });
                    taskCriteria.push({ name: 'Explicación clara', weight: 20 });
                    taskCriteria.push({ name: 'Entregables', weight: 40 });
                  } else if (task.type === 'Práctica de procesos') {
                    taskCriteria.push({ name: 'Calidad', weight: 60 });
                    taskCriteria.push({ name: 'Seguimiento de instrucciones', weight: 40 });
                  }
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.25, 
                        delay: taskIndex * 0.03,
                        ease: [0.25, 0.1, 0.25, 1.0]
                      }}
                      whileHover={{ 
                        y: -5, 
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Card sx={{ mb: 2, borderRadius: 3, border: '1px solid', borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AssignmentIcon color="primary" sx={{ mr: 1.5, fontSize: '1.5rem' }} />
                                  <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
                                    {task.title}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Chip
                                      label={task.type}
                                      size="medium"
                                      sx={{
                                        height: '32px',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        bgcolor: (theme) => theme.palette.taskTypes[task.type] || theme.palette.grey[300],
                                        color: (theme) => mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                                        '& .MuiChip-label': { px: 2 },
                                        mr: 1.5,
                                        border: 'none',
                                        boxShadow: 'none',
                                        borderRadius: '16px',
                                      }}
                                    />
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Chip
                                      label={`${task.totalScore.toFixed(1)}%`}
                                      size="small"
                                      sx={{
                                        height: '28px',
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        bgcolor: (theme) => {
                                          if (task.totalScore >= 90) return alpha(theme.palette.success.main, 0.12);
                                          if (task.totalScore >= 70) return alpha(theme.palette.info.main, 0.12);
                                          if (task.totalScore >= 50) return alpha(theme.palette.warning.main, 0.12);
                                          return alpha(theme.palette.error.main, 0.12);
                                        },
                                        color: (theme) => {
                                          if (task.totalScore >= 90) return theme.palette.success.main;
                                          if (task.totalScore >= 70) return theme.palette.info.main;
                                          if (task.totalScore >= 50) return theme.palette.warning.main;
                                          return theme.palette.error.main;
                                        },
                                        '& .MuiChip-label': { px: 1.8 },
                                        mr: 1.5,
                                        border: 'none',
                                        boxShadow: 'none',
                                        borderRadius: '14px',
                                      }}
                                    />
                                  </motion.div>
                                </Box>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Fecha: {new Date(task.date + 'T00:00:00').toLocaleDateString()}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mb: 2,
                                  cursor: 'pointer',
                                  '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' },
                                  borderRadius: 1,
                                  p: 1
                                }}
                                onClick={() => {
                                  const newOpenCriteria = { ...openCriteria };
                                  newOpenCriteria[task.id] = !newOpenCriteria[task.id];
                                  setOpenCriteria(newOpenCriteria);
                                }}
                              >
                                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                  {openCriteria[task.id] ? <KeyboardArrowUpIcon fontSize="medium" /> : <KeyboardArrowDownIcon fontSize="medium" />}
                                  Criterios de evaluación ({Object.keys(task.evaluations || {}).length})
                                </Typography>
                              </Box>
                              <Collapse in={openCriteria[task.id] || false}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1.5,
                                    mt: 1.5,
                                    p: 1.5,
                                    borderRadius: 1,
                                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                    border: '1px solid',
                                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                                  }}
                                >
                                  {Object.entries(task.evaluations || {}).map(([criterio, puntuacion]) => {
                                    const criteriaItem = taskCriteria.find(c => c.name === criterio);
                                    const peso = criteriaItem ? criteriaItem.weight : 100 / Object.keys(task.evaluations || {}).length;
                                    let ponderado = 0;
                                    if ((task.type === 'PRA' || task.type === 'Validacion' || task.type === 'Práctica de procesos') && criterio === 'Calidad') {
                                      if (puntuacion < 70) ponderado = 0;
                                      else if (puntuacion >= 70 && puntuacion <= 80) ponderado = 10 + (puntuacion - 70) * 1;
                                      else if (puntuacion >= 81 && puntuacion <= 84) ponderado = 20 + (puntuacion - 80) * 2;
                                      else if (puntuacion >= 85 && puntuacion <= 89) ponderado = 27.5 + (puntuacion - 84) * 2.5;
                                      else if (puntuacion >= 90 && puntuacion <= 94) ponderado = 38 + (puntuacion - 89) * 2.5;
                                      else if (puntuacion >= 95 && puntuacion <= 100) ponderado = 50 + (puntuacion - 95) * 2;
                                    } else if (task.type === 'Práctica de procesos' && criterio === 'Seguimiento de instrucciones') {
                                      ponderado = puntuacion * 0.40;
                                    } else if (task.type === 'Entrenamientos (Recibe)') {
                                      if (criterio === 'Pruebas teóricas') {
                                        if (puntuacion < 75) ponderado = 0;
                                        else if (puntuacion >= 75 && puntuacion <= 85) ponderado = 10 + (puntuacion - 75) * 1;
                                        else if (puntuacion >= 86 && puntuacion <= 94) ponderado = 20 + (puntuacion - 85) * 1;
                                        else if (puntuacion >= 95 && puntuacion <= 96) ponderado = 30 + (puntuacion - 95) * 2.5;
                                        else if (puntuacion >= 97 && puntuacion <= 100) ponderado = 32.5 + (puntuacion - 96) * 1.875;
                                      } else if (criterio === 'Pruebas prácticas') {
                                        if (puntuacion < 75) ponderado = 0;
                                        else if (puntuacion >= 75 && puntuacion <= 85) ponderado = 10 + (puntuacion - 75) * 1.5;
                                        else if (puntuacion >= 86 && puntuacion <= 94) ponderado = 25 + (puntuacion - 85) * 1.11;
                                        else if (puntuacion >= 95 && puntuacion <= 96) ponderado = 35 + (puntuacion - 95) * 7.5;
                                        else if (puntuacion >= 97 && puntuacion <= 100) ponderado = 42.5 + (puntuacion - 96) * 4.375;
                                      }
                                    } else {
                                      ponderado = (puntuacion * peso / 100).toFixed(1);
                                    }
                                    return (
                                      <Box
                                        key={criterio}
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          p: 1,
                                          borderRadius: 1,
                                          bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                                        }}
                                      >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Typography variant="body1">{criterio}</Typography>
                                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                            (Peso: {peso}%)
                                          </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Chip
                                            size="small"
                                            label={`${puntuacion}%`}
                                            sx={{
                                              height: '24px',
                                              fontSize: '0.85rem',
                                              fontWeight: 700,
                                              bgcolor: (theme) => {
                                                if (puntuacion >= 90) return alpha(theme.palette.success.main, 0.1);
                                                if (puntuacion >= 70) return alpha(theme.palette.info.main, 0.1);
                                                if (puntuacion >= 50) return alpha(theme.palette.warning.main, 0.1);
                                                return alpha(theme.palette.error.main, 0.1);
                                              },
                                              color: (theme) => {
                                                if (puntuacion >= 90) return theme.palette.success.main;
                                                if (puntuacion >= 70) return theme.palette.info.main;
                                                if (puntuacion >= 50) return theme.palette.warning.main;
                                                return theme.palette.error.main;
                                              },
                                              '& .MuiChip-label': { px: 1.5 },
                                              mr: 1.5,
                                              border: 'none',
                                              boxShadow: 'none',
                                              borderRadius: '12px',
                                              transition: 'all 0.2s ease-in-out',
                                              '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                              }
                                            }}
                                          />
                                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                            Ponderado: {ponderado}%
                                          </Typography>
                                        </Box>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              </Collapse>
                            </Grid>
                            {task.comments && (
                              <Grid item xs={12}>
                                <Box
                                  sx={{
                                    mt: 1.5,
                                    p: 1.5,
                                    borderRadius: 1,
                                    bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                                    border: '1px dashed',
                                    borderColor: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <CommentIcon sx={{ fontSize: '1rem', mr: 1.5, color: 'text.secondary' }} />
                                    <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                                      Comentarios:
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2">{task.comments}</Typography>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      )}

      {selectedEmployee && !statistics && (
        <motion.div variants={itemVariants}>
          <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 3 }}>
            No hay tareas registradas para este empleado en el rango de fechas seleccionado
          </Typography>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ReportTab;
