import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos para el PDF, basados en ReportPDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#1976d2',
    paddingBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  dateRange: {
    fontSize: 12,
    color: '#666',
  },
  executiveSummary: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  statCard: {
    width: '30%',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
    borderLeftStyle: 'solid',
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 15,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  taskTypeContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
  taskTypeRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  taskTypeLabel: {
    fontSize: 11,
    width: '60%',
    color: '#333',
  },
  taskTypeValue: {
    fontSize: 11,
    width: '40%',
    fontWeight: 'bold',
    color: '#1976d2',
  },
  employeeSection: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  employeeStats: {
    fontSize: 12,
    color: '#666',
  },
  evaluationCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  evaluationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  evaluationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  evaluationScore: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  evaluationInfo: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
  },
  criteriaTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
    width: '25%',
    textAlign: 'left',
  },
  headerCell: {
    padding: 6,
    fontSize: 9,
    fontWeight: 'bold',
    width: '25%',
    color: '#1976d2',
  },
  comments: {
    marginTop: 8,
    padding: 6,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#1976d2',
    borderLeftStyle: 'solid',
  },
  commentTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 9,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  employeeTaskTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 15,
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
  const bonusPercentage = ((parseFloat(averageScore) / 100) * 30).toFixed(2);

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
        tasksByType: {},
        tasks: []
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
      tasksByType,
      tasks: employeeTasks.sort((a, b) => new Date(b.date) - new Date(a.date)) // Ordenar por fecha descendente
    };
  }).filter(stat => stat.totalTasks > 0); // Filtrar solo empleados con tareas evaluadas

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Informe General de Desempeño</Text>
          {dateRange.startDate && dateRange.endDate && (
            <Text style={styles.dateRange}>
              Periodo: {dateRange.startDate} - {dateRange.endDate}
            </Text>
          )}
        </View>

        {/* Resumen Ejecutivo */}
        <View style={styles.executiveSummary}>
          <Text style={styles.summaryTitle}>Resumen General</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Empleados</Text>
              <Text style={styles.statValue}>{employeesWithStats.length}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Tareas</Text>
              <Text style={styles.statValue}>{totalTasks}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Promedio General</Text>
              <Text style={styles.statValue}>{averageScore}%</Text>
            </View>
          </View>

          {/* Distribución por Tipo de Tarea */}
          <View style={[styles.section, { marginTop: 15, marginBottom: 0 }]}>
            <Text style={[styles.sectionTitle, { fontSize: 14 }]}>Distribución por Tipo</Text>
            <View style={styles.taskTypeContainer}>
              {Object.entries(tasksByType).map(([type, count]) => (
                <View style={styles.taskTypeRow} key={type}>
                  <Text style={styles.taskTypeLabel}>{type}:</Text>
                  <Text style={styles.taskTypeValue}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Resumen por Colaborador */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen por Colaborador</Text>
          
          {employeesWithStats.map((stat) => (
            <View style={styles.employeeSection} key={stat.employee.id}>
              <View style={styles.employeeHeader}>
                <Text style={styles.employeeName}>{stat.employee.name}</Text>
                <Text style={styles.employeeStats}>
                  Tareas: {stat.totalTasks} | Promedio: {stat.averageScore.toFixed(2)}% | Bono: {stat.bonusPercentage}%
                </Text>
              </View>
              
              {/* Distribución por Tipo de Tarea */}
              <Text style={[styles.sectionTitle, { fontSize: 13, marginBottom: 10 }]}>Tareas por Tipo</Text>
              <View style={styles.taskTypeContainer}>
                {Object.entries(stat.tasksByType).map(([type, count]) => (
                  <View style={styles.taskTypeRow} key={`${stat.employee.id}-${type}`}>
                    <Text style={styles.taskTypeLabel}>{type}:</Text>
                    <Text style={styles.taskTypeValue}>{count}</Text>
                  </View>
                ))}
              </View>
              
              {/* Tabla de resumen de tareas */}
              <Text style={[styles.sectionTitle, { fontSize: 13, marginBottom: 10 }]}>Resumen de Tareas</Text>
              <View style={styles.employeeTaskTable}>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerCell}>Fecha</Text>
                  <Text style={styles.headerCell}>Título</Text>
                  <Text style={styles.headerCell}>Tipo</Text>
                  <Text style={styles.headerCell}>Calificación</Text>
                </View>
                
                {stat.tasks.map((task) => (
                  <View style={styles.tableRow} key={task.id}>
                    <Text style={styles.tableCell}>{task.date}</Text>
                    <Text style={styles.tableCell}>{task.title}</Text>
                    <Text style={styles.tableCell}>{task.type}</Text>
                    <Text style={styles.tableCell}>{task.totalScore.toFixed(2)}%</Text>
                  </View>
                ))}
              </View>
              
              {/* Evaluaciones Detalladas */}
              <Text style={[styles.sectionTitle, { fontSize: 13, marginBottom: 10 }]}>Evaluaciones Detalladas</Text>
              
              {stat.tasks.map((task) => (
                <View style={styles.evaluationCard} key={task.id}>
                  <View style={styles.evaluationHeader}>
                    <Text style={styles.evaluationTitle}>{task.title}</Text>
                    <Text style={styles.evaluationScore}>{task.totalScore.toFixed(2)}%</Text>
                  </View>
                  <Text style={styles.evaluationInfo}>
                    Fecha: {task.date} | Tipo: {task.type}
                  </Text>

                  {/* Tabla de Criterios */}
                  <View style={styles.criteriaTable}>
                    <View style={styles.tableHeader}>
                      <Text style={styles.headerCell}>Criterio</Text>
                      <Text style={styles.headerCell}>Peso</Text>
                      <Text style={styles.headerCell}>Puntuación</Text>
                      <Text style={styles.headerCell}>Ponderado</Text>
                    </View>

                    {Object.entries(task.evaluations || {}).map(([criterio, puntuacion]) => {
                      let peso = 0;
                      if (task.type === 'PRA' || task.type === 'Práctica de procesos') {
                        peso = criterio === 'Calidad' ? 60 : criterio === 'Seguimiento de instrucciones' ? 40 : 0;
                      } else if (task.type === 'Validacion') {
                        peso = criterio === 'Calidad' ? 60 : criterio === 'Cumplimiento de tiempo' ? 20 : criterio === '0 errores encontrados en GA' ? 20 : 0;
                      } else if (task.type === 'STD Times') {
                        peso = criterio === 'Seguimiento de instrucciones' ? 60 : criterio === 'Calidad del servicio' ? 40 : 0;
                      } else if (task.type === 'Entrenamientos (Recibe)') {
                        peso = criterio === 'Pruebas teóricas' ? 40 : criterio === 'Pruebas prácticas' ? 60 : 0;
                      } else if (task.type === 'Entrenamientos (Brinda)') {
                        peso = 20;
                      } else if (task.type === 'Refrescamientos (Brinda)') {
                        peso = criterio === 'Contenido adecuado' ? 20 : criterio === 'Materiales didácticos' ? 20 : criterio === 'Explicación clara' ? 20 : criterio === 'Entregables' ? 40 : 0;
                      }

                      let ponderado = 0;
                      if ((task.type === 'PRA' || task.type === 'Validacion' || task.type === 'Práctica de procesos') && 
                          criterio === 'Calidad' && puntuacion < 70) {
                        ponderado = 0;
                      } else {
                        ponderado = (puntuacion * peso / 100).toFixed(2);
                      }

                      return (
                        <View style={styles.tableRow} key={criterio}>
                          <Text style={styles.tableCell}>{criterio}</Text>
                          <Text style={styles.tableCell}>{peso}%</Text>
                          <Text style={styles.tableCell}>{puntuacion}%</Text>
                          <Text style={styles.tableCell}>{ponderado}%</Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Comentarios */}
                  {task.comments && (
                    <View style={styles.comments}>
                      <Text style={styles.commentTitle}>Comentarios:</Text>
                      <Text style={styles.commentText}>{task.comments}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text>Informe generado el {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default GeneralReportPDF;