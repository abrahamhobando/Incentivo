import React, { useState, useContext } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tabs,
  Tab,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import { ColorModeContext } from '../main';
import { getTasks, saveTasks } from '../utils/storage';
import ConfirmDialog from './ConfirmDialog';

// Icono minimalista de papelera usando SVG con animación
const TrashIcon = () => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1, rotate: 0 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    <motion.path
      d="M3 6h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    />
    <motion.path
      d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M10 11v6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    />
    <motion.path
      d="M14 11v6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    />
  </motion.svg>
);

const DeleteDataDialog = ({ onDataDeleted }) => {
  const { mode } = useContext(ColorModeContext);
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Cargar tareas cuando se abre el diálogo
  const handleOpenDialog = () => {
    setTasks(getTasks());
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTasks([]);
    setDateRange({ startDate: '', endDate: '' });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleDeleteByDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar todas las tareas entre ${dateRange.startDate} y ${dateRange.endDate}?`,
      onConfirm: confirmDeleteByDateRange
    });
  };

  const confirmDeleteByDateRange = () => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    end.setHours(23, 59, 59, 999); // Incluir todo el día final

    const allTasks = getTasks();
    const filteredTasks = allTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate < start || taskDate > end;
    });

    saveTasks(filteredTasks);
    setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
    handleCloseDialog();
    if (onDataDeleted) onDataDeleted();
  };

  const handleDeleteSelectedTasks = () => {
    if (selectedTasks.length === 0) {
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar ${selectedTasks.length} tarea(s) seleccionada(s)?`,
      onConfirm: confirmDeleteSelectedTasks
    });
  };

  const confirmDeleteSelectedTasks = () => {
    const allTasks = getTasks();
    const filteredTasks = allTasks.filter(task => !selectedTasks.includes(task.id));

    saveTasks(filteredTasks);
    setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });
    handleCloseDialog();
    if (onDataDeleted) onDataDeleted();
  };

  const getEmployeeName = (employeeId) => {
    // Buscar el empleado en la lista de empleados almacenada en localStorage
    const employees = JSON.parse(localStorage.getItem('incentivo_employees') || '[]');
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Empleado ' + employeeId;
  };

  return (
    <>
      <Tooltip title="Eliminar datos">
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1
          }}
        >
          <IconButton
            onClick={handleOpenDialog}
            color="inherit"
            aria-label="delete data"
            sx={{
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: mode === 'light'
                  ? 'rgba(0, 0, 0, 0.08)'
                  : 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <TrashIcon />
          </IconButton>
        </Box>
      </Tooltip>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DeleteIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Eliminar Datos</Typography>
          </Box>
        </DialogTitle>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="delete options tabs"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            px: 3,
            '& .MuiTab-root': {
              minHeight: 48,
              fontWeight: 500,
              transition: 'all 0.2s',
              '&:hover': {
                color: 'primary.main',
                opacity: 1
              },
              '&.Mui-selected': {
                fontWeight: 600
              }
            }
          }}
        >
          <Tab label="Por Rango de Fechas" />
          <Tab label="Selección Manual" />
        </Tabs>

        <DialogContent sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Selecciona un rango de fechas para eliminar todas las tareas dentro de ese período.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <TextField
                  label="Fecha inicial"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Fecha final"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteByDateRange}
                  disabled={!dateRange.startDate || !dateRange.endDate}
                >
                  Eliminar Tareas
                </Button>
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Selecciona las tareas específicas que deseas eliminar.
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400, overflow: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={selectedTasks.length > 0 && selectedTasks.length < tasks.length}
                          checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                          onChange={() => {
                            if (selectedTasks.length === tasks.length) {
                              setSelectedTasks([]);
                            } else {
                              setSelectedTasks(tasks.map(task => task.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>Título</TableCell>
                      <TableCell>Empleado</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Fecha</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow
                        key={task.id}
                        hover
                        onClick={() => handleTaskSelection(task.id)}
                        selected={selectedTasks.includes(task.id)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedTasks.includes(task.id)}
                            onChange={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskSelection(task.id);
                            }}
                          />
                        </TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{getEmployeeName(task.employeeId)}</TableCell>
                        <TableCell>
                          <Chip
                            label={task.type}
                            size="small"
                            sx={{
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          />
                        </TableCell>
                        <TableCell>{task.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteSelectedTasks}
                  disabled={selectedTasks.length === 0}
                >
                  Eliminar {selectedTasks.length} Tarea(s)
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={() => {
          if (confirmDialog.onConfirm) confirmDialog.onConfirm();
        }}
      />
    </>
  );
};

export default DeleteDataDialog;