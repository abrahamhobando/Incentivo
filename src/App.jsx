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
      staggerChildren: 0.06,
      delayChildren: 0.1,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0] // Curva de aceleración al estilo Apple
    } 
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0, scale: 0.98 },
  visible: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
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
      <Box 
        sx={{ 
          flexGrow: 1, 
          minHeight: '100vh',
          background: mode === 'light' 
            ? 'linear-gradient(145deg, rgba(241,245,249,1) 0%, rgba(214,229,250,0.6) 100%)' 
            : 'linear-gradient(145deg, #000000 0%, rgba(39,39,42,0.8) 100%)',
          backgroundAttachment: 'fixed'
        }}
      >
        <CssBaseline />
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.25, 0.1, 0.25, 1.0],
            delay: 0.1
          }}
        >
          <AppBar 
            position="sticky" 
            color="transparent" 
            elevation={0}
            sx={{
              backdropFilter: 'blur(15px)',
              backgroundColor: mode === 'light' 
                ? alpha(theme.palette.background.paper, 0.7)
                : alpha(theme.palette.background.paper, 0.6),
              borderBottom: '1px solid',
              borderColor: mode === 'light'
                ? 'rgba(0, 0, 0, 0.05)'
                : 'rgba(255, 255, 255, 0.05)',
              zIndex: theme => theme.zIndex.drawer + 1,
            }}
          >
            <Toolbar sx={{ py: 1 }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 600,
                  letterSpacing: '-0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': {
                    mr: 1.5,
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
                    delay: 0.3
                  }}
                  whileHover={{ 
                    rotate: [0, -5, 5, 0],
                    scale: 1.05,
                    transition: { duration: 0.5 }
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '10px',
                      background: mode === 'light'
                        ? 'linear-gradient(135deg, #0A84FF, #5AC8FA)'
                        : 'linear-gradient(135deg, #0A84FF, #4DA2FF)',
                      boxShadow: '0 2px 8px rgba(10, 132, 255, 0.25)'
                    }}
                  >
                    <AssignmentIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Box>
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.4
                  }}
                >
                  Sistema de Asignaciones
                </motion.span>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.5
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
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
                    delay: 0.6
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
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
                    delay: 0.7
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
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
              duration: 0.5, 
              ease: [0.25, 0.1, 0.25, 1.0],
              delay: 0.3
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
                  backgroundColor: theme => mode === 'light' 
                    ? alpha(theme.palette.background.paper, 0.7)
                    : alpha(theme.palette.background.paper, 0.5),
                  backdropFilter: 'blur(15px)',
                  boxShadow: theme => mode === 'light'
                    ? '0 4px 20px rgba(0, 0, 0, 0.05)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.2)',
                  border: '1px solid',
                  borderColor: mode === 'light'
                    ? 'rgba(0, 0, 0, 0.05)'
                    : 'rgba(255, 255, 255, 0.05)',
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
                    minHeight: 56,
                    '& .MuiTabs-flexContainer': {
                      justifyContent: { xs: 'flex-start', md: 'center' }
                    },
                    '& .MuiTabs-indicator': {
                      height: 4,
                      borderRadius: 2,
                      background: 'linear-gradient(to right, #0A84FF, #5AC8FA)',
                    },
                    '& .MuiTab-root': {
                      minWidth: { xs: 'auto', sm: 140 },
                      minHeight: 56,
                      px: { xs: 2, sm: 3 },
                      py: 1.5,
                      fontWeight: 500,
                      transition: 'all 0.3s',
                      '&:hover': {
                        color: 'primary.main',
                        opacity: 1,
                        backgroundColor: mode === 'light'
                          ? 'rgba(255, 255, 255, 0.7)'
                          : 'rgba(30, 30, 30, 0.5)',
                      },
                      '&.Mui-selected': {
                        fontWeight: 600,
                      }
                    }
                  }}
                >
                  <Tab icon={<DashboardIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Panel Principal" />
                  <Tab icon={<PeopleIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Colaboradores" />
                  <Tab icon={<TaskIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Asignaciones" />
                  <Tab icon={<AssessmentIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Informes" />
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
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, letterSpacing: '-0.5px' }}>
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
                    <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, letterSpacing: '-0.5px' }}>
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