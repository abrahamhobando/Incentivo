import React, { useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Stack,
  Tooltip,
  IconButton,
  Avatar,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CommentIcon from '@mui/icons-material/Comment';
import { ColorModeContext } from '../main';
import { useTheme } from '@mui/material/styles';

const TaskDialog = ({ open, onClose, task, taskTypes, onSave, employees }) => {
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
  
  // Función para obtener el nombre del empleado
  const getEmployeeName = (employeeId) => {
    return employees.find(emp => emp.id === employeeId)?.name || 'Usuario';
  };
  const [editedTask, setEditedTask] = React.useState(task);

  React.useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleEvaluationChange = (criteriaName, value) => {
    setEditedTask(prev => ({
      ...prev,
      evaluations: {
        ...prev.evaluations,
        [criteriaName]: parseFloat(value) || 0,
      },
    }));
  };

  const calculateTotalScore = () => {
    if (!editedTask?.type || !taskTypes[editedTask.type]) return null;
    
    // Verificar si hay al menos un criterio evaluado
    const hasEvaluations = taskTypes[editedTask.type].criteria.some(
      criterion => editedTask.evaluations[criterion.name] !== undefined && 
                 editedTask.evaluations[criterion.name] !== null && 
                 editedTask.evaluations[criterion.name] !== ''
    );
    
    if (!hasEvaluations) return null;
    
    return taskTypes[editedTask.type].criteria.reduce((total, criterion) => {
      let score = editedTask.evaluations[criterion.name] || 0;
      
      // Aplicar regla especial para criterio de Calidad en tareas PRA y Validacion
      if ((editedTask.type === 'PRA' || editedTask.type === 'Validacion') && 
          criterion.name === 'Calidad') {
        // Si calidad es menor a 70, el puntaje será 0
        // Si calidad es >= 70, se calcula proporcionalmente con la fórmula ((Nota - 69) / 31) * 60
        score = score < 70 ? 0 : ((score - 69) / 31) * 60;
        return total + score;
      }
      
      if (editedTask.type === 'Práctica de procesos') {
        if (criterion.name === 'Calidad') {
          score = score < 70 ? 0 : ((score - 69) / 31) * 60;
        } else if (criterion.name === 'Seguimiento de instrucciones') {
          score = score * 0.40;
        }
        // Para Práctica de procesos, devolvemos directamente la suma de los puntajes calculados
        // en lugar de aplicar los pesos de los criterios (ya que los pesos están incluidos en las fórmulas)
        return total + score;
      }
      
      return total + (score * criterion.weight) / 100;
    }, 0);
  };

  const handleSave = () => {
    const totalScore = calculateTotalScore();
    onSave({ ...editedTask, totalScore });
    onClose();
  };

  if (!task || !editedTask) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 1 }} /> Detalles de la Tarea: {task.title}
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ width: '100%' }}>
          <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: '8px' }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
              Información Básica
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Título de la Tarea"
                  value={editedTask.title || ''}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                  size="small"
                  required
                  InputProps={{
                    startAdornment: <AssignmentIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                  <InputLabel>Asignada a</InputLabel>
                  <Select
                    value={editedTask.employeeId || ''}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, employeeId: e.target.value }))}
                    label="Asignada a"
                    required
                    startAdornment={
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mr: 1 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getAvatarColor(editedTask.employeeId ? getEmployeeName(editedTask.employeeId) : 'Usuario'),
                          width: 24,
                          height: 24,
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {editedTask.employeeId ? getEmployeeName(editedTask.employeeId).charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                    </Box>
                  }
                  >
                    {employees?.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.name}
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
                  value={editedTask.date || ''}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, date: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  InputProps={{
                    startAdornment: <DateRangeIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon color="action" />
                  <Typography variant="subtitle1">
                    Tipo de Tarea: <Chip 
                      label={task.type} 
                      size="small" 
                      sx={{ 
                        bgcolor: mode === 'dark' ? theme.palette.taskTypes[task.type === 'PRA' ? 'PRA' : 'Validation'] || 'grey.800' : taskTypes[task.type]?.color || 'grey.200',
                        color: mode === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.87)',
                        fontWeight: 'medium',
                        border: mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
                        '& .MuiChip-label': { px: 1 },
                        transition: 'all 0.2s ease-in-out'
                      }} 
                    />
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {taskTypes[task.type] && (
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
                {taskTypes[task.type].criteria.map((criterion) => (
                  <Grid item xs={12} md={6} key={criterion.name}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        {criterion.name} <Chip label={`${criterion.weight}%`} size="small" color="primary" variant="outlined" sx={{ mx: 1 }} />
                        {(task.type === 'PRA' || task.type === 'Validacion') && criterion.name === 'Calidad' && (
                          <Tooltip title="Si la calificación es menor al 70%, se pierde todo el porcentaje de este rubro" arrow placement="top">
                            <InfoOutlinedIcon fontSize="small" color="warning" />
                          </Tooltip>
                        )}
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        placeholder="Ingrese calificación (0-100)"
                        value={editedTask.evaluations[criterion.name] || ''}
                        onChange={(e) => handleEvaluationChange(criterion.name, e.target.value)}
                        InputProps={{ 
                          inputProps: { min: 0, max: 100 },
                        }}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                      {criterion.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {criterion.description}
                        </Typography>
                      )}
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
              value={editedTask.comments || ''}
              onChange={(e) => setEditedTask(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Ingrese comentarios adicionales sobre la tarea"
              InputProps={{
                startAdornment: <CommentIcon color="action" sx={{ mt: 1.5, mr: 1 }} />,
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px', px: 3 }}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          sx={{ 
            borderRadius: '8px', 
            px: 3,
            fontWeight: 'bold',
            boxShadow: 2
          }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
