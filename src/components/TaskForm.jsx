import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { getEmployees, addTask } from '../utils/storage';

const TaskForm = ({ employees, onTaskAdded }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    employeeId: '',
    type: '',
    date: '',
    evaluations: {},
    comments: '',
  });

  const taskTypes = {
    PRA: {
      color: '#e3f2fd',
      criteria: [
        { 
          name: 'Calidad', 
          weight: 60,
          description: 'Se revisa una muestra del 5% al 15% de los casos realizados, dependiendo de la población del estudio.'
        },
        { 
          name: 'Seguimiento de instrucciones', 
          weight: 40,
          description: 'Se siguen las instrucciones del ingeniero a cargo de la prueba para la realización de la misma. Retroalimentación recibida por el ingeniero a cargo de la prueba.'
        },
      ],
    },
    Validacion: {
      color: '#f3e5f5',
      criteria: [
        { 
          name: 'Calidad', 
          weight: 60,
          description: 'Se revisa una muestra del 15% de los casos realizados en la asignación.'
        },
        { 
          name: 'Cumplimiento de tiempo', 
          weight: 20,
          description: 'La validación se realiza dentro del periodo establecido.'
        },
        { 
          name: '0 errores encontrados en GA', 
          weight: 20,
          description: 'Se realiza la validación correctamente para asegurar que la nueva versión de Treat no tenga errores en GA.'
        },
      ],
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type') {
      setTaskData(prev => ({
        ...prev,
        [name]: value,
        evaluations: {},
      }));
    } else {
      setTaskData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEvaluationChange = (criteriaName, value) => {
    setTaskData(prev => ({
      ...prev,
      evaluations: {
        ...prev.evaluations,
        [criteriaName]: parseFloat(value) || 0,
      },
    }));
  };

  const calculateTotalScore = () => {
    if (!taskData.type || !taskTypes[taskData.type]) return null;
    
    // Verificar si hay al menos un criterio evaluado
    const hasEvaluations = taskTypes[taskData.type].criteria.some(
      criterion => taskData.evaluations[criterion.name] !== undefined && 
                 taskData.evaluations[criterion.name] !== null && 
                 taskData.evaluations[criterion.name] !== ''
    );
    
    if (!hasEvaluations) return null;
    
    return taskTypes[taskData.type].criteria.reduce((total, criterion) => {
      const score = taskData.evaluations[criterion.name] || 0;
      return total + (score * criterion.weight) / 100;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalScore = calculateTotalScore();
    const newTask = {
      ...taskData,
      totalScore,
      date: taskData.date || new Date().toISOString().split('T')[0],
    };
    addTask(newTask);
    setTaskData({
      title: '',
      employeeId: '',
      type: '',
      date: '',
      evaluations: {},
      comments: '',
    });
    if (onTaskAdded) onTaskAdded();
  };

  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Título de la Tarea"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Empleado</InputLabel>
                <Select
                  name="employeeId"
                  value={taskData.employeeId}
                  onChange={handleChange}
                  label="Empleado"
                  required
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Tarea</InputLabel>
                <Select
                  name="type"
                  value={taskData.type}
                  onChange={handleChange}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha"
                name="date"
                value={taskData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>

            {taskData.type && taskTypes[taskData.type].criteria.map((criterion) => (
              <Grid item xs={12} md={6} key={criterion.name}>
                <TextField
                  fullWidth
                  type="number"
                  label={`${criterion.name} (${criterion.weight}%)`}
                  helperText={criterion.description}
                  value={taskData.evaluations[criterion.name] || ''}
                  onChange={(e) => handleEvaluationChange(criterion.name, e.target.value)}
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  size="small"
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comentarios"
                name="comments"
                value={taskData.comments || ''}
                onChange={handleChange}
                size="small"
                placeholder="Ingrese comentarios adicionales sobre la tarea"
              />
            </Grid>

            {taskData.type && (
              <Grid item xs={12}>
                <Typography variant="h6" color="primary">
                  Puntuación Total: {calculateTotalScore() !== null ? `${calculateTotalScore().toFixed(2)}%` : 'Sin evaluar'}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AssignmentIcon />}
                sx={{ mt: 2 }}
              >
                Agregar Tarea
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskForm;