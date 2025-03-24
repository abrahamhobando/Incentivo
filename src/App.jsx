import React, { useState, useEffect } from 'react';
import { getEmployees, getTasks } from './utils/storage';
import { Box, Container, CssBaseline, Typography, Tabs, Tab, AppBar, Toolbar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import ReportTab from './components/ReportTab';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [reportTasks, setReportTasks] = useState([]);

  useEffect(() => {
    loadEmployees();
    loadTasks();
  }, []);

  const loadEmployees = () => {
    setEmployees(getEmployees());
  };

  const loadTasks = () => {
    const allTasks = getTasks();
    setTasks(allTasks);
    setReportTasks(allTasks);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Asignaciones
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, width: '100%', overflowX: 'auto' }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            aria-label="Pestañas de gestión"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTabs-flexContainer': {
                justifyContent: { xs: 'flex-start', md: 'center' }
              },
              '& .MuiTab-root': {
                minWidth: { xs: 'auto', sm: 120 },
                px: { xs: 2, sm: 3 }
              }
            }}
          >
            <Tab label="Gestión de Empleados" />
            <Tab label="Gestión de Tareas" />
            <Tab label="Informes" />
          </Tabs>
        </Box>

        <AnimatePresence mode="wait">
          {currentTab === 0 && (
            <motion.div
              key="employees"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3
              }}
            >
              <Box>
                <EmployeeForm onEmployeeAdded={loadEmployees} />
                <Box sx={{ mt: 3 }}>
                  <EmployeeList employees={employees} onEmployeeDeleted={loadEmployees} />
                </Box>
              </Box>
            </motion.div>
          )}

          {currentTab === 1 && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3
              }}
            >
              <Box>
                <TaskForm onTaskAdded={loadTasks} employees={employees} />
                <Box sx={{ mt: 3 }}>
                  <TaskList tasks={tasks} employees={employees} onTaskDeleted={loadTasks} />
                </Box>
              </Box>
            </motion.div>
          )}

          {currentTab === 2 && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3
              }}
            >
              <Box>
                <ReportTab employees={employees} tasks={reportTasks} />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}

export default App;