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
  alpha,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';
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
      if ((editedTask.type === 'PRA' || editedTask.type === 'Validacion' || editedTask.type === 'Práctica de procesos') && 
          criterion.name === 'Calidad') {
        // Si calidad es menor a 70, el puntaje será 0
        if (score < 70) {
          return total + 0;
        }
        
        // Fórmulas por rangos según la tabla proporcionada
        let calidadPercentage = 0;
        
        if (score >= 70 && score <= 80) {
          // Para notas de 70 a 80: Porcentaje de Calidad = 10 + (Nota - 70) × 1
          calidadPercentage = 10 + (score - 70) * 1;
        } else if (score >= 81 && score <= 84) {
          // Para notas de 81 a 84: Porcentaje de Calidad = 20 + (Nota - 80) × 2
          calidadPercentage = 20 + (score - 80) * 2;
        } else if (score >= 85 && score <= 89) {
          // Para notas de 85 a 89: Porcentaje de Calidad = 27.5 + (Nota - 84) × 2.5
          calidadPercentage = 27.5 + (score - 84) * 2.5;
        } else if (score >= 90 && score <= 94) {
          // Para notas de 90 a 94: Porcentaje de Calidad = 38 + (Nota - 89) × 2.5
          calidadPercentage = 38 + (score - 89) * 2.5;
        } else if (score >= 95 && score <= 100) {
          // Para notas de 95 a 100: Porcentaje de Calidad = 50 + (Nota - 95) × 2
          calidadPercentage = 50 + (score - 95) * 2;
        }
        
        return total + calidadPercentage;
      }
      
      // Para Práctica de procesos, solo aplicamos la regla especial para el criterio 'Seguimiento de instrucciones'
      if (editedTask.type === 'Práctica de procesos' && criterion.name === 'Seguimiento de instrucciones') {
        score = score * 0.40;
        return total + score;
      }
      
      // Aplicar regla especial para Entrenamientos (Recibe)
      if (editedTask.type === 'Entrenamientos (Recibe)') {
        if (criterion.name === 'Pruebas teóricas') {
          // Si la nota es menor a 75, el puntaje será 0
          if (score < 75) return total + 0;
          
          // Fórmulas según los rangos de notas para pruebas teóricas
          if (score >= 75 && score <= 85) {
            score = 10 + (score - 75) * 1;
          } else if (score >= 86 && score <= 94) {
            score = 20 + (score - 85) * 1;
          } else if (score >= 95 && score <= 96) {
            score = 30 + (score - 95) * 2.5;
          } else if (score >= 97 && score <= 100) {
            score = 32.5 + (score - 96) * 1.875;
          }
          return total + score;
        }
        if (criterion.name === 'Pruebas prácticas') {
          // Si la nota es menor a 75, el puntaje será 0
          if (score < 75) return total + 0;
          
          // Fórmulas según los rangos de notas para pruebas prácticas
          if (score >= 75 && score <= 85) {
            score = 10 + (score - 75) * 1.5;
          } else if (score >= 86 && score <= 94) {
            score = 25 + (score - 85) * 1.11;
          } else if (score >= 95 && score <= 96) {
            score = 35 + (score - 95) * 7.5;
          } else if (score >= 97 && score <= 100) {
            // Nueva fórmula ajustada para que con nota 100 dé exactamente 60%
            score = 42.5 + (score - 96) * (17.5 / 4); // 17.5/4 = 4.375, con nota 100 da exactamente 60%
          }
          return total + score;
        }
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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          background: mode === 'dark' 
            ? 'linear-gradient(to bottom, rgba(35,35,40,0.9), rgba(25,25,30,0.95))' 
            : 'linear-gradient(to bottom, rgba(250,250,252,0.97), rgba(255,255,255,0.99))',
          backdropFilter: 'blur(10px)',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        pb: 1,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
      }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {task.id ? 'Editar Tarea' : 'Nueva Tarea'}
        </Typography>
        <IconButton 
          size="small" 
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { 
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              color: 'text.primary'
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título de la Tarea"
                value={editedTask.title || ''}
                onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                size="small"
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 1,
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  } 
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                } 
              }}>
                <InputLabel>Asignada a</InputLabel>
                <Select
                  value={editedTask.employeeId || ''}
                  onChange={(e) => setEditedTask(prev => ({ ...prev, employeeId: e.target.value }))}
                  label="Asignada a"
                  required
                >
                  {employees?.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: getAvatarColor(employee.name),
                            width: 24,
                            height: 24,
                            fontSize: '0.75rem',
                            mr: 1
                          }}
                        >
                          {employee.name.charAt(0).toUpperCase()}
                        </Avatar>
                        {employee.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha"
                value={editedTask.date || ''}
                onChange={(e) => setEditedTask(prev => ({ ...prev, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 1,
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  } 
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small" sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                } 
              }}>
                <InputLabel>Tipo de Tarea</InputLabel>
                <Select
                  value={editedTask.type || ''}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setEditedTask(prev => ({
                      ...prev,
                      type: newType,
                      evaluations: taskTypes[newType]?.criteria.reduce((acc, criterion) => {
                        acc[criterion.name] = '';
                        return acc;
                      }, {}) || {},
                    }));
                  }}
                  label="Tipo de Tarea"
                  required
                >
                  {Object.keys(taskTypes).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {editedTask.type && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ ml: 0.5 }}>
                Evaluación
              </Typography>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  borderRadius: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                  bgcolor: alpha(theme.palette.background.default, 0.7),
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Grid container spacing={2}>
                  {taskTypes[editedTask.type]?.criteria.map((criterion) => (
                    <Grid item xs={12} sm={6} key={criterion.name}>
                      <TextField
                        fullWidth
                        label={criterion.name}
                        type="number"
                        inputProps={{ min: 0, max: 100, step: 1 }}
                        value={editedTask.evaluations[criterion.name] || ''}
                        onChange={(e) => handleEvaluationChange(criterion.name, e.target.value)}
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                        helperText={`Peso: ${criterion.weight}%`}
                      />
                    </Grid>
                  ))}
                </Grid>

                {calculateTotalScore() !== null && (
                  <Box sx={{ 
                    mt: 2, 
                    p: 1.5, 
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="subtitle2">
                      Puntuación Total:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {calculateTotalScore().toFixed(2)}%
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ ml: 0.5 }}>
              Comentarios
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Agregar comentarios sobre la tarea..."
              value={editedTask.comments || ''}
              onChange={(e) => setEditedTask(prev => ({ ...prev, comments: e.target.value }))}
              size="small"
              sx={{ 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.background.paper, 0.5),
                } 
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 2, 
        pt: 1,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        justifyContent: 'flex-end'
      }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          variant="text"
          sx={{ 
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          color="primary"
          variant="text"
          sx={{ 
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
