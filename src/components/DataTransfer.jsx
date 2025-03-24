import React, { useState, useContext } from 'react';
import { Box, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { motion } from 'framer-motion';
import { ColorModeContext } from '../main';
import { getEmployees, getTasks, saveEmployees, saveTasks } from '../utils/storage';

const DataTransfer = ({ onDataImported }) => {
  const { mode } = useContext(ColorModeContext);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [importData, setImportData] = useState(null);
  const [importError, setImportError] = useState('');
  const [duplicateTasks, setDuplicateTasks] = useState([]);
  const [importAction, setImportAction] = useState(''); // 'replace' o 'keep'

  // Función para exportar datos
  const handleExport = () => {
    const employees = getEmployees();
    const tasks = getTasks();
    
    const exportData = {
      employees,
      tasks,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `incentivo_backup_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Función para manejar la selección de archivo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        validateImportData(data);
      } catch (error) {
        setImportError('El archivo no contiene un formato JSON válido.');
        setImportDialogOpen(true);
      }
    };
    reader.readAsText(file);
    
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = '';
  };

  // Validar los datos importados
  const validateImportData = (data) => {
    setImportError('');
    
    // Verificar estructura básica
    if (!data.employees || !data.tasks || !Array.isArray(data.employees) || !Array.isArray(data.tasks)) {
      setImportError('El archivo no contiene la estructura correcta de datos.');
      setImportDialogOpen(true);
      return;
    }
    
    // Verificar que los empleados tengan los campos requeridos
    const invalidEmployees = data.employees.filter(emp => !emp.id || !emp.name);
    if (invalidEmployees.length > 0) {
      setImportError('Algunos empleados no tienen los campos requeridos (id, name).');
      setImportDialogOpen(true);
      return;
    }
    
    // Verificar que las tareas tengan los campos requeridos
    const invalidTasks = data.tasks.filter(task => !task.id || !task.title || !task.employeeId || !task.type);
    if (invalidTasks.length > 0) {
      setImportError('Algunas tareas no tienen los campos requeridos (id, title, employeeId, type).');
      setImportDialogOpen(true);
      return;
    }
    
    // Verificar duplicados
    const currentEmployees = getEmployees();
    const currentTasks = getTasks();
    
    // Verificar tareas duplicadas (mismo título)
    const duplicates = data.tasks.filter(importTask => 
      currentTasks.some(currentTask => currentTask.title === importTask.title)
    );
    
    if (duplicates.length > 0) {
      setDuplicateTasks(duplicates);
      setConfirmDialogOpen(true);
    } else {
      // No hay duplicados, proceder con la importación
      processImport(data, 'keep');
    }
    
    setImportData(data);
  };

  // Procesar la importación de datos
  const processImport = (data, action) => {
    const currentEmployees = getEmployees();
    const currentTasks = getTasks();
    
    // Importar empleados (evitar duplicados por ID)
    const newEmployees = [
      ...currentEmployees,
      ...data.employees.filter(importEmp => 
        !currentEmployees.some(currentEmp => currentEmp.id === importEmp.id)
      )
    ];
    
    // Importar tareas según la acción seleccionada
    let newTasks;
    if (action === 'replace') {
      // Reemplazar tareas duplicadas
      const nonDuplicateTasks = currentTasks.filter(currentTask => 
        !data.tasks.some(importTask => importTask.title === currentTask.title)
      );
      newTasks = [...nonDuplicateTasks, ...data.tasks];
    } else {
      // Mantener ambas versiones pero asignar nuevos IDs a las tareas importadas
      // para que sean completamente independientes
      const tasksWithNewIds = data.tasks.map(task => ({
        ...task,
        id: Date.now() + Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 1000)
      }));
      newTasks = [...currentTasks, ...tasksWithNewIds];
    }
    
    // Guardar los datos
    saveEmployees(newEmployees);
    saveTasks(newTasks);
    
    // Cerrar diálogos
    setImportDialogOpen(false);
    setConfirmDialogOpen(false);
    
    // Notificar que se han importado datos
    if (onDataImported) {
      onDataImported();
    }
  };

  // Manejar la acción para tareas duplicadas
  const handleDuplicateAction = (action) => {
    setImportAction(action);
    processImport(importData, action);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Tooltip title="Exportar datos">
          <IconButton 
            onClick={handleExport} 
            color="inherit" 
            aria-label="exportar datos"
            sx={{
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: mode === 'light' 
                  ? 'rgba(0, 0, 0, 0.08)' 
                  : 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <DownloadIcon fontSize="small" />
            </motion.div>
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Importar datos">
          <IconButton 
            color="inherit" 
            aria-label="importar datos"
            component="label"
            sx={{
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: mode === 'light' 
                  ? 'rgba(0, 0, 0, 0.08)' 
                  : 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <UploadIcon fontSize="small" />
            </motion.div>
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleFileSelect}
            />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Diálogo de error de importación */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        aria-labelledby="import-error-dialog-title"
      >
        <DialogTitle id="import-error-dialog-title">Error de importación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {importError}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)} color="primary" autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmación para tareas duplicadas */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="duplicate-dialog-title"
      >
        <DialogTitle id="duplicate-dialog-title">Tareas duplicadas</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Se encontraron {duplicateTasks.length} tareas con el mismo título. ¿Qué desea hacer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDuplicateAction('keep')} color="primary">
            Mantener ambas
          </Button>
          <Button onClick={() => handleDuplicateAction('replace')} color="primary" variant="contained">
            Reemplazar existentes
          </Button>
          <Button onClick={() => setConfirmDialogOpen(false)} color="error">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DataTransfer;