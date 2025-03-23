import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deleteTask, getTasks, saveTasks } from '../utils/storage';
import TaskDialog from './TaskDialog';

const TaskList = ({ tasks, employees, onTaskDeleted }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const taskTypes = {
    PRA: {
      color: '#e3f2fd',
      criteria: [
        { name: 'Calidad', weight: 60 },
        { name: 'Seguimiento de instrucciones', weight: 40 },
      ],
    },
    Validacion: {
      color: '#f3e5f5',
      criteria: [
        { name: 'Calidad', weight: 60 },
        { name: 'Cumplimiento de tiempo', weight: 20 },
        { name: '0 errores encontrados en GA', weight: 20 },
      ],
    },
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = (editedTask) => {
    const allTasks = getTasks();
    const taskIndex = allTasks.findIndex(t => t.id === editedTask.id);
    if (taskIndex !== -1) {
      allTasks[taskIndex] = editedTask;
      saveTasks(allTasks);
      if (onTaskDeleted) onTaskDeleted();
    }
  };
  const getEmployeeName = (employeeId) => {
    return employees.find(emp => emp.id === employeeId)?.name || 'Empleado no encontrado';
  };

  const handleDelete = (taskId) => {
    deleteTask(taskId);
    if (onTaskDeleted) onTaskDeleted();
  };

  const getTaskTypeColor = (type) => {
    const colors = {
      PRA: '#e3f2fd',
      Validacion: '#f3e5f5',
    };
    return colors[type] || '#ffffff';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'primary';
    if (score >= 50) return 'warning';
    return 'error';
  };

  return (
    <>
      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle1" fontWeight="bold">Tarea</Typography></TableCell>
                  <TableCell><Typography variant="subtitle1" fontWeight="bold">Empleado</Typography></TableCell>
                  <TableCell><Typography variant="subtitle1" fontWeight="bold">Tipo</Typography></TableCell>
                  <TableCell><Typography variant="subtitle1" fontWeight="bold">Fecha</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle1" fontWeight="bold">Puntuación</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon color="primary" />
                        <Typography variant="body1">{task.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon color="secondary" />
                        <Typography variant="body1">{getEmployeeName(task.employeeId)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.type}
                        sx={{
                          bgcolor: getTaskTypeColor(task.type),
                          fontWeight: 500,
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {new Date(task.date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Chip
                          label={`${task.totalScore}%`}
                          color={getScoreColor(task.totalScore)}
                          size="small"
                        />
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(task)}
                            color="primary"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(task.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        task={selectedTask}
        taskTypes={taskTypes}
        onSave={handleSaveTask}
      />
    </>
  );
};

export default TaskList;