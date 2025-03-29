import React, { useState, useEffect, useContext } from 'react';
import { getEmployees, getTasks } from './utils/storage';
import { Box, Container, CssBaseline, Typography, Tabs, Tab, AppBar, Toolbar, useTheme, alpha, Paper } from '@mui/material';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import ReportTab from './components/ReportTab';
import DashboardTab from './components/DashboardTab';
import ThemeToggle from './components/ThemeToggle';
import DataTransfer from './components/DataTransfer';
import DeleteDataDialog from './components/DeleteDataDialog';
import { ColorModeContext } from './main';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import TaskIcon from '@mui/icons-material/Task';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Variantes de animación para los componentes
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.07,
      delayChildren: 0.2,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0] // Curva de aceleración al estilo Apple
    } 
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [reportTasks, setReportTasks] = useState([]);
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadTasks();
    
    // Simular carga inicial de componentes con un pequeño retraso
    const timer = setTimeout(() => {
      setAppLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
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
    <LayoutGroup>
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <CssBaseline />
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.1, 0.25, 1.0],
            delay: 0.2
          }}
        >
          <AppBar 
            position="static" 
            color="primary" 
            elevation={0}
            sx={{
              borderRadius: { xs: 0, sm: '0 0 12px 12px' },
              backdropFilter: 'blur(8px)',
              backgroundColor: mode === 'light' 
                ? alpha(theme.palette.primary.main, 0.95)
                : alpha(theme.palette.background.paper, 0.8),
              boxShadow: mode === 'light'
                ? `0 2px 12px ${alpha(theme.palette.primary.main, 0.2)}`
                : `0 2px 12px ${alpha(theme.palette.common.black, 0.3)}`,
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
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.4
                  }}
                  whileHover={{ 
                    rotate: [0, -5, 5, 0],
                    scale: 1.05,
                    transition: { duration: 0.5 }
                  }}
                >
                  <AssignmentIcon />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.5
                  }}
                >
                  Sistema de Asignaciones
                </motion.span>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.6
                  }}
                >
                  <DataTransfer onDataImported={() => {
                    loadEmployees();
                    loadTasks();
                  }} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.7
                  }}
                >
                  <DeleteDataDialog onDataDeleted={() => {
                    loadEmployees();
                    loadTasks();
                  }} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.8
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThemeToggle />
                </motion.div>
              </Box>
            </Toolbar>
          </AppBar>
        </motion.div>
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.25, 0.1, 0.25, 1.0],
              delay: 0.4
            }}
          >
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
                  <Tab icon={<DashboardIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Panel Principal" />
                  <Tab icon={<PeopleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Colaboradores" />
                  <Tab icon={<TaskIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Asignaciones" />
                  <Tab icon={<AssessmentIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Informes" />
                </Tabs>
              </Paper>
            </Box>
          </motion.div>

          <AnimatePresence mode="wait">
            {currentTab === 0 && (
              <motion.div
                key="dashboard"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box>
                  <DashboardTab 
                    employees={employees} 
                    tasks={tasks} 
                    onTabChange={handleTabChange} 
                  />
                </Box>
              </motion.div>
            )}

            {currentTab === 1 && (
              <motion.div
                key="employees"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box>
                  <motion.div variants={itemVariants}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                      Gestión de Colaboradores
                    </Typography>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <EmployeeForm onEmployeeAdded={loadEmployees} />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <EmployeeList employees={employees} onEmployeeDeleted={loadEmployees} />
                  </motion.div>
                </Box>
              </motion.div>
            )}

            {currentTab === 2 && (
              <motion.div
                key="tasks"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box>
                  <motion.div variants={itemVariants}>
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
                      Gestión de Asignaciones
                    </Typography>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <TaskForm 
                      employees={employees} 
                      onTaskAdded={loadTasks} 
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <TaskList 
                      tasks={tasks} 
                      employees={employees} 
                      onTaskUpdated={loadTasks} 
                      onTaskDeleted={loadTasks} 
                    />
                  </motion.div>
                </Box>
              </motion.div>
            )}

            {currentTab === 3 && (
              <motion.div
                key="reports"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box>
                  <ReportTab 
                    tasks={reportTasks} 
                    employees={employees} 
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Box>
    </LayoutGroup>
  );
}

export default App;