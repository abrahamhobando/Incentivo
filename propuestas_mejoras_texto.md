# Propuestas de Mejoras de Texto para Incentivo

A continuación se presentan todas las propuestas de mejoras de texto para la aplicación web Incentivo. Por favor, marca con una X las propuestas que deseas implementar y añade cualquier corrección adicional si lo deseas.

## Componentes Generales

### App.jsx

- [ ] Cambiar "Sistema de Asignaciones" por "Tareas" en el título principal para mantener consistencia con el nombre de la aplicación
- [ ] Cambiar "Pestañas de gestión" por "Navegación principal" en el aria-label de las pestañas

### Pestañas Principales

- [ x] Renombrar "Dashboard" por "Panel Principal" para mantener todo en español
- [ x] Renombrar "Empleados" por "Colaboradores" para usar un lenguaje más inclusivo
- [ x] Renombrar "Tareas" por "Asignaciones" para mantener consistencia con el nombre del sistema
- [ x] Renombrar "Reportes" por "Informes" para un lenguaje más formal

## Componentes de Empleados

### EmployeeForm.jsx

- [] Cambiar "Nombre" por "Nombre del colaborador" en el campo de texto para mayor claridad
- [ ] Cambiar "Agregar" por "Añadir colaborador" en el botón para ser más específico

### EmployeeList.jsx

- [ x] Cambiar "Empleado no encontrado" por "Colaborador no encontrado" para mantener consistencia
- [ x] Cambiar el texto del botón de edición de "Guardar" a "Actualizar" para mayor claridad

## Componentes de Tareas

### TaskForm.jsx

- [ x] Cambiar "Título" por "Título de la asignación" para mayor claridad
- [ x] Cambiar "Empleado" por "Colaborador asignado" en el selector de empleados
- [ x] Cambiar "Tipo" por "Categoría" para el selector de tipo de tarea
- [x ] Cambiar "Fecha" por "Fecha de asignación" para mayor precisión
- [x ] Cambiar "Comentarios" por "Observaciones" para un tono más profesional
- [ x] Cambiar "Agregar tarea" por "Crear asignación" en el botón principal
- [ ] Cambiar "Asignación múltiple" por "Asignar a varios colaboradores" para mayor claridad
- [x ] Cambiar "Mostrar formulario" por "Crear nueva asignación" para ser más descriptivo

### TaskList.jsx

- [ x] Cambiar "Filtrar por empleado" por "Filtrar por colaborador" en el selector de filtros
- [ x] Cambiar "Filtrar por tipo" por "Filtrar por categoría" en el selector de filtros
- [x ] Cambiar "Fecha inicial" por "Desde" para un diseño más minimalista
- [ x] Cambiar "Fecha final" por "Hasta" para un diseño más minimalista
- [ ] Cambiar "Buscar" por "Buscar asignaciones" en el campo de búsqueda
- [x ] Cambiar "Mostrar solo tareas sin evaluar" por "Pendientes de evaluación" para ser más conciso
- [ x] Cambiar "No hay tareas que coincidan con los filtros" por "Sin resultados" para un mensaje más breve
- [ x] Cambiar los encabezados de la tabla: "Título" → "Asignación", "Empleado" → "Colaborador", "Tipo" → "Categoría", "Fecha" → "Asignado el", "Evaluación" → "Calificación"

### TaskDialog.jsx

- [ x] Cambiar "Editar tarea" por "Editar asignación" en el título del diálogo
- [ ] Cambiar "Guardar cambios" por "Actualizar" en el botón de guardar
- [] Cambiar "Cancelar" por "Volver" en el botón de cancelar
- [ ] Cambiar "Evaluación" por "Evaluación de desempeño" en el título de la sección
- [ x] Cambiar "Puntaje total" por "Calificación final" para mayor claridad
- [x ] Cambiar "No evaluado" por "Pendiente de evaluación" para mayor formalidad

## Componentes de Reportes

### ReportTab.jsx

- [x ] Cambiar "Seleccionar empleado" por "Seleccionar colaborador" en el selector
- [ x] Cambiar "Rango de fechas" por "Periodo" para un lenguaje más conciso
- [x ] Cambiar "Descargar reporte" por "Exportar a PDF" para mayor claridad
- [ x] Cambiar "Mostrar detalles" por "Ver desglose" para un lenguaje más técnico
- [x ] Cambiar "Tareas totales" por "Total de asignaciones" para mantener consistencia
- [ x] Cambiar "Puntaje promedio" por "Promedio de desempeño" para mayor formalidad
- [ x] Cambiar "Porcentaje de bono" por "Incentivo calculado" para alinearse con el nombre de la aplicación

### DashboardTab.jsx

- [x ] Cambiar "Estadísticas generales" por "Resumen" para un diseño más minimalista
- [ x] Cambiar "Empleados registrados" por "Colaboradores" para ser más conciso
- [x ] Cambiar "Tareas totales" por "Asignaciones" para ser más conciso
- [x ] Cambiar "Tareas evaluadas" por "Evaluadas" para ser más conciso
- [ x] Cambiar "Tareas pendientes" por "Pendientes" para ser más conciso
- [ x] Cambiar "Empleados recientes" por "Últimos colaboradores" para mayor claridad
- [ x] Cambiar "Tareas recientes" por "Últimas asignaciones" para mayor claridad
- [x ] Cambiar "Ver todos los empleados" por "Ver todos" para un diseño más minimalista
- [ x] Cambiar "Ver todas las tareas" por "Ver todas" para un diseño más minimalista

## Componentes de Diálogo

### ConfirmDialog.jsx

- [x ] Cambiar el botón "Eliminar" por "Confirmar" para ser más genérico y menos agresivo
- [ ] Cambiar "Cancelar" por "Volver" para un lenguaje más amigable

### DeleteDataDialog.jsx

- [ x] Cambiar "Eliminar datos" por "Gestión de datos" para un título menos agresivo
- [ ] Cambiar "Por fecha" por "Filtrar por periodo" en la pestaña
- [ x] Cambiar "Selección manual" por "Selección individual" para mayor claridad
- [ x] Cambiar "Eliminar seleccionados" por "Eliminar elementos seleccionados" para mayor claridad
- [ x] Cambiar "Confirmar eliminación" por "Confirmar acción" para un lenguaje menos agresivo

## Otros Componentes

### CustomTooltip.jsx

- [ ] No se identificaron textos que necesiten mejora en este componente

### DataTransfer.jsx

- [ ] Cambiar "Importar/Exportar datos" por "Gestionar datos" para un título más conciso
- [ x] Cambiar "Exportar datos" por "Exportar" para un diseño más minimalista
- [ x] Cambiar "Importar datos" por "Importar" para un diseño más minimalista
- [ x] Cambiar "Seleccionar archivo" por "Elegir archivo" para mayor variedad léxica

---

**Instrucciones:**
1. Marca con una X entre los corchetes las mejoras que deseas implementar: [X]
2. Puedes añadir comentarios o correcciones adicionales debajo de cada sección
3. Una vez completado, envía el documento para implementar los cambios seleccionados