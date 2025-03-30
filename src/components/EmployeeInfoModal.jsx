import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  TextField,
  IconButton,
  Chip,
  useTheme,
  alpha,
  Fade,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CommentIcon from '@mui/icons-material/Comment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';
import { getTasks } from '../utils/storage';
import { ColorModeContext } from '../main';

// Función para obtener los comentarios del localStorage o crear una estructura vacía
const getEmployeeComments = (employeeId) => {
  const commentsData = localStorage.getItem('incentivo_employee_comments');
  if (commentsData) {
    const allComments = JSON.parse(commentsData);
    return allComments[employeeId] || [];
  }
  return [];
};

// Función para guardar los comentarios en localStorage
const saveEmployeeComments = (employeeId, comments) => {
  const commentsData = localStorage.getItem('incentivo_employee_comments');
  let allComments = {};
  if (commentsData) {
    allComments = JSON.parse(commentsData);
  }
  allComments[employeeId] = comments;
  localStorage.setItem('incentivo_employee_comments', JSON.stringify(allComments));
};

const EmployeeInfoModal = ({ open, employee, onClose }) => {
  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);
  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  // Para estadísticas del perfil
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    averageScore: 0
  });

  // Manejar cambios en el rango de fechas
  const handleDateChange = (field) => (event) => {
    setDateRange(prev => ({ 
      ...prev, 
      [field]: event.target.value 
    }));
  };

  // Aplicar filtro por fecha
  const applyDateFilter = () => {
    if (!employee) return;
    
    let tasksToDisplay = [...employeeTasks];
    
    // Aplicar filtro de fecha si está establecido
    if (dateRange.startDate || dateRange.endDate) {
      tasksToDisplay = tasksToDisplay.filter(task => {
        const taskDate = new Date(task.date);
        const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const end = dateRange.endDate ? new Date(dateRange.endDate) : null;
        
        // Si solo hay fecha de inicio
        if (start && !end) {
          return taskDate >= start;
        }
        
        // Si solo hay fecha de fin
        if (!start && end) {
          end.setHours(23, 59, 59, 999); // Incluir todo el día final
          return taskDate <= end;
        }
        
        // Si hay ambas fechas
        if (start && end) {
          end.setHours(23, 59, 59, 999); // Incluir todo el día final
          return taskDate >= start && taskDate <= end;
        }
        
        return true;
      });
    }
    
    setFilteredTasks(tasksToDisplay);
    
    // Recalcular estadísticas basadas en las tareas filtradas
    const completed = tasksToDisplay.filter(task => task.totalScore !== undefined && task.totalScore !== null).length;
    const scoreSum = tasksToDisplay.reduce((sum, task) => 
      task.totalScore ? sum + task.totalScore : sum, 0);
    const avgScore = completed > 0 ? scoreSum / completed : 0;
    
    setStats({
      totalTasks: tasksToDisplay.length,
      completedTasks: completed,
      averageScore: avgScore
    });
  };

  // Limpiar filtros
  const clearDateFilter = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    });
    
    setFilteredTasks(employeeTasks);
    
    // Recalcular estadísticas con todas las tareas
    const completed = employeeTasks.filter(task => task.totalScore !== undefined && task.totalScore !== null).length;
    const scoreSum = employeeTasks.reduce((sum, task) => 
      task.totalScore ? sum + task.totalScore : sum, 0);
    const avgScore = completed > 0 ? scoreSum / completed : 0;
    
    setStats({
      totalTasks: employeeTasks.length,
      completedTasks: completed,
      averageScore: avgScore
    });
  };

  useEffect(() => {
    if (employee && open) {
      // Cargar tareas del empleado
      const tasks = getTasks();
      const employeeTasksList = tasks.filter(task => task.employeeId === employee.id);
      setEmployeeTasks(employeeTasksList);
      setFilteredTasks(employeeTasksList);

      // Calcular estadísticas
      const completed = employeeTasksList.filter(task => task.totalScore !== undefined && task.totalScore !== null).length;
      const scoreSum = employeeTasksList.reduce((sum, task) => 
        task.totalScore ? sum + task.totalScore : sum, 0);
      const avgScore = completed > 0 ? scoreSum / completed : 0;
      
      setStats({
        totalTasks: employeeTasksList.length,
        completedTasks: completed,
        averageScore: avgScore
      });

      // Cargar comentarios del empleado
      const employeeComments = getEmployeeComments(employee.id);
      setComments(employeeComments);
      
      // Limpiar filtros al abrir el modal
      setDateRange({
        startDate: '',
        endDate: ''
      });
    }
  }, [employee, open]);

  // Actualizar resultados cuando cambie el rango de fechas
  useEffect(() => {
    applyDateFilter();
  }, [dateRange]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        text: newComment.trim(),
        date: new Date().toISOString(),
      };
      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      saveEmployeeComments(employee.id, updatedComments);
      setNewComment('');
    }
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    saveEmployeeComments(employee.id, updatedComments);
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentText(comment.text);
  };

  const handleSaveEditedComment = () => {
    if (editedCommentText.trim()) {
      const updatedComments = comments.map(comment => 
        comment.id === editingCommentId 
          ? { ...comment, text: editedCommentText.trim() } 
          : comment
      );
      setComments(updatedComments);
      saveEmployeeComments(employee.id, updatedComments);
      setEditingCommentId(null);
      setEditedCommentText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
  };

  // Función para generar un color basado en el nombre
  const getAvatarColor = (name) => {
    if (!name) return theme.palette.primary.main;
    
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

  // Obtener la inicial del nombre
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  // Agrupar tareas por tipo con las tareas filtradas
  const groupTasksByType = () => {
    const groupedTasks = {};
    filteredTasks.forEach(task => {
      if (!groupedTasks[task.type]) {
        groupedTasks[task.type] = [];
      }
      groupedTasks[task.type].push(task);
    });
    return groupedTasks;
  };

  const taskGroups = groupTasksByType();

  if (!employee) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={250}
      PaperProps={{
        sx: {
          borderRadius: 1,
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          background: mode === 'dark' 
            ? 'linear-gradient(to bottom, rgba(35,35,40,0.95), rgba(25,25,30,0.98))' 
            : 'linear-gradient(to bottom, rgba(250,250,252,0.98), rgba(255,255,255,0.99))',
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      {/* Header más compacto con estadísticas al lado */}
      <Box 
        sx={{ 
          position: 'relative',
          p: 2.5, 
          display: 'flex',
          flexDirection: 'column',
          borderBottom: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
          background: alpha(theme.palette.background.paper, 0.5),
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: getAvatarColor(employee.name),
                  width: 56,
                  height: 56,
                  fontWeight: 'bold',
                  fontSize: '1.6rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                }}
              >
                {getInitial(employee.name)}
              </Avatar>
            </motion.div>
            
            <Box sx={{ ml: 2.5 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  letterSpacing: '-0.3px'
                }}
              >
                {employee.name}
              </Typography>
            </Box>
          </Box>
          
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { 
                color: theme.palette.error.main,
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        
        {/* Estadísticas en línea más cerca del nombre */}
        <Box 
          sx={{ 
            display: 'flex',
            pl: 0.5
          }}
        >
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            ml: 0.5
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mr: 1, fontWeight: 500 }}>
              Resumen:
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            mr: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main, fontSize: '1rem' }}>
              {stats.totalTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', ml: 0.5 }}>
              total
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            backgroundColor: alpha(theme.palette.success.main, 0.08),
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            mr: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.success.main, fontSize: '1rem' }}>
              {stats.completedTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', ml: 0.5 }}>
              completadas
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            backgroundColor: alpha(theme.palette.info.main, 0.08),
            px: 1.5,
            py: 0.5,
            borderRadius: 1
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.info.main, fontSize: '1rem' }}>
              {stats.averageScore.toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', ml: 0.5 }}>
              promedio
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <DialogContent sx={{ py: 2, px: { xs: 2, sm: 2.5 }, overflowY: 'auto' }}>
        {/* Historial de Tareas */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              fontWeight: 600,
              mb: 1.5,
              color: theme.palette.text.primary,
              '&::after': {
                content: '""',
                flexGrow: 1,
                height: '1px',
                background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.divider, 0.05)})`,
                ml: 1.5,
                mr: 1
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HistoryIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} /> 
              Historial de Tareas
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="text"
                color="inherit"
                size="small"
                onClick={clearDateFilter}
                disabled={!dateRange.startDate && !dateRange.endDate}
                sx={{ 
                  minWidth: 'auto',
                  p: 0.5,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                Limpiar
              </Button>
            </Box>
          </Typography>
          
          {/* Filtro de fechas */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 2,
              alignItems: 'center',
              backgroundColor: alpha(theme.palette.background.paper, 0.4),
              p: 1.5,
              borderRadius: 1,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.1),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Filtrar por fecha:
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
              <TextField
                type="date"
                size="small"
                value={dateRange.startDate}
                onChange={handleDateChange('startDate')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="caption" color="text.secondary">Desde</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    fontSize: '0.85rem',
                    height: 36,
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  },
                  width: 190
                }}
              />
              
              <TextField
                type="date"
                size="small"
                value={dateRange.endDate}
                onChange={handleDateChange('endDate')}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="caption" color="text.secondary">Hasta</Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    fontSize: '0.85rem',
                    height: 36,
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                  },
                  width: 190
                }}
              />
            </Box>
          </Box>
          
          {Object.keys(taskGroups).length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {Object.entries(taskGroups).map(([type, tasks], index) => (
                <Accordion 
                  key={type} 
                  disableGutters
                  elevation={0}
                  sx={{ 
                    mb: 1, 
                    borderRadius: 0,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.3),
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: '0 0 8px 0',
                    }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={
                      <ExpandMoreIcon sx={{ fontSize: '1.1rem' }} />
                    }
                    sx={{ 
                      minHeight: '42px',
                      backgroundColor: alpha(theme.palette.background.paper, 0.4),
                      '&.Mui-expanded': {
                        minHeight: '42px',
                      },
                      '.MuiAccordionSummary-content': {
                        margin: '10px 0',
                      },
                      '.MuiAccordionSummary-content.Mui-expanded': {
                        margin: '10px 0'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{type}</Typography>
                      <Chip 
                        label={`${tasks.length}`} 
                        size="small" 
                        color="primary" 
                        sx={{ 
                          height: '20px',
                          minWidth: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 2, pt: 1 }}>
                    <List sx={{ p: 0 }}>
                      {tasks.map((task) => (
                        <ListItem 
                          key={task.id} 
                          disablePadding
                          sx={{ 
                            mb: 1, 
                            p: 1.5,
                            borderRadius: 2, 
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.5),
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.background.default, 0.5),
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                              borderColor: alpha(theme.palette.primary.main, 0.3),
                            }
                          }}
                        >
                          <Box sx={{ width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <AssignmentIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{task.title}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(task.date).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Typography>
                              {task.totalScore !== undefined && task.totalScore !== null ? (
                                <Chip 
                                  label={`${task.totalScore}%`} 
                                  size="small" 
                                  color={
                                    task.totalScore >= 90 ? 'success' :
                                    task.totalScore >= 70 ? 'primary' :
                                    task.totalScore >= 50 ? 'warning' : 'error'
                                  }
                                  sx={{ 
                                    fontWeight: 'bold',
                                    borderRadius: '12px',
                                    height: '24px',
                                    '& .MuiChip-label': { px: 1 }
                                  }}
                                />
                              ) : (
                                <Chip 
                                  label="Pendiente" 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ 
                                    borderRadius: '12px',
                                    height: '24px',
                                    '& .MuiChip-label': { px: 1 }
                                  }}
                                />
                              )}
                            </Box>
                            {task.comments && (
                              <Box sx={{ 
                                mt: 1.5, 
                                p: 1.5, 
                                bgcolor: mode === 'dark' ? alpha('#000', 0.2) : alpha('#f5f5f5', 0.7), 
                                borderRadius: 1.5,
                                borderLeft: '3px solid',
                                borderColor: alpha(theme.palette.primary.main, 0.4),
                              }}>
                                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                  "{task.comments}"
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </motion.div>
          ) : (
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                borderRadius: 3,
                border: '1px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Este colaborador no tiene tareas asignadas
              </Typography>
            </Paper>
          )}
        </Box>
        
        {/* Comentarios */}
        <Box>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontWeight: 600,
              mb: 1.5,
              mt: 3,
              color: theme.palette.text.primary,
              '&::after': {
                content: '""',
                flexGrow: 1,
                height: '1px',
                background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.3)}, ${alpha(theme.palette.divider, 0.05)})`,
                ml: 1.5
              }
            }}
          >
            <CommentIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} /> 
            Comentarios
          </Typography>
          
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              mb: 2, 
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.2),
              backgroundColor: mode === 'dark' 
                ? alpha(theme.palette.background.paper, 0.1) 
                : alpha(theme.palette.background.paper, 0.4),
            }}
          >
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Agregar un comentario..."
                variant="outlined"
                size="small"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                multiline
                rows={2}
                sx={{ 
                  mr: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    fontSize: '0.9rem',
                    backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)',
                  }
                }}
              />
              <Button 
                variant="text" 
                color="primary"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                sx={{ 
                  minWidth: 32,
                  width: 32,
                  height: 32,
                  p: 0,
                  borderRadius: '50%',
                  alignSelf: 'flex-end',
                  mb: 0.5,
                  ml: 1,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <AddIcon fontSize="small" />
              </Button>
            </Box>
            
            {comments.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <List sx={{ p: 0 }}>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ListItem 
                        alignItems="flex-start"
                        disablePadding
                        sx={{ 
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: mode === 'dark' ? alpha(theme.palette.primary.dark, 0.1) : alpha(theme.palette.primary.light, 0.05),
                          border: '1px solid',
                          borderColor: mode === 'dark' ? alpha(theme.palette.primary.dark, 0.2) : alpha(theme.palette.primary.light, 0.2),
                          transition: 'all 0.15s ease-in-out',
                          '&:hover': {
                            backgroundColor: mode === 'dark' ? alpha(theme.palette.primary.dark, 0.15) : alpha(theme.palette.primary.light, 0.1),
                            boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
                          }
                        }}
                      >
                        {editingCommentId === comment.id ? (
                          <Box sx={{ width: '100%' }}>
                            <TextField
                              fullWidth
                              multiline
                              variant="outlined"
                              value={editedCommentText}
                              onChange={(e) => setEditedCommentText(e.target.value)}
                              autoFocus
                              sx={{ 
                                mb: 1.5,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px',
                                  fontSize: '0.95rem',
                                  backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
                                }
                              }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Button 
                                size="small" 
                                onClick={handleCancelEdit}
                                color="inherit"
                                sx={{ 
                                  textTransform: 'none',
                                  minWidth: 'auto',
                                  fontWeight: 500,
                                  fontSize: '0.8rem',
                                  p: 0.5,
                                  color: theme.palette.text.secondary,
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline'
                                  }
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button 
                                size="small" 
                                onClick={handleSaveEditedComment}
                                disabled={!editedCommentText.trim()}
                                color="primary"
                                sx={{ 
                                  textTransform: 'none',
                                  minWidth: 'auto',
                                  fontWeight: 500,
                                  fontSize: '0.8rem',
                                  p: 0.5,
                                  '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline'
                                  }
                                }}
                              >
                                Guardar
                              </Button>
                            </Box>
                          </Box>
                        ) : (
                          <>
                            <ListItemText
                              primary={
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    fontWeight: 400,
                                    lineHeight: 1.5,
                                    mb: 1
                                  }}
                                >
                                  {comment.text}
                                </Typography>
                              }
                              secondary={
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ display: 'block', mt: 1 }}
                                >
                                  {new Date(comment.date).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Typography>
                              }
                              sx={{ mr: 2 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditComment(comment)}
                                sx={{ 
                                  mr: 0.5,
                                  color: alpha(theme.palette.primary.main, 0.7),
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    transform: 'scale(1.1)',
                                  },
                                  transition: 'transform 0.2s'
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => handleDeleteComment(comment.id)}
                                sx={{ 
                                  color: alpha(theme.palette.error.main, 0.7),
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    color: theme.palette.error.main,
                                    transform: 'scale(1.1)',
                                  },
                                  transition: 'transform 0.2s'
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </>
                        )}
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </motion.div>
            ) : (
              <Box sx={{ 
                textAlign: 'center', 
                py: 3,
                px: 2,
                borderRadius: 3,
                border: '1px dashed',
                borderColor: alpha(theme.palette.divider, 0.5),
                bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.01)'
              }}>
                <Typography variant="body2" color="text.secondary">
                  No hay comentarios para este colaborador
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                  Sé el primero en dejar un comentario
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: alpha(theme.palette.divider, 0.1) }}>
        <Button 
          onClick={onClose} 
          variant="text"
          color="inherit"
          sx={{ 
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeInfoModal; 