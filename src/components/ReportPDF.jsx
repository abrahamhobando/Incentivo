import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

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
  evaluationTable: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 5,
    marginBottom: 10,
  },
  evaluationRow: {
    flexDirection: 'row',
  },
  evaluationCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  evaluationCell: {
    margin: 3,
    fontSize: 8,
  },
  evaluationHeader: {
    margin: 3,
    fontSize: 8,
    fontWeight: 'bold',
  },
  taskRow: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  taskTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskScore: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  taskInfo: {
    fontSize: 10,
    marginBottom: 5,
  },
});

const ReportPDF = ({ employeeName, dateRange, statistics, tasks }) => {
  // Filtrar solo tareas evaluadas
  const evaluatedTasks = tasks.filter(task => 
    task.totalScore !== undefined && task.totalScore !== null
  );
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Informe de Desempeño</Text>
          <Text style={styles.subtitle}>{employeeName}</Text>
          {dateRange.startDate && dateRange.endDate && (
            <Text>
              Periodo: {dateRange.startDate} - {dateRange.endDate}
            </Text>
          )}
        </View>

        {statistics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen de Desempeño</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Tareas Completadas</Text>
                <Text style={styles.statValue}>{statistics.totalTasks}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Promedio General</Text>
                <Text style={styles.statValue}>{statistics.averageScore.toFixed(2)}%</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>Bono Obtenido</Text>
                <Text style={styles.statValue}>{statistics.bonusPercentage}%</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Tareas por Tipo</Text>
            {Object.entries(statistics.tasksByType).map(([type, count]) => (
              <View style={styles.taskTypeRow} key={type}>
                <Text style={styles.taskTypeLabel}>{type}:</Text>
                <Text style={styles.taskTypeValue}>{count}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de Asignaciones</Text>
          
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Fecha</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Título</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Tipo</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Calificación</Text>
              </View>
            </View>

            {tasks.map((task) => (
              <View style={styles.tableRow} key={task.id}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{task.date}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{task.title}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{task.type}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{task.totalScore.toFixed(2)}%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evaluaciones Detalladas</Text>
          
          {tasks.map((task) => (
            <View style={styles.taskRow} key={task.id}>
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskScore}>{task.totalScore.toFixed(2)}%</Text>
              </View>
              <Text style={styles.taskInfo}>Fecha: {task.date} | Tipo: {task.type}</Text>
              
              <View style={styles.evaluationTable}>
                <View style={styles.evaluationRow}>
                  <View style={styles.evaluationCol}>
                    <Text style={styles.evaluationHeader}>Criterio</Text>
                  </View>
                  <View style={styles.evaluationCol}>
                    <Text style={styles.evaluationHeader}>Peso</Text>
                  </View>
                  <View style={styles.evaluationCol}>
                    <Text style={styles.evaluationHeader}>Puntuación</Text>
                  </View>
                  <View style={styles.evaluationCol}>
                    <Text style={styles.evaluationHeader}>Ponderado</Text>
                  </View>
                </View>
                
                {Object.entries(task.evaluations || {}).map(([criterio, puntuacion]) => {
                  const peso = task.type === 'PRA' ?
                    (criterio === 'Calidad' ? 60 : 40) :
                    (criterio === 'Calidad' ? 60 : 20);
                  // Aplicar regla especial para criterio de Calidad en tareas PRA y Validacion
                  let ponderado = 0;
                  if ((task.type === 'PRA' || task.type === 'Validacion') && 
                      criterio === 'Calidad' && puntuacion < 70) {
                    // Si calidad es menor a 70%, se pierde todo el porcentaje
                    ponderado = 0;
                  } else {
                    ponderado = (puntuacion * peso / 100).toFixed(2);
                  }
                  
                  return (
                    <View style={styles.evaluationRow} key={criterio}>
                      <View style={styles.evaluationCol}>
                        <Text style={styles.evaluationCell}>{criterio}</Text>
                      </View>
                      <View style={styles.evaluationCol}>
                        <Text style={styles.evaluationCell}>{peso}%</Text>
                      </View>
                      <View style={styles.evaluationCol}>
                        <Text style={styles.evaluationCell}>{puntuacion}%</Text>
                      </View>
                      <View style={styles.evaluationCol}>
                        <Text style={styles.evaluationCell}>{ponderado}%</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              {task.comments && (
                <View style={{ marginTop: 8, padding: 6, backgroundColor: '#f5f5f5', borderRadius: 3, borderLeftWidth: 3, borderLeftColor: '#1976d2', borderLeftStyle: 'solid' }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 3, color: '#1976d2' }}>Comentarios de la tarea:</Text>
                  <Text style={{ fontSize: 8 }}>{task.comments}</Text>
                </View>
              )}
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

export default ReportPDF;