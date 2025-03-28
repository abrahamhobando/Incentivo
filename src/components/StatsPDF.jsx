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
  chartPlaceholder: {
    height: 150,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  distributionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  distributionItem: {
    width: '48%',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBox: {
    width: 12,
    height: 12,
    marginRight: 5,
    borderRadius: 2,
  },
  distributionLabel: {
    fontSize: 9,
    flex: 1,
  },
  distributionValue: {
    fontSize: 9,
    fontWeight: 'bold',
  },
});

const StatsPDF = ({ dateRange, filteredTasks, taskTypeStats, criteriaStats, lowPerformanceTasks }) => {
  // Calcular estadísticas generales
  const totalTasks = filteredTasks.length;
  const averageScore = totalTasks > 0 
    ? (filteredTasks.reduce((sum, task) => sum + task.totalScore, 0) / totalTasks).toFixed(2)
    : 0;
  
  // Distribución de calificaciones
  const distributionData = [
    { name: 'Excelente (90-100%)', value: filteredTasks.filter(t => t.totalScore >= 90).length, color: '#4caf50' },
    { name: 'Bueno (70-89%)', value: filteredTasks.filter(t => t.totalScore >= 70 && t.totalScore < 90).length, color: '#2196f3' },
    { name: 'Regular (50-69%)', value: filteredTasks.filter(t => t.totalScore >= 50 && t.totalScore < 70).length, color: '#ff9800' },
    { name: 'Deficiente (<50%)', value: filteredTasks.filter(t => t.totalScore < 50).length, color: '#f44336' },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Estadísticas de Evaluaciones</Text>
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
              <Text style={styles.statLabel}>Asignaciones Evaluadas</Text>
              <Text style={styles.statValue}>{totalTasks}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Promedio General</Text>
              <Text style={styles.statValue}>{averageScore}%</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Criterios Imperfectos</Text>
              <Text style={styles.statValue}>{criteriaStats.filter(c => c.belowPerfect > 0).length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribución de Calificaciones</Text>
          <View style={styles.distributionContainer}>
            {distributionData.map((item) => (
              <View style={styles.distributionItem} key={item.name}>
                <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                <Text style={styles.distributionLabel}>{item.name}</Text>
                <Text style={styles.distributionValue}>{item.value} ({totalTasks > 0 ? ((item.value / totalTasks) * 100).toFixed(1) : 0}%)</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promedio por Categoría</Text>
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Categoría</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Cantidad</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Promedio</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellHeader}>Distribución</Text>
              </View>
            </View>

            {taskTypeStats.map((stat) => (
              <View style={styles.tableRow} key={stat.type}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{stat.type}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{stat.count}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{stat.avgScore.toFixed(2)}%</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    E: {stat.scoreDistribution.excellent}, B: {stat.scoreDistribution.good}, 
                    R: {stat.scoreDistribution.average}, D: {stat.scoreDistribution.poor}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Criterios con Mayor Impacto</Text>
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <View style={[styles.tableCol, { width: '40%' }]}>
                <Text style={styles.tableCellHeader}>Criterio</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCellHeader}>Promedio</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCellHeader}>% Afectación</Text>
              </View>
              <View style={[styles.tableCol, { width: '20%' }]}>
                <Text style={styles.tableCellHeader}>Impacto</Text>
              </View>
            </View>

            {criteriaStats.filter(c => c.belowPerfect > 0).slice(0, 8).map((criteria) => (
              <View style={styles.tableRow} key={criteria.name}>
                <View style={[styles.tableCol, { width: '40%' }]}>
                  <Text style={styles.tableCell}>{criteria.name}</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{criteria.avgScore.toFixed(2)}%</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{criteria.impactPercentage.toFixed(2)}%</Text>
                </View>
                <View style={[styles.tableCol, { width: '20%' }]}>
                  <Text style={styles.tableCell}>{criteria.impactScore.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {lowPerformanceTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Asignaciones con Bajo Rendimiento</Text>
            <View style={styles.table}>
              <View style={styles.tableRowHeader}>
                <View style={[styles.tableCol, { width: '50%' }]}>
                  <Text style={styles.tableCellHeader}>Título</Text>
                </View>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text style={styles.tableCellHeader}>Tipo</Text>
                </View>
                <View style={[styles.tableCol, { width: '25%' }]}>
                  <Text style={styles.tableCellHeader}>Calificación</Text>
                </View>
              </View>

              {lowPerformanceTasks.map((task) => (
                <View style={styles.tableRow} key={task.id}>
                  <View style={[styles.tableCol, { width: '50%' }]}>
                    <Text style={styles.tableCell}>{task.title}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '25%' }]}>
                    <Text style={styles.tableCell}>{task.type}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: '25%' }]}>
                    <Text style={styles.tableCell}>{task.totalScore.toFixed(2)}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Informe generado el {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default StatsPDF;