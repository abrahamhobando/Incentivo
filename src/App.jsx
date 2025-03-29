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
      staggerChildren: 0.05,
      delayChildren: 0.08,
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0] // Curva de aceleración estilo Apple
    } 
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

const itemVariants = {
  hidden: { y: 12, opacity: 0, scale: 0.98 },
  visible: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
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
            ? 'linear-gradient(135deg, #F5F5F7 0%, rgba(214,229,250,0.5) 100%)' 
            : 'linear-gradient(135deg, #000000 0%, rgba(39,39,42,0.7) 100%)',
          backgroundAttachment: 'fixed'
        }}
      >
        <CssBaseline />
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.25, 0.1, 0.25, 1.0],
            delay: 0.1
          }}
        >
          <AppBar 
            position="sticky" 
            color="transparent" 
            elevation={0}
            sx={{
              backdropFilter: 'blur(20px) saturate(180%)',
              backgroundColor: mode === 'light' 
                ? alpha(theme.palette.background.paper, 0.8)
                : alpha(theme.palette.background.paper, 0.7),
              borderBottom: '1px solid',
              borderColor: mode === 'light'
                ? 'rgba(0, 0, 0, 0.03)'
                : 'rgba(255, 255, 255, 0.03)',
              zIndex: theme => theme.zIndex.drawer + 1,
            }}
          >
            <Toolbar sx={{ py: 0.5 }}>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 600,
                  letterSpacing: '-0.012em',
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': {
                    mr: 1.5,
                    fontSize: 24
                  }
                }}
              >
                <motion.div
                  initial={{ rotate: -5, scale: 0.95, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.3
                  }}
                  whileHover={{ 
                    rotate: [0, -3, 3, 0],
                    scale: 1.03,
                    transition: { duration: 0.4 }
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #0A84FF, #5AC8FA)',
                      boxShadow: '0 2px 8px rgba(10, 132, 255, 0.2)'
                    }}
                  >
                    <AssignmentIcon sx={{ color: '#fff', fontSize: 18 }} />
                  </Box>
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.4
                  }}
                  style={{ marginLeft: '16px' }}
                >
                  Sistema de Asignaciones
                </motion.span>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.5
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DataTransfer onDataImported={() => {
                    loadEmployees();
                    loadTasks();
                  }} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.6
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <DeleteDataDialog onDataDeleted={() => {
                    loadEmployees();
                    loadTasks();
                  }} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: [0.25, 0.1, 0.25, 1.0],
                    delay: 0.7
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ThemeToggle />
                </motion.div>
              </Box>
            </Toolbar>
          </AppBar>
        </motion.div>
        
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.1, 0.25, 1.0],
              delay: 0.25
            }}
          >
            <Box 
              sx={{ 
                mb: 3, 
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
                  borderRadius: 2.5,
                  overflow: 'hidden',
                  backgroundColor: theme => mode === 'light' 
                    ? alpha(theme.palette.background.paper, 0.7)
                    : alpha(theme.palette.background.paper, 0.5),
                  backdropFilter: 'blur(20px) saturate(180%)',
                  boxShadow: theme => mode === 'light'
                    ? '0 2px 10px rgba(0, 0, 0, 0.03)' 
                    : '0 2px 10px rgba(0, 0, 0, 0.15)',
                  border: '1px solid',
                  borderColor: mode === 'light'
                    ? 'rgba(0, 0, 0, 0.03)'
                    : 'rgba(255, 255, 255, 0.03)',
                }}
              >
                <Tabs 
                  value={currentTab} 
                  onChange={handleTabChange} 
                  aria-label="Navegación principal"
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
                      background: 'linear-gradient(to right, #0A84FF, #5AC8FA)',
                    },
                    '& .MuiTab-root': {
                      minWidth: { xs: 'auto', sm: 130 },
                      minHeight: 48,
                      px: { xs: 1.5, sm: 2.5 },
                      py: 1.25,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)',
                      '&:hover': {
                        color: 'primary.main',
                        opacity: 1,
                        backgroundColor: mode === 'light'
                          ? 'rgba(255, 255, 255, 0.6)'
                          : 'rgba(30, 30, 30, 0.4)',
                      },
                      '&.Mui-selected': {
                        fontWeight: 600,
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
                    <Typography variant="h5" component="h2" sx={{ mb: 2.5, fontWeight: 600, letterSpacing: '-0.016em' }}>
                      Gestión de Colaboradores
                    </Typography>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <EmployeeForm onEmployeeAdded={loadEmployees} />
                  </motion.div>
                  <motion.div variants={itemVariants} style={{ marginTop: '24px' }}>
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
                    <Typography variant="h5" component="h2" sx={{ mb: 2.5, fontWeight: 600, letterSpacing: '-0.016em' }}>
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