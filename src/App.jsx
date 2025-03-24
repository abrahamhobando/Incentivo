import React, { useState, useEffect, useContext } from 'react';
import { getEmployees, getTasks } from './utils/storage';
import { Box, Container, CssBaseline, Typography, Tabs, Tab, AppBar, Toolbar, useTheme, alpha, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import ReportTab from './components/ReportTab';
import ThemeToggle from './components/ThemeToggle';
import { ColorModeContext } from './main';
import AssignmentIcon from '@mui/icons-material/Assignment';

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

  const theme = useTheme();
  const { mode } = useContext(ColorModeContext);

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar 
        position="static" 
        color="primary" 
        elevation={0}
        sx={{
          borderRadius: { xs: 0, sm: '0 0 12px 12px' },
          backdropFilter: 'blur(8px)',
          backgroundColor: alpha(theme.palette.primary.main, mode === 'light' ? 0.95 : 0.8),
          boxShadow: `0 2px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 500,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              '& svg': {
                mr: 1,
                fontSize: 24
              }
            }}
          >
            <motion.div
              initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <AssignmentIcon />
            </motion.div>
            Sistema de Asignaciones
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          sx={{ 
            mb: 4, 
            width: '100%', 
            overflowX: 'auto',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: theme => alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(8px)',
              boxShadow: theme => `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange} 
              aria-label="Pestañas de gestión"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                minHeight: 48,
                '& .MuiTabs-flexContainer': {
                  justifyContent: { xs: 'flex-start', md: 'center' }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 1.5,
                },
                '& .MuiTab-root': {
                  minWidth: { xs: 'auto', sm: 140 },
                  minHeight: 48,
                  px: { xs: 2, sm: 3 },
                  py: 1.5,
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
              <Tab label="Gestión de Empleados" />
              <Tab label="Gestión de Tareas" />
              <Tab label="Informes" />
            </Tabs>
          </Paper>
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