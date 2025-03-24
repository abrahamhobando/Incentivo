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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Tabs,
  Tab
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { motion } from 'framer-motion';
import { ColorModeContext } from '../main';
import { getEmployees, getTasks, saveEmployees, saveTasks } from '../utils/storage';

const DataTransfer = ({ onDataImported }) => {
  const { mode } = useContext(ColorModeContext);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [importData, setImportData] = useState(null);
  const [importError, setImportError] = useState('');
  const [duplicateTasks, setDuplicateTasks] = useState([]);
  const [importAction, setImportAction] = useState(''); // 'replace' o 'keep'
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [previewTab, setPreviewTab] = useState(0);

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
    
    // Inicializar todos los elementos como seleccionados por defecto
    setSelectedEmployees(data.employees.map(emp => emp.id));
    setSelectedTasks(data.tasks.map(task => task.id));
    
    // Guardar los datos para la previsualización
    setImportData(data);
    
    // Abrir el diálogo de previsualización
    setPreviewDialogOpen(true);
  };

  // Procesar la importación de datos con selección
  const processImportWithSelection = () => {
    if (!importData) return;
    
    const currentEmployees = getEmployees();
    const currentTasks = getTasks();
    
    // Filtrar empleados seleccionados
    const selectedEmployeesToImport = importData.employees.filter(emp => 
      selectedEmployees.includes(emp.id)
    );
    
    // Filtrar tareas seleccionadas
    const selectedTasksToImport = importData.tasks.filter(task => 
      selectedTasks.includes(task.id)
    );
    
    // Importar empleados seleccionados (evitar duplicados por ID)
    const newEmployees = [
      ...currentEmployees,
      ...selectedEmployeesToImport.filter(importEmp => 
        !currentEmployees.some(currentEmp => currentEmp.id === importEmp.id)
      )
    ];
    
    // Verificar tareas duplicadas (mismo título)
    const duplicateTasks = selectedTasksToImport.filter(importTask => 
      currentTasks.some(currentTask => currentTask.title === importTask.title)
    );
    
    if (duplicateTasks.length > 0) {
      setDuplicateTasks(duplicateTasks);
      setPreviewDialogOpen(false);
      setConfirmDialogOpen(true);
    } else {
      // No hay duplicados, proceder con la importación
      finalizeImport(selectedEmployeesToImport, selectedTasksToImport, 'keep');
    }
  };
  
  // Procesar la importación de datos con acción para duplicados
  const processImport = (data, action) => {
    const currentEmployees = getEmployees();
    const currentTasks = getTasks();
    
    // Filtrar empleados seleccionados si venimos de la previsualización
    const employeesToImport = previewDialogOpen 
      ? data.employees.filter(emp => selectedEmployees.includes(emp.id))
      : data.employees;
      
    // Filtrar tareas seleccionadas si venimos de la previsualización
    const tasksToImport = previewDialogOpen
      ? data.tasks.filter(task => selectedTasks.includes(task.id))
      : data.tasks;
    
    finalizeImport(employeesToImport, tasksToImport, action);
  };
  
  // Finalizar la importación con los datos filtrados
  const finalizeImport = (employeesToImport, tasksToImport, action) => {
    const currentEmployees = getEmployees();
    const currentTasks = getTasks();
    
    // Importar empleados (evitar duplicados por ID)
    const newEmployees = [
      ...currentEmployees,
      ...employeesToImport.filter(importEmp => 
        !currentEmployees.some(currentEmp => currentEmp.id === importEmp.id)
      )
    ];
    
    // Importar tareas según la acción seleccionada
    let newTasks;
    if (action === 'replace') {
      // Reemplazar tareas duplicadas
      const nonDuplicateTasks = currentTasks.filter(currentTask => 
        !tasksToImport.some(importTask => importTask.title === currentTask.title)
      );
      newTasks = [...nonDuplicateTasks, ...tasksToImport];
    } else {
      // Mantener ambas versiones pero asignar nuevos IDs a las tareas importadas
      // para que sean completamente independientes
      const tasksWithNewIds = tasksToImport.map(task => ({
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
    setPreviewDialogOpen(false);
    
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
  
  // Manejar el cambio de pestaña en la previsualización
  const handlePreviewTabChange = (event, newValue) => {
    setPreviewTab(newValue);
  };
  
  // Manejar la selección/deselección de todos los empleados
  const handleSelectAllEmployees = (event) => {
    if (event.target.checked) {
      setSelectedEmployees(importData.employees.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };
  
  // Manejar la selección/deselección de todos las tareas
  const handleSelectAllTasks = (event) => {
    if (event.target.checked) {
      setSelectedTasks(importData.tasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };
  
  // Manejar la selección/deselección de un empleado
  const handleEmployeeSelect = (employeeId) => {
    const currentIndex = selectedEmployees.indexOf(employeeId);
    const newSelected = [...selectedEmployees];

    if (currentIndex === -1) {
      newSelected.push(employeeId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedEmployees(newSelected);
  };
  
  // Manejar la selección/deselección de una tarea
  const handleTaskSelect = (taskId) => {
    const currentIndex = selectedTasks.indexOf(taskId);
    const newSelected = [...selectedTasks];

    if (currentIndex === -1) {
      newSelected.push(taskId);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedTasks(newSelected);
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
      
      {/* Diálogo de previsualización de datos */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        aria-labelledby="preview-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="preview-dialog-title">Previsualización de datos a importar</DialogTitle>
        <DialogContent>
          <Tabs value={previewTab} onChange={handlePreviewTabChange} aria-label="Pestañas de previsualización">
            <Tab label={`Empleados (${importData?.employees?.length || 0})`} />
            <Tab label={`Tareas (${importData?.tasks?.length || 0})`} />
          </Tabs>
          
          {previewTab === 0 && importData?.employees && (
            <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedEmployees.length > 0 && selectedEmployees.length < importData.employees.length}
                        checked={importData.employees.length > 0 && selectedEmployees.length === importData.employees.length}
                        onChange={handleSelectAllEmployees}
                      />
                    </TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importData.employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedEmployees.indexOf(employee.id) !== -1}
                          onChange={() => handleEmployeeSelect(employee.id)}
                        />
                      </TableCell>
                      <TableCell>{employee.id}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {previewTab === 1 && importData?.tasks && (
            <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 300 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedTasks.length > 0 && selectedTasks.length < importData.tasks.length}
                        checked={importData.tasks.length > 0 && selectedTasks.length === importData.tasks.length}
                        onChange={handleSelectAllTasks}
                      />
                    </TableCell>
                    <TableCell>Título</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importData.tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedTasks.indexOf(task.id) !== -1}
                          onChange={() => handleTaskSelect(task.id)}
                        />
                      </TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.type}</TableCell>
                      <TableCell>{task.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Seleccione los elementos que desea importar. Los elementos no seleccionados serán ignorados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)} color="error">
            Cancelar
          </Button>
          <Button 
            onClick={processImportWithSelection} 
            color="primary" 
            variant="contained"
            disabled={selectedEmployees.length === 0 && selectedTasks.length === 0}
          >
            Importar seleccionados
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