# Gestor de Problemas

## Descripción

El Gestor de Problemas es una funcionalidad completa que permite a los usuarios reportar errores, problemas de interfaz, problemas de rendimiento y otros issues que encuentren en la aplicación. Estos reportes se convierten automáticamente en tareas para su seguimiento y resolución.

## Arquitectura

### Componentes Principales

1. **`ProblemsManagementComponent`**: Página principal CRUD para gestionar todos los problemas
2. **`ProblemReportModalComponent`**: Modal para reportar nuevos problemas
3. **`ProblemReportService`**: Servicio para manejar la lógica de negocio

### Características

#### Página de Gestión (CRUD)
- **Lista de problemas**: Vista completa de todos los problemas reportados
- **Filtros avanzados**: Por tipo, prioridad, estado y búsqueda por texto
- **Estadísticas**: Contadores de total, pendientes, en proceso y resueltos
- **Detalles del problema**: Vista detallada con toda la información
- **Gestión de estados**: Cambiar estado de problemas (Pendiente → En Proceso → Resuelto)
- **Archivos adjuntos**: Visualización y descarga de archivos adjuntos

#### Modal de Reporte
- **Formulario intuitivo**: Campos organizados y validaciones en tiempo real
- **Subida de archivos**: Soporte para imágenes, PDFs, documentos y hojas de cálculo
- **Validaciones**: Campos requeridos y límites de caracteres
- **Feedback visual**: Mensajes de éxito/error y estados de carga

### Formulario de Reporte
- **Tipo de Problema**: Categorización del problema (Error, Interfaz, Rendimiento, Datos, Seguridad, Otro)
- **Título**: Descripción breve del problema (máximo 100 caracteres)
- **Descripción Detallada**: Explicación completa del problema (máximo 1000 caracteres)
- **Prioridad**: Nivel de urgencia (Baja, Media, Alta, Crítica)
- **Módulo/Sección**: Área específica de la aplicación afectada
- **Información Adicional**: Cualquier detalle adicional relevante
- **Archivos Adjuntos**: Imágenes, documentos, etc. (máximo 5 archivos, 10MB cada uno)

### Conversión Automática a Tareas
Cada problema reportado se convierte automáticamente en:
1. **Una Tarea**: Con el título `[PROBLEMA] + título del reporte`
2. **Un Ticket**: Asociado a la tarea para seguimiento
3. **Metadatos**: Información técnica y contexto del problema
4. **Archivos**: Los archivos adjuntos se incluyen en la descripción

### Mapeo de Categorías
- **Bug/Error**: Segmento Desarrollo, Categoría Errores de código
- **UI/Interfaz**: Segmento Diseño, Categoría Problemas de interfaz
- **Performance**: Segmento Infraestructura, Categoría Optimización
- **Data**: Segmento Datos, Categoría Problemas de datos
- **Security**: Segmento Seguridad, Categoría Vulnerabilidades
- **Other**: Segmento General, Categoría Otros

## Flujo de Trabajo

### Para Usuarios que Reportan
1. **Acceder al gestor** → Navegar a "Gestor de problemas" en el menú
2. **Abrir modal de reporte** → Hacer clic en "Reportar" o "Reportar Primer Problema"
3. **Llenar formulario** → Completar todos los campos requeridos
4. **Adjuntar archivos** → Subir capturas de pantalla, documentos, etc.
5. **Enviar reporte** → El sistema crea automáticamente tarea y ticket
6. **Confirmación** → Mensaje de éxito y cierre del modal

### Para Gestores/Administradores
1. **Ver lista completa** → Todos los problemas con filtros y estadísticas
2. **Revisar detalles** → Hacer clic en cualquier problema para ver información completa
3. **Cambiar estado** → Actualizar estado según el progreso
4. **Gestionar tareas** → Las tareas creadas aparecen en el sistema de tareas
5. **Seguimiento** → Monitorear resolución de problemas

## Configuración para Backend

Cuando el backend esté disponible, se necesitarán los siguientes endpoints:

### POST /api/problem-reports
```json
{
  "problemType": "bug",
  "title": "Error en formulario de login",
  "description": "El formulario no valida correctamente...",
  "priority": "high",
  "module": "auth",
  "additionalInfo": "Ocurre solo en modo incógnito",
  "attachments": [File1, File2, ...]
}
```

### GET /api/problem-reports
Retorna lista de reportes de problemas con filtros

### PATCH /api/problem-reports/{id}/status
Actualiza el estado de un reporte

### POST /api/problem-reports/{id}/attachments
Sube archivos adjuntos a un reporte existente

## Consideraciones Técnicas

### Validaciones
- Título: 10-100 caracteres
- Descripción: 20-1000 caracteres
- Archivos: Máximo 5 archivos, 10MB cada uno
- Tipos permitidos: Imágenes, PDFs, documentos, hojas de cálculo
- Campos requeridos: Tipo, Título, Descripción, Prioridad

### Seguridad
- Solo usuarios autenticados pueden reportar problemas
- Los reportes se asocian al usuario que los crea
- Validación de tipos de archivo y tamaño
- Sanitización de datos antes de almacenar

### Performance
- Formulario reactivo con validaciones en tiempo real
- Lazy loading del historial de reportes
- Almacenamiento local para reducir llamadas al servidor
- Compresión de imágenes antes de subir

### UX/UI
- Modal responsive que se adapta a diferentes pantallas
- Feedback visual inmediato para todas las acciones
- Estados de carga claros
- Filtros intuitivos y estadísticas visuales
- Vista detallada organizada y fácil de leer

## Próximos Pasos

1. **Backend**: Implementar endpoints para reportes de problemas
2. **Notificaciones**: Sistema de notificaciones para actualizaciones de estado
3. **Comentarios**: Permitir comentarios en problemas reportados
4. **Asignación**: Asignar problemas a usuarios específicos
5. **Reportes**: Generar reportes de problemas por período
6. **Integración**: Conectar con sistemas de tickets externos
7. **Automatización**: Reglas automáticas para asignación y priorización

## Archivos Modificados

- `src/app/pages/problems-management.component.ts` - Página principal CRUD
- `src/app/components/problem-report-modal/problem-report-modal.component.ts` - Modal de reporte
- `src/app/services/problem-report.service.ts` - Servicio actualizado
- `src/app/layout/layout.module.ts` - Rutas actualizadas
- `src/app/layout/components/menu.component.ts` - Menú actualizado
- `src/app/pages/problem-report.component.ts` - Eliminado (reemplazado por modal)

## Ventajas de la Nueva Arquitectura

1. **Mejor UX**: Modal más intuitivo para reportar, página completa para gestionar
2. **Funcionalidad completa**: CRUD completo con filtros y estadísticas
3. **Archivos adjuntos**: Soporte para subir imágenes y documentos
4. **Escalabilidad**: Fácil de extender con nuevas funcionalidades
5. **Mantenibilidad**: Código más organizado y modular 