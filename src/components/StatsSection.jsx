import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  alpha,
  Button,
  Tooltip as MuiTooltip,
} from '@mui/material';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import { PDFDownloadLink } from '@react-pdf/renderer';
import StatsPDF from './StatsPDF';
import { ColorModeContext } from '../main';

const StatsSection = ({ tasks, taskTypes }) => {
  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskTypeStats, setTaskTypeStats] = useState([]);
  const [criteriaStats, setCriteriaStats] = useState([]);
  const [lowPerformanceTasks, setLowPerformanceTasks] = useState([]);
  
  // Colores para los gráficos
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
  ];

  // Filtrar tareas evaluadas y aplicar filtro de fecha
  useEffect(() => {
    // Filtrar solo tareas que han sido evaluadas (tienen totalScore)
    const evaluatedTasks = tasks.filter(task => 
      task.totalScore !== undefined && task.totalScore !== null
    );
    
    // Aplicar filtro de fechas si está configurado
    let filtered = [...evaluatedTasks];
    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.date);
        const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;
        
        return (!startDate || taskDate >= startDate) && 
               (!endDate || taskDate <= endDate);
      });
    }
    
    setFilteredTasks(filtered);
  }, [tasks, dateRange]);

  // Calcular estadísticas por tipo de tarea
  useEffect(() => {
    if (filteredTasks.length === 0) return;

    // Agrupar tareas por tipo
    const tasksByType = {};
    filteredTasks.forEach(task => {
      if (!tasksByType[task.type]) {
        tasksByType[task.type] = [];
      }
      tasksByType[task.type].push(task);
    });

    // Calcular estadísticas para cada tipo
    const typeStats = Object.keys(tasksByType).map(type => {
      const typeTasks = tasksByType[type];
      const avgScore = typeTasks.reduce((sum, task) => sum + task.totalScore, 0) / typeTasks.length;
      
      // Contar tareas por rango de calificación
      const scoreDistribution = {
        excellent: typeTasks.filter(t => t.totalScore >= 90).length,
        good: typeTasks.filter(t => t.totalScore >= 70 && t.totalScore < 90).length,
        average: typeTasks.filter(t => t.totalScore >= 50 && t.totalScore < 70).length,
        poor: typeTasks.filter(t => t.totalScore < 50).length,
      };
      
      return {
        type,
        count: typeTasks.length,
        avgScore,
        scoreDistribution,
      };
    });
    
    // Ordenar por cantidad de tareas (descendente)
    typeStats.sort((a, b) => b.count - a.count);
    
    setTaskTypeStats(typeStats);
  }, [filteredTasks]);

  // Calcular estadísticas por criterio
  useEffect(() => {
    if (filteredTasks.length === 0) return;

    // Recopilar todos los criterios evaluados
    const allCriteria = {};
    
    filteredTasks.forEach(task => {
      if (!task.evaluations) return;
      
      Object.entries(task.evaluations).forEach(([criterio, puntuacion]) => {
        if (!allCriteria[criterio]) {
          allCriteria[criterio] = {
            name: criterio,
            totalScore: 0,
            count: 0,
            belowPerfect: 0,
            impactScore: 0,
            affectedTaskTypes: new Set(), // Conjunto para almacenar los tipos de tarea afectados
          };
        }
        
        allCriteria[criterio].totalScore += puntuacion;
        allCriteria[criterio].count += 1;
        
        // Contar criterios que no alcanzaron el 100%
        if (puntuacion < 100) {
          allCriteria[criterio].belowPerfect += 1;
          // Calcular el impacto (100 - puntuación)
          allCriteria[criterio].impactScore += (100 - puntuacion);
          // Registrar el tipo de tarea afectado
          allCriteria[criterio].affectedTaskTypes.add(task.type);
        }
      });
    });
    
    // Calcular promedios y ordenar por impacto
    const criteriaArray = Object.values(allCriteria).map(criteria => ({
      ...criteria,
      avgScore: criteria.totalScore / criteria.count,
      impactPercentage: (criteria.belowPerfect / criteria.count) * 100,
      // Convertir el Set a un array para facilitar su uso en el renderizado
      affectedTaskTypes: Array.from(criteria.affectedTaskTypes),
    }));
    
    // Ordenar por impacto (descendente)
    criteriaArray.sort((a, b) => b.impactScore - a.impactScore);
    
    setCriteriaStats(criteriaArray);
  }, [filteredTasks]);

  // Identificar tareas con bajo rendimiento
  useEffect(() => {
    if (filteredTasks.length === 0) return;

    // Encontrar tareas con calificación por debajo del 70%
    const lowScoreTasks = filteredTasks
      .filter(task => task.totalScore < 70)
      .sort((a, b) => a.totalScore - b.totalScore) // Ordenar de menor a mayor
      .slice(0, 10); // Limitar a las 10 peores
    
    setLowPerformanceTasks(lowScoreTasks);
  }, [filteredTasks]);

  const handleDateChange = (field) => (event) => {
    setDateRange(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Preparar datos para el gráfico de Pareto (criterios con mayor impacto)
  const paretoData = criteriaStats.slice(0, 8).map((criteria, index) => ({
    name: criteria.name,
    impact: criteria.impactScore,
    fill: COLORS[index % COLORS.length],
  }));

  // Preparar datos para el gráfico de barras (promedio por tipo de tarea)
  const barData = taskTypeStats.map((stat, index) => ({
    name: stat.type,
    promedio: parseFloat(stat.avgScore.toFixed(2)),
    fill: COLORS[index % COLORS.length],
  }));

  // Preparar datos para el gráfico de distribución de calificaciones
  const distributionData = [
    { name: 'Excelente (90-100%)', value: filteredTasks.filter(t => t.totalScore >= 90).length },
    { name: 'Bueno (70-89%)', value: filteredTasks.filter(t => t.totalScore >= 70 && t.totalScore < 90).length },
    { name: 'Regular (50-69%)', value: filteredTasks.filter(t => t.totalScore >= 50 && t.totalScore < 70).length },
    { name: 'Deficiente (<50%)', value: filteredTasks.filter(t => t.totalScore < 50).length },
  ];

  // Función para obtener el color según la calificación
  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3
      }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center',
          fontWeight: 500,
          color: 'primary.main',
          mb: 0
        }}>
          <AssessmentIcon sx={{ mr: 1 }} /> Estadísticas de Evaluaciones
        </Typography>
        <PDFDownloadLink 
          document={
            <StatsPDF 
              dateRange={dateRange} 
              filteredTasks={filteredTasks} 
              taskTypeStats={taskTypeStats} 
              criteriaStats={criteriaStats} 
              lowPerformanceTasks={lowPerformanceTasks} 
            />
          } 
          fileName={`estadisticas_${dateRange.startDate || 'completo'}_${dateRange.endDate || ''}.pdf`}
          style={{ textDecoration: 'none' }}
        >
          {({ blob, url, loading, error }) => (
            <MuiTooltip title="Descargar PDF">
              <Button 
                variant="outlined" 
                color="primary" 
                size="small" 
                startIcon={<DownloadIcon />}
                disabled={loading || filteredTasks.length === 0}
              >
                {loading ? 'Generando...' : 'Descargar PDF'}
              </Button>
            </MuiTooltip>
          )}
        </PDFDownloadLink>
      </Box>
      
      {/* Filtros */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          boxShadow: theme => `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterListIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="subtitle1">Filtros</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
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
      </Paper>

      {/* Resumen de métricas */}
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
                  Tareas Evaluadas
                </Typography>
                <AssessmentIcon color="primary" />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500, my: 1 }}>
                {filteredTasks.length}
              </Typography>
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
                  Criterios Imperfectos
                </Typography>
                <BarChartIcon color="secondary" />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500, my: 1 }}>
                {criteriaStats.filter(c => c.belowPerfect > 0).length}
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
                  Promedio General
                </Typography>
                <PieChartIcon color="success" />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500, my: 1 }}>
                {filteredTasks.length > 0 
                  ? (filteredTasks.reduce((sum, task) => sum + task.totalScore, 0) / filteredTasks.length).toFixed(2) + '%'
                  : '0%'}
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
                  Tipos de Tarea
                </Typography>
                <TableChartIcon color="warning" />
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 500, my: 1 }}>
                {taskTypeStats.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos y tablas */}
      <Grid container spacing={3}>
        {/* Gráfico de Pareto - Criterios con mayor impacto */}
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
            <Typography variant="h6" gutterBottom>Criterios con Mayor Impacto</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Muestra los criterios que más afectan el rendimiento general
            </Typography>
            <Box sx={{ height: 300 }}>
              {paretoData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={paretoData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="impact" name="Impacto">
                      {paretoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay datos suficientes para mostrar
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de barras - Promedio por tipo de tarea */}
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
            <Typography variant="h6" gutterBottom>Promedio por Tipo de Tarea</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Muestra el rendimiento promedio para cada tipo de tarea
            </Typography>
            <Box sx={{ height: 300 }}>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="promedio" name="Promedio (%)">
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay datos suficientes para mostrar
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de pastel - Distribución de calificaciones */}
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
            <Typography variant="h6" gutterBottom>Distribución de Calificaciones</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Muestra cómo se distribuyen las calificaciones en rangos
            </Typography>
            <Box sx={{ height: 300 }}>
              {filteredTasks.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay datos suficientes para mostrar
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Tabla - Tareas con bajo rendimiento */}
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
            <Typography variant="h6" gutterBottom>Tareas con Bajo Rendimiento</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Muestra las tareas con calificaciones más bajas
            </Typography>
            {lowPerformanceTasks.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Título</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell align="right">Calificación</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowPerformanceTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>
                          <Chip 
                            label={task.type} 
                            size="small" 
                            sx={{ 
                              bgcolor: mode === 'dark' ? theme.palette.taskTypes[task.type] || '#333333' : null,
                              fontSize: '0.7rem',
                              height: 20,
                            }} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${task.totalScore.toFixed(2)}%`} 
                            size="small" 
                            color={getScoreColor(task.totalScore)}
                            sx={{ 
                              fontSize: '0.7rem',
                              height: 20,
                              fontWeight: 'bold'
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography variant="body1" color="text.secondary">
                  No hay tareas con bajo rendimiento
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Criterios por debajo del 100% - Diseño mejorado */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              boxShadow: theme => `0 2px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              pb: 2,
              borderBottom: 1,
              borderColor: 'divider'
            }}>
              <AssessmentIcon 
                color="error" 
                sx={{ 
                  mr: 1.5, 
                  fontSize: 28,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.7 },
                    '50%': { opacity: 1 },
                    '100%': { opacity: 0.7 },
                  }
                }} 
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Criterios por Debajo del 100%</Typography>
                <Typography variant="body2" color="text.secondary">
                  Detalle de los criterios que no alcanzaron la calificación perfecta
                </Typography>
              </Box>
            </Box>
            
            {criteriaStats.length > 0 ? (
              <Box>
                <Grid container spacing={2}>
                  {criteriaStats.filter(c => c.belowPerfect > 0).map((criteria) => {
                    // Calcular color basado en el promedio
                    const getColor = (score) => {
                      if (score >= 90) return 'success';
                      if (score >= 70) return 'primary';
                      if (score >= 50) return 'warning';
                      return 'error';
                    };
                    
                    const color = getColor(criteria.avgScore);
                    const progressColor = theme.palette[color].main;
                    
                    return (
                      <Grid item xs={12} md={6} lg={4} key={criteria.name}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            height: '100%',
                            borderRadius: 2,
                            border: 1,
                            borderColor: 'divider',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': { 
                              transform: 'translateY(-4px)',
                              boxShadow: theme => `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                              {criteria.name}
                            </Typography>
                            <Chip 
                              label={`${criteria.avgScore.toFixed(0)}%`} 
                              color={color} 
                              size="small"
                              sx={{ fontWeight: 'bold' }}
                            />
                          </Box>
                          
                          {/* Barra de progreso */}
                          <Box sx={{ mt: 1, mb: 2, position: 'relative', height: 8, bgcolor: alpha(progressColor, 0.15), borderRadius: 1 }}>
                            <Box 
                              sx={{ 
                                position: 'absolute', 
                                left: 0, 
                                top: 0, 
                                height: '100%', 
                                width: `${criteria.avgScore}%`, 
                                bgcolor: progressColor,
                                borderRadius: 1,
                                transition: 'width 1s ease-in-out'
                              }} 
                            />
                          </Box>
                          
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Tareas Afectadas
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {criteria.belowPerfect} de {criteria.count}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                % Afectación
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {criteria.impactPercentage.toFixed(1)}%
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Impacto Total
                              </Typography>
                              <Typography variant="body2" fontWeight="medium">
                                {criteria.impactScore.toFixed(1)} puntos
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary" display="block">
                                Tipos de Tarea Afectados
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                {criteria.affectedTaskTypes.map(type => (
                                  <Chip 
                                    key={type}
                                    label={type} 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: mode === 'dark' ? theme.palette.taskTypes[type] || '#333333' : null,
                                      fontSize: '0.7rem',
                                      height: 20,
                                    }} 
                                  />
                                ))}
                              </Box>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                <Typography variant="body1" color="text.secondary">
                  No hay datos suficientes para mostrar
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsSection;