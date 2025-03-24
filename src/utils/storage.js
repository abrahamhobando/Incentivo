// Funciones de utilidad para el manejo del almacenamiento local

// Claves para el almacenamiento local
const STORAGE_KEYS = {
  EMPLOYEES: 'incentivo_employees',
  TASKS: 'incentivo_tasks',
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
  const newTask = {
    ...task,
    id: Date.now(),
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