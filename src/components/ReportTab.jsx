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
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';
import GeneralReportPDF from './GeneralReportPDF';
import { ColorModeContext } from '../main';
import { useTheme } from '@mui/material/styles';

const ReportTab = ({ employees, tasks }) => {
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
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  
  const [showDetails, setShowDetails] = useState(false);
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
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Seleccionar Asignado</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              label="Seleccionar Asignado"
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
            label="Fecha Inicio"
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
      
      {!selectedEmployee && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Informes
            </Typography>
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
          </Box>
          <Grid container spacing={2}>
            {employeeStats.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat.employee.id}>
                <Card 
                  onClick={() => setSelectedEmployee(stat.employee.id)}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                      <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                        {stat.employee.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ width: '30%' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          Tareas
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                          {stat.totalTasks}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ width: '30%' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          Promedio
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                          {stat.averageScore.toFixed(1)}%
                        </Typography>
                      </Box>
                      
                      <Box sx={{ width: '30%' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          Bono
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                          {stat.bonusPercentage}%
                        </Typography>
                      </Box>
                    </Box>
                    

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {selectedEmployee && statistics && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Informe de {selectedEmployeeName}
            </Typography>
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
                  variant="contained" 
                  color="primary" 
                  startIcon={<DownloadIcon />}
                  disabled={loading}
                >
                  {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tareas Completadas
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {statistics.totalTasks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Promedio General
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {statistics.averageScore.toFixed(2)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bono Obtenido
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {statistics.bonusPercentage}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tareas Evaluadas por Tipo
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {Object.entries(statistics.tasksByType).map(([type, count]) => (
                      <Chip
                        key={type}
                        label={`${type}: ${count}`}
                        sx={{
                          bgcolor: (theme) => {
                            if (type === 'PRA') return theme.palette.taskTypes.PRA;
                            if (type === 'STD Times') return theme.palette.taskTypes["STD Times"];
                            if (type === 'Entrenamientos (Recibe)') return theme.palette.taskTypes["Entrenamientos (Recibe)"];
                            if (type === 'Entrenamientos (Brinda)') return theme.palette.taskTypes["Entrenamientos (Brinda)"];
                            if (type === 'Refrescamientos (Brinda)') return theme.palette.taskTypes["Refrescamientos (Brinda)"];
                            if (type === 'Práctica de procesos') return theme.palette.taskTypes["Práctica de procesos"];
                            return theme.palette.taskTypes.Validation;
                          },
                          color: 'text.primary',
                          fontWeight: 'medium',
                          fontSize: '0.9rem',
                          py: 2.5,
                          border: (theme) => mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
                          '& .MuiChip-label': { px: 1.5 },
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                        icon={<AssignmentIcon />}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={<Switch checked={showDetails} onChange={(e) => setShowDetails(e.target.checked)} />}
              label="Mostrar detalles de evaluación"
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  '& th': { 
                    fontWeight: 'bold',
                    color: mode === 'dark' ? 'text.primary' : 'text.primary',
                    bgcolor: 'background.paper'
                  } 
                }}>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell align="right">Calificación</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <TableRow sx={{
                      bgcolor: (theme) => {
                        if (task.type === 'PRA') return theme.palette.taskTypes.PRA;
                        if (task.type === 'STD Times') return theme.palette.taskTypes["STD Times"];
                        if (task.type === 'Entrenamientos (Recibe)') return theme.palette.taskTypes["Entrenamientos (Recibe)"];
                        if (task.type === 'Entrenamientos (Brinda)') return theme.palette.taskTypes["Entrenamientos (Brinda)"];
                        if (task.type === 'Refrescamientos (Brinda)') return theme.palette.taskTypes["Refrescamientos (Brinda)"];
                        if (task.type === 'Práctica de procesos') return theme.palette.taskTypes["Práctica de procesos"];
                        return theme.palette.taskTypes.Validation;
                      },
                      '& > td': { borderBottom: '1px solid rgba(224, 224, 224, 0.2)' }
                    }}>
                      <TableCell>{task.date}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.type}</TableCell>
                      <TableCell align="right">{task.totalScore.toFixed(2)}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={showDetails} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Criterios de Evaluación
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow sx={{ bgcolor: 'background.paper', '& th': { fontWeight: 'bold' } }}>
                                  <TableCell>Criterio</TableCell>
                                  <TableCell align="right">Peso</TableCell>
                                  <TableCell align="right">Puntuación</TableCell>
                                  <TableCell align="right">Ponderado</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Object.entries(task.evaluations || {}).map(([criterio, puntuacion]) => {
                                  let peso;
                                  let descripcion;
                                  
                                  // Asignar pesos y descripciones según el tipo de tarea
                                  if (task.type === 'PRA') {
                                    if (criterio === 'Calidad') {
                                      peso = 60;
                                      descripcion = 'Se revisa una muestra del 5% al 15% de los casos realizados, dependiendo de la población del estudio.';
                                    } else if (criterio === 'Seguimiento de instrucciones') {
                                      peso = 40;
                                      descripcion = 'Se siguen las instrucciones del ingeniero a cargo de la prueba para la realización de la misma. Retroalimentación recibida por el ingeniero a cargo de la prueba.';
                                    } else {
                                      peso = 40; // Valor por defecto
                                      descripcion = 'Criterio adicional para PRA.';
                                    }
                                  } else if (task.type === 'STD Times') {
                                    if (criterio === 'Seguimiento de instrucciones') {
                                      peso = 60;
                                      descripcion = 'Cumplir indicaciones del ingeniero.';
                                    } else if (criterio === 'Calidad') {
                                      peso = 40;
                                      descripcion = 'Retroalimentación del ingeniero. Retroalimentación de producción: Evaluación aleatoria del equipo de producción.';
                                    } else {
                                      peso = 40; // Valor por defecto
                                      descripcion = 'Criterio adicional para STD Times.';
                                    }
                                  } else if (task.type === 'Validacion') {
                                    if (criterio === 'Calidad') {
                                      peso = 60;
                                      descripcion = 'Se revisa una muestra del 15% de los casos realizados en la asignación.';
                                    } else if (criterio === 'Tiempo') {
                                      peso = 20;
                                      descripcion = 'La validación se realiza dentro del periodo establecido.';
                                    } else if (criterio === 'Funcionalidad') {
                                      peso = 20;
                                      descripcion = 'Se realiza la validación correctamente para asegurar que la nueva versión de Treat no tenga errores en GA.';
                                    } else {
                                      peso = 20; // Valor por defecto
                                      descripcion = 'Criterio adicional para Validación.';
                                    }
                                  } else if (task.type === 'Entrenamientos (Recibe)') {
                                    if (criterio === 'Asistencia') {
                                      peso = 50;
                                      descripcion = 'Asistencia puntual a todas las sesiones de entrenamiento programadas.';
                                    } else if (criterio === 'Participación') {
                                      peso = 30;
                                      descripcion = 'Participación activa durante las sesiones de entrenamiento.';
                                    } else if (criterio === 'Evaluación final') {
                                      peso = 20;
                                      descripcion = 'Resultado de la evaluación final del entrenamiento recibido.';
                                    } else {
                                      peso = 20; // Valor por defecto
                                      descripcion = 'Criterio adicional para Entrenamientos.';
                                    }
                                  } else { // Otros tipos de tareas
                                    peso = 100 / Object.keys(task.evaluations || {}).length; // Distribución equitativa
                                    descripcion = `Criterio de evaluación para ${task.type}.`;
                                  }
                                  
                                  // Aplicar regla especial para criterio de Calidad en tareas PRA y Validacion
                                  let ponderado = 0;
                                  if ((task.type === 'PRA' || task.type === 'Validacion') && 
                                      criterio === 'Calidad' && puntuacion < 70) {
                                    // Si calidad es menor a 70%, se pierde todo el porcentaje
                                    ponderado = 0;
                                  } else {
                                    ponderado = (puntuacion * peso / 100).toFixed(2);
                                  }
                                  return (
                                    <React.Fragment key={criterio}>
                                      <TableRow>
                                        <TableCell component="th" scope="row">{criterio}</TableCell>
                                        <TableCell align="right">{peso}%</TableCell>
                                        <TableCell align="right">{puntuacion}%</TableCell>
                                        <TableCell align="right">{ponderado}%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell colSpan={4} sx={{ pb: 2, pt: 0, color: 'text.secondary' }}>
                                          {descripcion}
                                        </TableCell>
                                      </TableRow>
                                    </React.Fragment>
                                  );
                                })}
                              </TableBody>
                            </Table>
                            {task.comments && (
                              <Box sx={{
                                mt: 2,
                                p: 2,
                                bgcolor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.paper : '#f8f9fa',
                                borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
                                borderRadius: 1
                              }}>
                                <Typography variant="subtitle2" color="primary" gutterBottom>Comentarios de la tarea:</Typography>
                                <Typography variant="body2" color="text.primary">{task.comments}</Typography>
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {selectedEmployee && !statistics && (
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 3 }}>
          No hay tareas registradas para este empleado en el rango de fechas seleccionado
        </Typography>
      )}
    </Box>
  );
};

export default ReportTab;