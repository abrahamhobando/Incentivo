import React from 'react';
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
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CommentIcon from '@mui/icons-material/Comment';

const TaskDialog = ({ open, onClose, task, taskTypes, onSave, employees }) => {
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
      const score = editedTask.evaluations[criterion.name] || 0;
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
                  <InputLabel>Empleado</InputLabel>
                  <Select
                    value={editedTask.employeeId || ''}
                    onChange={(e) => setEditedTask(prev => ({ ...prev, employeeId: e.target.value }))}
                    label="Empleado"
                    required
                    startAdornment={<PersonIcon color="action" sx={{ ml: 1, mr: 1 }} />}
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
                        bgcolor: taskTypes[task.type]?.color || 'grey.200',
                        fontWeight: 'medium',
                        '& .MuiChip-label': { px: 1 }
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
                      <Typography variant="body2" color="text.secondary">
                        {criterion.name} <Chip label={`${criterion.weight}%`} size="small" color="primary" variant="outlined" />
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
                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'primary.light', borderRadius: '8px', display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="h6" color="primary.dark">
                    Puntuación Total: <strong>{calculateTotalScore().toFixed(2)}%</strong>
                  </Typography>
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