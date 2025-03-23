import React, { useState, useMemo, useEffect } from 'react';
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
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportPDF from './ReportPDF';

const ReportTab = ({ employees, tasks }) => {
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
      const matchesEmployee = task.employeeId === selectedEmployee;
      const taskDate = new Date(task.date);
      const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
      const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

      const withinDateRange =
        (!startDate || taskDate >= startDate) &&
        (!endDate || taskDate <= endDate);

      return matchesEmployee && withinDateRange;
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
        const employeeTasks = tasks.filter(task => task.employeeId === employee.id);
        
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
            <InputLabel>Seleccionar Empleado</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              label="Seleccionar Empleado"
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
          <Typography variant="h5" gutterBottom>
            Resumen de Todos los Empleados
          </Typography>
          <Grid container spacing={2}>
            {employeeStats.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat.employee.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {stat.employee.name}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tareas Completadas
                      </Typography>
                      <Typography variant="h5" color="primary">
                        {stat.totalTasks}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Promedio General
                      </Typography>
                      <Typography variant="h5" color="primary">
                        {stat.averageScore.toFixed(2)}%
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Bono Obtenido
                      </Typography>
                      <Typography variant="h5" color="primary">
                        {stat.bonusPercentage}%
                      </Typography>
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
                    Tareas por Tipo
                  </Typography>
                  {Object.entries(statistics.tasksByType).map(([type, count]) => (
                    <Typography key={type}>
                      {type}: {count}
                    </Typography>
                  ))}
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
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
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
                      bgcolor: task.type === 'PRA' ? '#e3f2fd' : '#f3e5f5',
                      '& > td': { borderBottom: '1px solid rgba(224, 224, 224, 1)' }
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
                                <TableRow>
                                  <TableCell>Criterio</TableCell>
                                  <TableCell align="right">Peso</TableCell>
                                  <TableCell align="right">Puntuación</TableCell>
                                  <TableCell align="right">Ponderado</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Object.entries(task.evaluations || {}).map(([criterio, puntuacion]) => {
                                  const peso = task.type === 'PRA' ?
                                    (criterio === 'Calidad' ? 60 : 40) :
                                    (criterio === 'Calidad' ? 60 : 20);
                                  const ponderado = (puntuacion * peso / 100).toFixed(2);
                                  let descripcion;
                                  if (task.type === 'PRA') {
                                    descripcion = criterio === 'Calidad' ?
                                      'Se revisa una muestra del 5% al 15% de los casos realizados, dependiendo de la población del estudio.' :
                                      'Se siguen las instrucciones del ingeniero a cargo de la prueba para la realización de la misma. Retroalimentación recibida por el ingeniero a cargo de la prueba.';
                                  } else {
                                    if (criterio === 'Calidad') {
                                      descripcion = 'Se revisa una muestra del 15% de los casos realizados en la asignación.';
                                    } else if (criterio === 'Tiempo') {
                                      descripcion = 'La validación se realiza dentro del periodo establecido.';
                                    } else {
                                      descripcion = 'Se realiza la validación correctamente para asegurar que la nueva versión de Treat no tenga errores en GA.';
                                    }
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