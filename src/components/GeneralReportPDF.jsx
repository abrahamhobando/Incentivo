import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#1976d2',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1976d2',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  statBox: {
    width: '30%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  statLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdbdbd',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
  employeeSection: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
  },
  employeeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  employeeStats: {
    fontSize: 12,
    color: '#333333',
  },
  taskTypeRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  taskTypeLabel: {
    fontSize: 10,
    width: '30%',
  },
  taskTypeValue: {
    fontSize: 10,
    width: '70%',
    fontWeight: 'bold',
  },
});

const GeneralReportPDF = ({ employees, tasks, dateRange }) => {
  // Filtrar solo tareas evaluadas
  const evaluatedTasks = tasks.filter(task => 
    task.totalScore !== undefined && task.totalScore !== null
  );

  // Calcular estadísticas generales
  const totalTasks = evaluatedTasks.length;
  const averageScore = totalTasks > 0 
    ? (evaluatedTasks.reduce((sum, task) => sum + task.totalScore, 0) / totalTasks).toFixed(2)
    : 0;
  const bonusPercentage = ((averageScore / 100) * 30).toFixed(2);

  // Calcular estadísticas por tipo de tarea
  const tasksByType = evaluatedTasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {});

  // Preparar datos de empleados con sus estadísticas
  const employeesWithStats = employees.map(employee => {
    // Filtrar tareas evaluadas para este empleado
    const employeeTasks = evaluatedTasks.filter(task => task.employeeId === employee.id);
    
    if (employeeTasks.length === 0) {
      return {
        employee,
        totalTasks: 0,
        averageScore: 0,
        bonusPercentage: '0.00',
        tasksByType: {}
      };
    }
    
    const totalScore = employeeTasks.reduce((sum, task) => sum + task.totalScore, 0);
    const averageScore = totalScore / employeeTasks.length;
    const bonusPercentage = ((averageScore / 100) * 30).toFixed(2);
    
    // Calcular tareas por tipo para este empleado
    const tasksByType = employeeTasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      employee,
      totalTasks: employeeTasks.length,
      averageScore,
      bonusPercentage,
      tasksByType
    };
  }).filter(stat => stat.totalTasks > 0); // Filtrar solo empleados con tareas evaluadas

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Informe General de Desempeño</Text>
          {dateRange.startDate && dateRange.endDate && (
            <Text>
              Periodo: {dateRange.startDate} - {dateRange.endDate}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Empleados</Text>
              <Text style={styles.statValue}>{employeesWithStats.length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Tareas</Text>
              <Text style={styles.statValue}>{totalTasks}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Promedio General</Text>
              <Text style={styles.statValue}>{averageScore}%</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Tareas por Tipo</Text>
          {Object.entries(tasksByType).map(([type, count]) => (
            <View style={styles.taskTypeRow} key={type}>
              <Text style={styles.taskTypeLabel}>{type}:</Text>
              <Text style={styles.taskTypeValue}>{count}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen por Empleado</Text>
          
          {employeesWithStats.map((stat) => (
            <View style={styles.employeeSection} key={stat.employee.id}>
              <View style={styles.employeeHeader}>
                <Text style={styles.employeeName}>{stat.employee.name}</Text>
                <Text style={styles.employeeStats}>
                  Tareas: {stat.totalTasks} | Promedio: {stat.averageScore.toFixed(2)}% | Bono: {stat.bonusPercentage}%
                </Text>
              </View>
              
              <Text style={[styles.sectionTitle, { fontSize: 12 }]}>Tareas por Tipo</Text>
              {Object.entries(stat.tasksByType).map(([type, count]) => (
                <View style={styles.taskTypeRow} key={`${stat.employee.id}-${type}`}>
                  <Text style={styles.taskTypeLabel}>{type}:</Text>
                  <Text style={styles.taskTypeValue}>{count}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Informe generado el {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default GeneralReportPDF;