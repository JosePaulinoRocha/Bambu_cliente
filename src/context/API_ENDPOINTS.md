# Documentación de API Endpoints

## 🔗 Base URL
```
Development: http://localhost:3080/api
Production: https://systemabmxlifuneraria.com/tickets/api
```

## 🔐 Autenticación

### POST /auth
**Descripción**: Autenticación de usuario y obtención de token JWT

**Headers**:
```
Content-Type: application/json
Accept: application/json
```

**Body**:
```json
{
    "email": "usuario@ejemplo.com",
    "password": "password123"
}
```

**Response (200)**:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "UserID": 1,
        "Name": "Juan Pérez",
        "Email": "usuario@ejemplo.com",
        "Password": "hashed_password",
        "HierarchyID": 2,
        "PasswordChange": {
            "type": "Buffer",
            "data": [0, 0, 0, 0]
        }
    }
}
```

**Response (401)**:
```json
{
    "message": "Credenciales inválidas"
}
```

## 📋 Gestión de Tareas

### GET /tasks/Tasks
**Descripción**: Obtener todas las tareas

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Response (200)**:
```json
[
    {
        "TaskID": 1,
        "TaskName": "Mantenimiento de sistema",
        "SegmentID": 1,
        "SegmentName": "Tecnología",
        "CategoryID": 2,
        "CategoryName": "Mantenimiento",
        "SubcategoryID": 3,
        "SubcategoryName": "Sistemas",
        "ConceptID": 4,
        "ConceptName": "Backup"
    }
]
```

### POST /tasks/Tasks
**Descripción**: Crear una nueva tarea

**Body**:
```json
{
    "Name": "Nueva tarea",
    "SegmentID": 1,
    "CategoryID": 2,
    "SubcategoryID": 3,
    "ConclusionDefinition": "Descripción de la tarea",
    "TicketStartDate": "2024-01-15T10:00:00Z",
    "UserHolderID": 1,
    "UserHolderDate": "2024-01-15T10:00:00Z",
    "HierarchyID": 2,
    "Actions": ["acción1", "acción2"]
}
```

### POST /tasks/TaskTicket
**Descripción**: Crear ticket desde una tarea existente

**Body**:
```json
{
    "TaskID": 1,
    "TicketID": null
}
```

## 🎫 Gestión de Tickets

### GET /tasks/Tickets
**Descripción**: Obtener todos los tickets

**Response (200)**:
```json
[
    {
        "TicketID": 1,
        "TaskID": 1,
        "TaskName": "Mantenimiento de sistema",
        "UserHolderID": 1,
        "UserHolderName": "Juan Pérez",
        "UserExecID": 2,
        "UserExecName": "María García",
        "AssignmentStatusID": 2,
        "AssignmentStatusName": "Pendiente",
        "AuthorizationStatusID": 1,
        "AuthorizationStatusName": "Autorizado",
        "HierarchyID": 2,
        "StartDate": "2024-01-15T10:00:00Z",
        "EndDate": "2024-01-16T18:00:00Z",
        "Issue": "Problema reportado",
        "Conclusion": "Resuelto",
        "SegmentID": 1,
        "SegmentName": "Tecnología",
        "CategoryID": 2,
        "CategoryName": "Mantenimiento",
        "SubcategoryID": 3,
        "SubcategoryName": "Sistemas",
        "ConceptID": 4,
        "ConceptName": "Backup"
    }
]
```

### GET /tasks/TicketsSinAsignar
**Descripción**: Obtener tickets sin asignar

**Response (200)**:
```json
[
    {
        "TicketID": 1,
        "TaskName": "Tarea pendiente",
        "AssignmentStatusID": 1,
        "AssignmentStatusName": "Sin Asignar"
    }
]
```

### GET /TicketsSinAsignarCount
**Descripción**: Obtener conteo de tickets sin asignar

**Response (200)**:
```json
{
    "total": 5
}
```

### DELETE /tickets/{ticketId}
**Descripción**: Eliminar un ticket

**Response (200)**:
```json
{
    "message": "Ticket eliminado exitosamente"
}
```

### PUT /tickets/status/{ticketId}
**Descripción**: Actualizar estado de asignación de un ticket

**Body**:
```json
{
    "AssignmentStatusID": 2
}
```

**Estados de Asignación**:
- `1`: Sin Asignar
- `2`: Pendiente
- `3`: En Progreso
- `4`: Completado

### PUT /tickets/schedule/{ticketId}
**Descripción**: Programar fechas de un ticket

**Body**:
```json
{
    "StartDate": "2024-01-15T10:00:00Z",
    "EndDate": "2024-01-16T18:00:00Z"
}
```

### GET /tickets/Pendientes
**Descripción**: Obtener tickets pendientes

### GET /tickets/PendientesUsuario
**Descripción**: Obtener tickets pendientes del usuario actual

### POST /tickets/TicketSimple
**Descripción**: Crear ticket simple (sin tarea asociada)

**Body**:
```json
{
    "TaskName": "Ticket simple",
    "Issue": "Descripción del problema",
    "UserHolderID": 1,
    "HierarchyID": 2
}
```

### POST /tickets/file/{ticketId}
**Descripción**: Subir archivo asociado a un ticket

**Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body**: FormData con archivo

## 👥 Gestión de Usuarios

### GET /users
**Descripción**: Obtener todos los usuarios

**Response (200)**:
```json
[
    {
        "UserID": 1,
        "Name": "Juan Pérez",
        "Email": "juan@ejemplo.com",
        "Password": "hashed_password",
        "HierarchyID": 2,
        "PasswordChange": {
            "type": "Buffer",
            "data": [0, 0, 0, 0]
        }
    }
]
```

### POST /users
**Descripción**: Crear nuevo usuario

**Body**:
```json
{
    "Name": "Nuevo Usuario",
    "Email": "nuevo@ejemplo.com",
    "Password": "password123",
    "HierarchyID": 1
}
```

### PUT /users/{userId}
**Descripción**: Actualizar usuario

**Body**:
```json
{
    "Name": "Usuario Actualizado",
    "Email": "actualizado@ejemplo.com",
    "HierarchyID": 2
}
```

### DELETE /users/{userId}
**Descripción**: Eliminar usuario

## 📚 Gestión de Catálogos

### GET /segments
**Descripción**: Obtener todos los segmentos

**Response (200)**:
```json
[
    {
        "SegmentID": 1,
        "Name": "Tecnología"
    },
    {
        "SegmentID": 2,
        "Name": "Administración"
    }
]
```

### POST /segments
**Descripción**: Crear nuevo segmento

**Body**:
```json
{
    "Name": "Nuevo Segmento"
}
```

### PUT /segments/{segmentId}
**Descripción**: Actualizar segmento

**Body**:
```json
{
    "Name": "Segmento Actualizado"
}
```

### DELETE /segments/{segmentId}
**Descripción**: Eliminar segmento

### GET /categories
**Descripción**: Obtener todas las categorías

**Response (200)**:
```json
[
    {
        "CategoryID": 1,
        "Name": "Mantenimiento"
    },
    {
        "CategoryID": 2,
        "Name": "Desarrollo"
    }
]
```

### POST /categories
**Descripción**: Crear nueva categoría

### PUT /categories/{categoryId}
**Descripción**: Actualizar categoría

### DELETE /categories/{categoryId}
**Descripción**: Eliminar categoría

### GET /subcategories
**Descripción**: Obtener todas las subcategorías

**Response (200)**:
```json
[
    {
        "SubcategoryID": 1,
        "Name": "Sistemas"
    },
    {
        "SubcategoryID": 2,
        "Name": "Aplicaciones"
    }
]
```

### POST /subcategories
**Descripción**: Crear nueva subcategoría

### PUT /subcategories/{subcategoryId}
**Descripción**: Actualizar subcategoría

### DELETE /subcategories/{subcategoryId}
**Descripción**: Eliminar subcategoría

### GET /concepts
**Descripción**: Obtener todos los conceptos

**Response (200)**:
```json
[
    {
        "ConceptID": 1,
        "Name": "Backup"
    },
    {
        "ConceptID": 2,
        "Name": "Actualización"
    }
]
```

### POST /concepts
**Descripción**: Crear nuevo concepto

### PUT /concepts/{conceptId}
**Descripción**: Actualizar concepto

### DELETE /concepts/{conceptId}
**Descripción**: Eliminar concepto

## 🔧 Acciones y Programación

### GET /actions
**Descripción**: Obtener acciones disponibles

### POST /scheduled-tasks
**Descripción**: Crear tarea programada

### GET /scheduled-tasks
**Descripción**: Obtener tareas programadas

## 📊 Notificaciones

### GET /notifications
**Descripción**: Obtener notificaciones del usuario

**Response (200)**:
```json
[
    {
        "id": 1,
        "title": "Nuevo ticket asignado",
        "message": "Se te ha asignado un nuevo ticket",
        "type": "info",
        "createdAt": "2024-01-15T10:00:00Z",
        "read": false
    }
]
```

## 🚨 Códigos de Error

### 400 - Bad Request
```json
{
    "message": "Datos de entrada inválidos",
    "errors": [
        "El campo Name es requerido",
        "El campo Email debe ser válido"
    ]
}
```

### 401 - Unauthorized
```json
{
    "message": "Token de autenticación inválido o expirado"
}
```

### 403 - Forbidden
```json
{
    "message": "No tienes permisos para realizar esta acción"
}
```

### 404 - Not Found
```json
{
    "message": "Recurso no encontrado"
}
```

### 500 - Internal Server Error
```json
{
    "message": "Error interno del servidor"
}
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Crear Tarea y Ticket
```typescript
// 1. Crear tarea
const task = await this.tasksService.createTask({
    Name: "Mantenimiento preventivo",
    SegmentID: 1,
    CategoryID: 2,
    SubcategoryID: 3,
    ConclusionDefinition: "Realizar mantenimiento del sistema",
    TicketStartDate: new Date().toISOString(),
    UserHolderID: 1,
    UserHolderDate: new Date().toISOString(),
    HierarchyID: 2,
    Actions: ["Verificar logs", "Actualizar software"]
});

// 2. Crear ticket desde la tarea
const ticket = await this.tasksService.createTaskTicket({
    TaskID: task.TaskID,
    TicketID: null
});
```

### Ejemplo 2: Actualizar Estado de Ticket
```typescript
// Cambiar estado a "En Progreso"
await this.ticketsService.updateTicketStatus(ticketId, 3);

// Programar fechas
await this.ticketsService.updateTicketSchedule(
    ticketId,
    "2024-01-15T10:00:00Z",
    "2024-01-16T18:00:00Z"
);
```

### Ejemplo 3: Gestión de Catálogos
```typescript
// Obtener catálogo con cache
this.catalogService.getCatalog('segments').subscribe(segments => {
    console.log('Segmentos:', segments);
});

// Crear nueva categoría
await this.catalogService.createCatalog('categories', {
    Name: 'Nueva Categoría'
});
```

### Ejemplo 4: Manejo de Errores
```typescript
try {
    const data = await this.service.getData();
    // Procesar datos
} catch (error) {
    if (error.status === 401) {
        // Token expirado, redirigir a login
        this.authService.clearSession();
        this.router.navigate(['/login']);
    } else if (error.status === 403) {
        // Sin permisos
        this.showError('No tienes permisos para esta acción');
    } else {
        // Error genérico
        this.showError('Error: ' + error.message);
    }
}
```

## 🔒 Consideraciones de Seguridad

### Headers Requeridos
Todas las peticiones (excepto login) requieren:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
```

### Validación de Jerarquías
- Nivel 1: Operaciones básicas
- Nivel 2: Gestión de equipo
- Nivel 3: Administración completa

### Rate Limiting
- Máximo 100 requests por minuto por IP
- Máximo 1000 requests por hora por usuario

### CORS
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

**Nota**: Esta documentación de API debe mantenerse actualizada cuando se agreguen nuevos endpoints o se modifiquen los existentes. 