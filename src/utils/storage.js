// Funciones de utilidad para el manejo del almacenamiento local

// Claves para el almacenamiento local
const STORAGE_KEYS = {
  EMPLOYEES: 'incentivo_employees',
  TASKS: 'incentivo_tasks',
  SORT_PREFERENCES: 'incentivo_sort_preferences',
  NOTES: 'incentivo_notes',
};

// Funciones para empleados
export const getEmployees = () => {
  const employees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
  return employees ? JSON.parse(employees) : [];
};

export const saveEmployees = (employees) => {
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
};

export const addEmployee = (employee) => {
  const employees = getEmployees();
  const newEmployee = {
    id: Date.now(),
    name: employee.name,
  };
  employees.push(newEmployee);
  saveEmployees(employees);
  return newEmployee;
};

export const updateEmployee = (employeeId, updatedData) => {
  const employees = getEmployees();
  const index = employees.findIndex(emp => emp.id === employeeId);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updatedData };
    saveEmployees(employees);
    return employees[index];
  }
  return null;
};

export const deleteEmployee = (employeeId) => {
  const employees = getEmployees();
  const filteredEmployees = employees.filter(emp => emp.id !== employeeId);
  saveEmployees(filteredEmployees);
  
  // También eliminar las tareas asociadas
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.employeeId !== employeeId);
  saveTasks(filteredTasks);
};

// Funciones para tareas
export const getTasks = () => {
  const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const addTask = (task) => {
  const tasks = getTasks();
  // Asegurar que cada tarea tenga un ID único incluso si se crean en el mismo milisegundo
  const newTask = {
    ...task,
    id: Date.now() + Math.floor(Math.random() * 1000),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const deleteTask = (taskId) => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(filteredTasks);
};

// Funciones para preferencias de ordenamiento
export const getSortPreferences = () => {
  const preferences = localStorage.getItem(STORAGE_KEYS.SORT_PREFERENCES);
  return preferences ? JSON.parse(preferences) : {
    field: 'date',  // Valor predeterminado: ordenar por fecha
    direction: 'desc' // Valor predeterminado: descendente (más reciente primero)
  };
};

export const saveSortPreferences = (preferences) => {
  localStorage.setItem(STORAGE_KEYS.SORT_PREFERENCES, JSON.stringify(preferences));
};

// Funciones para notas
export const getNotes = () => {
  const notes = localStorage.getItem(STORAGE_KEYS.NOTES);
  return notes ? JSON.parse(notes) : [];
};

export const saveNotes = (notes) => {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

export const addNote = (content) => {
  const notes = getNotes();
  
  // Array de colores para asignar a las notas
  const colors = [
    '#ffcdd2', // Rojo claro
    '#f8bbd0', // Rosa claro
    '#e1bee7', // Púrpura claro
    '#d1c4e9', // Púrpura profundo claro
    '#c5cae9', // Índigo claro
    '#bbdefb', // Azul claro
    '#b3e5fc', // Azul claro acento
    '#b2ebf2', // Cian claro
    '#b2dfdb', // Verde azulado claro
    '#c8e6c9', // Verde claro
    '#dcedc8', // Lima claro
    '#f0f4c3', // Amarillo claro
    '#fff9c4', // Ámbar claro
    '#ffecb3', // Naranja claro
    '#ffe0b2', // Naranja profundo claro
  ];
  
  // Seleccionar un color aleatorio
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  const newNote = {
    id: Date.now(),
    content: content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color: randomColor,
  };
  
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
};

export const updateNote = (noteId, updatedContent) => {
  const notes = getNotes();
  const index = notes.findIndex(note => note.id === noteId);
  
  if (index !== -1) {
    notes[index] = { 
      ...notes[index], 
      content: updatedContent,
      updatedAt: new Date().toISOString()
    };
    saveNotes(notes);
    return notes[index];
  }
  return null;
};

export const deleteNote = (noteId) => {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== noteId);
  saveNotes(filteredNotes);
};