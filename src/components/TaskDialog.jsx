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
} from '@mui/material';

const TaskDialog = ({ open, onClose, task, taskTypes, onSave }) => {
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
    if (!editedTask?.type || !taskTypes[editedTask.type]) return 0;

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
      <DialogTitle>
        Detalles de la Tarea: {task.title}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Tipo de Tarea: <Chip label={task.type} size="small" />
            </Typography>
          </Grid>

          {taskTypes[task.type]?.criteria.map((criterion) => (
            <Grid item xs={12} md={6} key={criterion.name}>
              <TextField
                fullWidth
                type="number"
                label={`${criterion.name} (${criterion.weight}%)`}
                value={editedTask.evaluations[criterion.name] || ''}
                onChange={(e) => handleEvaluationChange(criterion.name, e.target.value)}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                size="small"
                helperText={criterion.description}
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
              value={editedTask.comments || ''}
              onChange={(e) => setEditedTask(prev => ({ ...prev, comments: e.target.value }))}
              size="small"
              placeholder="Ingrese comentarios adicionales sobre la tarea"
              sx={{ mt: 2 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" color="primary">
                Puntuación Total: {calculateTotalScore().toFixed(2)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;