import React, { useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
  Paper,
  Divider,
  IconButton,
  Avatar,
  alpha,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ColorModeContext } from '../main';
import { useTheme } from '@mui/material/styles';

const TaskPreviewModal = ({ open, onClose, task, taskTypes, employees, onEdit, onDelete }) => {
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

  // Calcular la puntuación total
  const calculateTotalScore = () => {
    if (!task || !task.type || !taskTypes[task.type] || !task.evaluations) return null;
    
    // Verificar si hay al menos un criterio evaluado
    const hasEvaluations = taskTypes[task.type].criteria.some(
      criterion => task.evaluations[criterion.name] !== undefined && 
                 task.evaluations[criterion.name] !== null && 
                 task.evaluations[criterion.name] !== ''
    );
    
    if (!hasEvaluations) return null;
    
    return task.totalScore;
  };

  if (!task) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={180}
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          bgcolor: mode === 'dark' ? 'background.paper' : 'background.paper',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between',
        p: 2,
        pb: 1,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: getAvatarColor(getEmployeeName(task.employeeId)),
              width: 40,
              height: 40,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              mr: 2
            }}
          >
            {getEmployeeName(task.employeeId).charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Asignada a: {getEmployeeName(task.employeeId)}
            </Typography>
          </Box>
        </Box>
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ 
              p: 2, 
              height: '100%',
              bgcolor: 'background.default',
              borderRadius: 1,
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Información Básica
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">Fecha:</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {new Date(task.date).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">Tipo:</Typography>
                  <Chip 
                    label={task.type} 
                    size="small" 
                    sx={{ 
                      bgcolor: mode === 'dark' ? theme.palette.taskTypes[task.type] || 'grey.800' : taskTypes[task.type]?.color || 'grey.200',
                      color: mode === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.87)',
                      fontWeight: 'medium',
                      fontSize: '0.75rem',
                      height: 22
                    }} 
                  />
                </Box>
                
                {task.totalScore !== undefined && task.totalScore !== null && (
                  <Box 
                    sx={{ 
                      mt: 3,
                      p: 1.5,
                      borderRadius: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      bgcolor: alpha(theme.palette.background.paper, 0.5),
                      border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                      Puntuación total
                    </Typography>
                    <Typography 
                      variant="h4" 
                      fontWeight="bold"
                      sx={{ 
                        color: 
                          task.totalScore >= 90 ? theme.palette.success.main : 
                          task.totalScore >= 70 ? theme.palette.primary.main : 
                          task.totalScore >= 50 ? theme.palette.warning.main : 
                          theme.palette.error.main,
                        textShadow: '0 0 1px rgba(0,0,0,0.05)',
                        fontSize: '2.5rem',
                      }}
                    >
                      {task.totalScore.toFixed(0)}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            {taskTypes[task.type] && task.evaluations && (
              <Paper elevation={0} sx={{ 
                p: 2, 
                height: '100%',
                bgcolor: 'background.default',
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Evaluaciones
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  {taskTypes[task.type].criteria.map((criterion) => (
                    <Box 
                      key={criterion.name}
                      sx={{ 
                        mb: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center' 
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {criterion.name} ({criterion.weight}%)
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {task.evaluations[criterion.name] !== undefined ? `${task.evaluations[criterion.name]}%` : 'Pendiente'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </Grid>
          
          {task.comments && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ 
                p: 2, 
                bgcolor: 'background.default',
                borderRadius: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Comentarios
                </Typography>
                <Box 
                  sx={{ 
                    mt: 1,
                    p: 1.5, 
                    borderRadius: 1, 
                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    {task.comments}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 2, 
        pt: 1,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        justifyContent: 'space-between' 
      }}>
        <Button 
          variant="text" 
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => {
            onClose();
            onDelete(task.id);
          }}
          sx={{ 
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Eliminar
        </Button>
        <Box>
          <Button 
            onClick={onClose} 
            variant="text" 
            sx={{ 
              mr: 1,
              textTransform: 'none'
            }}
          >
            Cerrar
          </Button>
          <Button 
            onClick={() => {
              onClose();
              onEdit(task);
            }} 
            variant="outlined" 
            color="primary"
            startIcon={<EditIcon />}
            sx={{ 
              borderRadius: 1, 
              fontWeight: 'medium',
              textTransform: 'none'
            }}
          >
            Editar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default TaskPreviewModal; 