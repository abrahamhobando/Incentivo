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
import TableChartIcon from '@mui/icons-material/TableChart';
import { motion } from 'framer-motion';
import { ColorModeContext } from '../main';
import { getEmployees, getTasks, saveEmployees, saveTasks } from '../utils/storage';
import * as XLSX from 'xlsx';

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
  
  // Definición de tipos de tareas y sus criterios
  const taskTypes = {
    "Práctica de procesos": {
      criteria: [
        { name: 'Calidad', weight: 60 },
        { name: 'Seguimiento de instrucciones', weight: 40 },
      ],
    },
    PRA: {
      criteria: [
        { name: 'Calidad', weight: 60 },
        { name: 'Seguimiento de instrucciones', weight: 40 },
      ],
    },
    Validacion: {
      criteria: [
        { name: 'Calidad', weight: 60 },
        { name: 'Cumplimiento de tiempo', weight: 20 },
        { name: '0 errores encontrados en GA', weight: 20 },
      ],
    },
    "STD Times": {
      criteria: [
        { name: 'Seguimiento de instrucciones', weight: 60 },
        { name: 'Calidad del servicio', weight: 40 },
      ],
    },
    "Entrenamientos (Recibe)": {
      criteria: [
        { name: 'Pruebas teóricas', weight: 40 },
        { name: 'Pruebas prácticas', weight: 60 },
      ],
    },
    "Entrenamientos (Brinda)": {
      criteria: [
        { name: 'Manejo del grupo', weight: 20 },
        { name: 'Transmisión de conocimientos', weight: 20 },
        { name: 'Entregables', weight: 20 },
        { name: 'Resultados obtenidos', weight: 20 },
        { name: 'Calidad del servicio', weight: 20 },
      ],
    },
    "Refrescamientos (Brinda)": {
      criteria: [
        { name: 'Contenido adecuado', weight: 20 },
        { name: 'Materiales didácticos', weight: 20 },
        { name: 'Explicación clara', weight: 20 },
        { name: 'Entregables', weight: 40 },
      ],
    },
  };

  // Función para exportar datos en formato JSON
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
  
  // Función para exportar datos a Excel
  const handleExportToExcel = () => {
    const employees = getEmployees();
    const tasks = getTasks();
    const workbook = XLSX.utils.book_new();
    
    // Definir estilos para el Excel
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1976D2' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };
    
    const subHeaderStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'E3F2FD' } },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };
    
    const cellStyle = {
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };
    
    // Crear hoja de resumen de empleados con bono
    const employeeSummary = employees.map(employee => {
      const employeeTasks = tasks.filter(task => task.employeeId === employee.id);
      const evaluatedTasks = employeeTasks.filter(task => task.totalScore !== undefined && task.totalScore !== null);
      const avgScore = evaluatedTasks.length > 0 
        ? evaluatedTasks.reduce((sum, task) => sum + task.totalScore, 0) / evaluatedTasks.length 
        : 0;
      // Calcular el bono proporcional (30% es el máximo para un promedio de 100%)
      const bonusPercentage = ((avgScore / 100) * 30).toFixed(2);
      
      return {
        "ID": employee.id,
        "Nombre": employee.name,
        "Total Tareas": employeeTasks.length,
        "Tareas Evaluadas": evaluatedTasks.length,
        "Promedio": `${avgScore.toFixed(2)}%`,
        "% Bono": `${bonusPercentage}%`
      };
    });
    
    // Ordenar por promedio descendente
    employeeSummary.sort((a, b) => {
      const aAvg = parseFloat(a["Promedio"].replace('%', ''));
      const bAvg = parseFloat(b["Promedio"].replace('%', ''));
      return bAvg - aAvg;
    });
    
    const employeeSummarySheet = XLSX.utils.json_to_sheet(employeeSummary);
    XLSX.utils.book_append_sheet(workbook, employeeSummarySheet, "Resumen Empleados");
    
    // Aplicar estilos a la hoja de resumen
    const employeeSummaryCols = ['A', 'B', 'C', 'D', 'E', 'F'];
    const employeeSummaryRange = XLSX.utils.decode_range(employeeSummarySheet['!ref']);
    
    // Aplicar estilos a los encabezados
    for (let col = 0; col <= employeeSummaryRange.e.c; col++) {
      const cellRef = `${employeeSummaryCols[col]}1`;
      if (!employeeSummarySheet[cellRef]) employeeSummarySheet[cellRef] = {};
      employeeSummarySheet[cellRef].s = headerStyle;
    }
    
    // Aplicar estilos a las celdas
    for (let row = 2; row <= employeeSummaryRange.e.r + 1; row++) {
      for (let col = 0; col <= employeeSummaryRange.e.c; col++) {
        const cellRef = `${employeeSummaryCols[col]}${row}`;
        if (!employeeSummarySheet[cellRef]) employeeSummarySheet[cellRef] = {};
        employeeSummarySheet[cellRef].s = cellStyle;
      }
    }
    
    // Crear hoja de estadísticas generales
    const statsData = createStatsData(tasks);
    const statsSheet = XLSX.utils.json_to_sheet(statsData.general);
    XLSX.utils.book_append_sheet(workbook, statsSheet, "Estadísticas Generales");
    
    // Crear hoja de distribución de calificaciones
    const distributionSheet = XLSX.utils.json_to_sheet(statsData.distribution);
    XLSX.utils.book_append_sheet(workbook, distributionSheet, "Distribución Calificaciones");
    
    // Crear hoja de estadísticas por tipo de tarea
    const taskTypeSheet = XLSX.utils.json_to_sheet(statsData.taskTypes);
    XLSX.utils.book_append_sheet(workbook, taskTypeSheet, "Estadísticas por Tipo");
    
    // Crear hoja de criterios con mayor impacto
    const criteriaSheet = XLSX.utils.json_to_sheet(statsData.criteria);
    XLSX.utils.book_append_sheet(workbook, criteriaSheet, "Criterios Impacto");
    
    // Crear hoja de tareas con bajo rendimiento
    const lowPerformanceSheet = XLSX.utils.json_to_sheet(statsData.lowPerformance);
    XLSX.utils.book_append_sheet(workbook, lowPerformanceSheet, "Bajo Rendimiento");
    
    // Crear hoja con todas las tareas
    const allTasksData = tasks.map(task => {
      const employeeName = employees.find(emp => emp.id === task.employeeId)?.name || 'Desconocido';
      return {
        "ID": task.id,
        "Título": task.title,
        "Empleado": employeeName,
        "Tipo": task.type,
        "Fecha": task.date,
        "Calificación Total": task.totalScore ? `${task.totalScore.toFixed(2)}%` : 'No evaluada',
        "Comentarios": task.comments || ''
      };
    });
    const allTasksSheet = XLSX.utils.json_to_sheet(allTasksData);
    XLSX.utils.book_append_sheet(workbook, allTasksSheet, "Todas las Tareas");
    
    // Aplicar estilos a la hoja de todas las tareas
    const allTasksCols = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const allTasksRange = XLSX.utils.decode_range(allTasksSheet['!ref']);
    
    // Aplicar estilos a los encabezados
    for (let col = 0; col <= allTasksRange.e.c; col++) {
      const cellRef = `${allTasksCols[col]}1`;
      if (!allTasksSheet[cellRef]) allTasksSheet[cellRef] = {};
      allTasksSheet[cellRef].s = headerStyle;
    }
    
    // Aplicar estilos a las celdas
    for (let row = 2; row <= allTasksRange.e.r + 1; row++) {
      for (let col = 0; col <= allTasksRange.e.c; col++) {
        const cellRef = `${allTasksCols[col]}${row}`;
        if (!allTasksSheet[cellRef]) allTasksSheet[cellRef] = {};
        allTasksSheet[cellRef].s = cellStyle;
      }
    }
    
    // Crear hojas individuales para cada empleado
    employees.forEach(employee => {
      const employeeTasks = tasks.filter(task => task.employeeId === employee.id);
      
      if (employeeTasks.length > 0) {
        // Datos generales del empleado
        const employeeData = [];
        
        // Información básica
        employeeData.push({ "Empleado": employee.name, "ID": employee.id });
        employeeData.push({});
        
        // Estadísticas del empleado
        const evaluatedTasks = employeeTasks.filter(task => task.totalScore !== undefined && task.totalScore !== null);
        const avgScore = evaluatedTasks.length > 0 
          ? evaluatedTasks.reduce((sum, task) => sum + task.totalScore, 0) / evaluatedTasks.length 
          : 0;
        
        // Calcular el bono proporcional (30% es el máximo para un promedio de 100%)
        const bonusPercentage = ((avgScore / 100) * 30).toFixed(2);
        
        employeeData.push({ "Estadística": "Valor" });
        employeeData.push({ "Estadística": "Total de tareas", "Valor": employeeTasks.length });
        employeeData.push({ "Estadística": "Tareas evaluadas", "Valor": evaluatedTasks.length });
        employeeData.push({ "Estadística": "Promedio de calificación", "Valor": `${avgScore.toFixed(2)}%` });
        employeeData.push({ "Estadística": "Porcentaje de bono", "Valor": `${bonusPercentage}%` });
        employeeData.push({});
        
        // Distribución de calificaciones
        const excellent = evaluatedTasks.filter(t => t.totalScore >= 90).length;
        const good = evaluatedTasks.filter(t => t.totalScore >= 70 && t.totalScore < 90).length;
        const average = evaluatedTasks.filter(t => t.totalScore >= 50 && t.totalScore < 70).length;
        const poor = evaluatedTasks.filter(t => t.totalScore < 50).length;
        
        employeeData.push({ "Distribución": "Cantidad", "Porcentaje": "" });
        employeeData.push({ 
          "Distribución": "Excelente (90-100%)", 
          "Cantidad": excellent, 
          "Porcentaje": evaluatedTasks.length > 0 ? `${(excellent / evaluatedTasks.length * 100).toFixed(2)}%` : "0%" 
        });
        employeeData.push({ 
          "Distribución": "Bueno (70-89%)", 
          "Cantidad": good, 
          "Porcentaje": evaluatedTasks.length > 0 ? `${(good / evaluatedTasks.length * 100).toFixed(2)}%` : "0%" 
        });
        employeeData.push({ 
          "Distribución": "Regular (50-69%)", 
          "Cantidad": average, 
          "Porcentaje": evaluatedTasks.length > 0 ? `${(average / evaluatedTasks.length * 100).toFixed(2)}%` : "0%" 
        });
        employeeData.push({ 
          "Distribución": "Deficiente (<50%)", 
          "Cantidad": poor, 
          "Porcentaje": evaluatedTasks.length > 0 ? `${(poor / evaluatedTasks.length * 100).toFixed(2)}%` : "0%" 
        });
        employeeData.push({});
        
        // Lista de tareas del empleado
        employeeData.push({ "Tareas": "" });
        employeeData.push({ 
          "ID": "ID", 
          "Título": "Título", 
          "Tipo": "Tipo", 
          "Fecha": "Fecha", 
          "Calificación": "Calificación" 
        });
        
        employeeTasks.forEach(task => {
          employeeData.push({ 
            "ID": task.id, 
            "Título": task.title, 
            "Tipo": task.type, 
            "Fecha": task.date, 
            "Calificación": task.totalScore ? `${task.totalScore.toFixed(2)}%` : 'No evaluada' 
          });
        });
        
        // Detalles de evaluaciones por tarea
        employeeData.push({});
        employeeData.push({ "Detalles de Evaluaciones": "" });
        
        evaluatedTasks.forEach(task => {
          employeeData.push({});
          employeeData.push({ "Tarea": task.title, "Tipo": task.type, "Fecha": task.date });
          employeeData.push({ "Criterio": "Criterio", "Puntuación": "Puntuación", "Peso": "Peso" });
          
          if (task.evaluations && taskTypes[task.type]) {
            taskTypes[task.type].criteria.forEach(criterion => {
              const score = task.evaluations[criterion.name] || 0;
              employeeData.push({ 
                "Criterio": criterion.name, 
                "Puntuación": `${score}%`, 
                "Peso": `${criterion.weight}%` 
              });
            });
          }
          
          employeeData.push({ "Calificación Total": `${task.totalScore.toFixed(2)}%` });
          if (task.comments) {
            employeeData.push({ "Comentarios": task.comments });
          }
        });
        
        const employeeSheet = XLSX.utils.json_to_sheet(employeeData);
        XLSX.utils.book_append_sheet(workbook, employeeSheet, `${employee.name.substring(0, 30)}`);
        
        // Aplicar estilos a la hoja del empleado
        // Estilo para el encabezado principal
        if (employeeSheet['A1']) {
          employeeSheet['A1'].s = {
            font: { bold: true, size: 14, color: { rgb: '1976D2' } }
          };
        }
        
        // Estilo para los encabezados de sección
        const sectionHeaders = ['A3', 'A8', 'A14'];
        sectionHeaders.forEach(ref => {
          if (employeeSheet[ref]) {
            employeeSheet[ref].s = subHeaderStyle;
          }
        });
      }
    });
    
    // Guardar el archivo Excel
    const excelFileName = `incentivo_reporte_completo_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, excelFileName);
  };
  
  // Función para crear datos de estadísticas
  const createStatsData = (tasks) => {
    // Filtrar tareas evaluadas
    const evaluatedTasks = tasks.filter(task => 
      task.totalScore !== undefined && task.totalScore !== null
    );
    
    // Estadísticas generales
    const avgScore = evaluatedTasks.length > 0 
      ? evaluatedTasks.reduce((sum, task) => sum + task.totalScore, 0) / evaluatedTasks.length 
      : 0;
    
    const generalStats = [
      { "Estadística": "Total de tareas evaluadas", "Valor": evaluatedTasks.length },
      { "Estadística": "Promedio general", "Valor": `${avgScore.toFixed(2)}%` },
      { "Estadística": "Fecha de generación", "Valor": new Date().toLocaleDateString() }
    ];
    
    // Distribución de calificaciones
    const excellent = evaluatedTasks.filter(t => t.totalScore >= 90).length;
    const good = evaluatedTasks.filter(t => t.totalScore >= 70 && t.totalScore < 90).length;
    const average = evaluatedTasks.filter(t => t.totalScore >= 50 && t.totalScore < 70).length;
    const poor = evaluatedTasks.filter(t => t.totalScore < 50).length;
    
    const distributionStats = [
      { 
        "Rango": "Excelente (90-100%)", 
        "Cantidad": excellent, 
        "Porcentaje": evaluatedTasks.length > 0 ? `${(excellent / evaluatedTasks.length * 100).toFixed(2)}%` : "0%" 
      },
      { 
        "Rango": "Bueno (70-89%)", 
        "Cantidad": good, 
        "Porcentaje": evaluatedTasks.length > 0 ? `${(good / evaluatedTasks.length * 100).toFixed(2)}%` : "0%" 
      },
      { 
        "Rango": "Regular (50-69%)", 
        "Cantidad": average, 
        "Porcentaje": evaluatedTasks.length > 0 ? `${(average / evaluatedTasks.length * 100).toFixed(2)}%` : "0%" 
      },
      { 
        "Rango": "Deficiente (<50%)", 
        "Cantidad": poor, 
        "Porcentaje": evaluatedTasks.length > 0 ? `${(poor / evaluatedTasks.length * 100).toFixed(2)}%` : "0%" 
      }
    ];
    
    // Estadísticas por tipo de tarea
    const tasksByType = {};
    evaluatedTasks.forEach(task => {
      if (!tasksByType[task.type]) {
        tasksByType[task.type] = [];
      }
      tasksByType[task.type].push(task);
    });
    
    const taskTypeStats = Object.keys(tasksByType).map(type => {
      const typeTasks = tasksByType[type];
      const avgScore = typeTasks.reduce((sum, task) => sum + task.totalScore, 0) / typeTasks.length;
      
      return {
        "Tipo de Tarea": type,
        "Cantidad": typeTasks.length,
        "Promedio": `${avgScore.toFixed(2)}%`,
        "Excelente": typeTasks.filter(t => t.totalScore >= 90).length,
        "Bueno": typeTasks.filter(t => t.totalScore >= 70 && t.totalScore < 90).length,
        "Regular": typeTasks.filter(t => t.totalScore >= 50 && t.totalScore < 70).length,
        "Deficiente": typeTasks.filter(t => t.totalScore < 50).length
      };
    });
    
    // Criterios con mayor impacto
    const allCriteria = {};
    
    evaluatedTasks.forEach(task => {
      if (!task.evaluations) return;
      
      Object.entries(task.evaluations).forEach(([criterio, puntuacion]) => {
        if (!allCriteria[criterio]) {
          allCriteria[criterio] = {
            name: criterio,
            totalScore: 0,
            count: 0,
            belowPerfect: 0,
            impactScore: 0,
            affectedTaskTypes: new Set(),
          };
        }
        
        allCriteria[criterio].totalScore += puntuacion;
        allCriteria[criterio].count += 1;
        
        if (puntuacion < 100) {
          allCriteria[criterio].belowPerfect += 1;
          allCriteria[criterio].impactScore += (100 - puntuacion);
          allCriteria[criterio].affectedTaskTypes.add(task.type);
        }
      });
    });
    
    const criteriaStats = Object.values(allCriteria).map(criteria => ({
      "Criterio": criteria.name,
      "Promedio": `${(criteria.totalScore / criteria.count).toFixed(2)}%`,
      "Impacto": criteria.impactScore,
      "Frecuencia Imperfecta": criteria.belowPerfect,
      "Porcentaje Imperfecto": `${((criteria.belowPerfect / criteria.count) * 100).toFixed(2)}%`,
      "Tipos de Tarea Afectados": Array.from(criteria.affectedTaskTypes).join(', ')
    }));
    
    // Ordenar por impacto (descendente)
    criteriaStats.sort((a, b) => b.Impacto - a.Impacto);
    
    // Tareas con bajo rendimiento
    const lowPerformanceTasks = evaluatedTasks
      .filter(task => task.totalScore < 70)
      .sort((a, b) => a.totalScore - b.totalScore)
      .slice(0, 10)
      .map(task => ({
        "Título": task.title,
        "Tipo": task.type,
        "Fecha": task.date,
        "Calificación": `${task.totalScore.toFixed(2)}%`
      }));
    
    return {
      general: generalStats,
      distribution: distributionStats,
      taskTypes: taskTypeStats,
      criteria: criteriaStats,
      lowPerformance: lowPerformanceTasks
    };
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
        <Tooltip title="Exportar a Excel">
          <IconButton 
            onClick={handleExportToExcel} 
            color="inherit" 
            aria-label="exportar a excel"
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
              <TableChartIcon fontSize="small" />
            </motion.div>
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Exportar">
          <IconButton 
            onClick={handleExport} 
            color="inherit" 
            aria-label="exportar datos json"
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
        
        <Tooltip title="Importar">
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