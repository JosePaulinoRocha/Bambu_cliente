# Sistema de Gestión de Tareas y Tickets - Documentación de Contexto

## 📋 Descripción General

Esta es una aplicación web híbrida desarrollada con **Angular 19** e **Ionic 8** para la gestión de tareas, tickets y catálogos. La aplicación está diseñada para funcionar tanto en navegadores web como en dispositivos móviles Android a través de Capacitor.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico
- **Frontend**: Angular 19 + Ionic 8
- **Mobile**: Capacitor 7.2.0 (Android)
- **UI Components**: Syncfusion EJ2 (Grid, Kanban)
- **HTTP Client**: CapacitorHttp
- **State Management**: RxJS (BehaviorSubject, ReplaySubject)
- **Authentication**: JWT Token + SessionStorage

### Estructura de Carpetas
```
src/app/
├── components/          # Componentes reutilizables
├── pages/              # Páginas principales de la aplicación
├── services/           # Servicios de negocio y API
├── types/              # Interfaces TypeScript
├── guards/             # Guards de autenticación
├── directives/         # Directivas personalizadas
├── layout/             # Componentes de layout y navegación
└── login/              # Módulo de autenticación
```

## 🔐 Sistema de Autenticación

### Flujo de Autenticación
1. **Login**: Usuario ingresa email y password
2. **Validación**: Se envía a `/auth` endpoint
3. **Token JWT**: Se recibe token de autenticación
4. **Sesión**: Se almacena en SessionStorage
5. **Guard**: AuthGuard protege rutas privadas

### Jerarquías de Usuario
- **Nivel 1**: Usuario básico
- **Nivel 2**: Supervisor
- **Nivel 3**: Administrador

### Directiva de Jerarquía
La directiva `appHierarchy` controla la visibilidad de elementos según la jerarquía del usuario:
```typescript
*appHierarchy="[1,2,3]"  // Visible para todos
*appHierarchy="[3]"      // Solo administradores
```

## 📊 Entidades Principales

### 1. Usuario (User)
```typescript
interface User {
    UserID: number;
    Name: string;
    Email: string;
    Password: string;
    HierarchyID: number;
    PasswordChange: { type: string; data: number[]; };
}
```

### 2. Tarea (Task)
```typescript
interface Task {
    TaskID: number;
    TaskName: string;
    SegmentID: number;
    SegmentName: string;
    CategoryID: number;
    CategoryName: string;
    SubcategoryID: number;
    SubcategoryName: string;
    ConceptID: number | null;
    ConceptName: string | null;
}
```

### 3. Ticket (Tickets)
```typescript
interface Tickets {
    TicketID: number;
    TaskID: number;
    TaskName: string;
    UserHolderID: number;
    UserHolderName: string;
    UserExecID: number | null;
    UserExecName: string | null;
    AssignmentStatusID: number;
    AuthorizationStatusID: number;
    HierarchyID: number;
    StartDate: string | null;
    EndDate: string | null;
    Issue: string | null;
    Conclusion: string;
    // ... más campos
}
```

### 4. Catálogos
- **Segmentos**: Categorización principal
- **Categorías**: Subdivisión de segmentos
- **Subcategorías**: Subdivisión de categorías
- **Conceptos**: Elementos específicos

## 🔄 Flujos de Negocio

### 1. Gestión de Tareas
1. **Creación**: Usuario crea tarea con segmento, categoría, subcategoría
2. **Asignación**: Se asigna a un usuario responsable
3. **Seguimiento**: Se puede crear ticket asociado
4. **Validación**: Tareas pendientes de validación (solo nivel 3)

### 2. Gestión de Tickets
1. **Creación**: Desde tarea existente o ticket simple
2. **Estados**: 
   - Sin asignar
   - Pendiente
   - En progreso
   - Completado
3. **Programación**: Fechas de inicio y fin
4. **Archivos**: Soporte para adjuntar archivos

### 3. Sistema de Catálogos
1. **CRUD**: Operaciones completas para cada nivel
2. **Cache**: Sistema de caché con RxJS
3. **Jerarquía**: Relación padre-hijo entre niveles

## 🛠️ Servicios Principales

### AuthService
- Gestión de sesión JWT
- Headers de autenticación
- Login/logout

### TasksService
- CRUD de tareas
- Creación de tickets desde tareas
- Subida de archivos

### TicketsService
- Gestión completa de tickets
- Estados y programación
- Filtros por estado

### CatalogService
- Gestión de catálogos con caché
- Operaciones CRUD
- Refresh automático

### UsersService
- Gestión de usuarios
- Operaciones CRUD
- Integración con sesión

## 🎯 Páginas Principales

### Dashboard
- Vista general del sistema
- Métricas y estadísticas

### All Tasks
- Lista completa de tareas
- Filtros y búsqueda
- Creación de nuevas tareas

### Tickets
- Gestión de tickets
- Estados y asignaciones
- Programación

### Task Valuation
- Validación de tareas (nivel 3)
- Aprobación/rechazo

### Catalogs
- Gestión de catálogos
- CRUD de segmentos, categorías, etc.

### Users
- Gestión de usuarios (nivel 3)
- CRUD de usuarios

## 🔧 Configuración y Despliegue

### Variables de Entorno
```typescript
environment = {
    production: false,
    apiUrl: 'http://localhost:3080/api',
    workingHours: {
        start: '09:00',
        end: '18:00'
    }
}
```

### Endpoints API Principales
- `/auth` - Autenticación
- `/tasks/Tasks` - Gestión de tareas
- `/tasks/Tickets` - Gestión de tickets
- `/users` - Gestión de usuarios
- `/segments`, `/categories`, etc. - Catálogos

### Comandos de Desarrollo
```bash
npm start          # Servidor de desarrollo
npm run build      # Build de producción
ionic capacitor add android  # Agregar plataforma Android
```

## 🚀 Características Especiales

### 1. Sistema de Notificaciones
- Badges en menú para elementos pendientes
- Animación "breathing" para elementos importantes

### 2. Responsive Design
- Menú colapsable
- Adaptación móvil/desktop
- Componentes Ionic nativos

### 3. Manejo de Errores
- ErrorHandlerService centralizado
- Interceptación de errores HTTP
- Mensajes de usuario amigables

### 4. Cache Inteligente
- Cache de catálogos con RxJS
- Refresh automático después de operaciones
- Optimización de rendimiento

## 🔒 Seguridad

### Autenticación
- JWT tokens
- Headers de autorización automáticos
- Protección de rutas con AuthGuard

### Autorización
- Control de acceso por jerarquías
- Directiva de visibilidad
- Validación en frontend y backend

### Almacenamiento
- SessionStorage para tokens
- Limpieza automática en logout
- No almacenamiento de datos sensibles

## 📱 Capacidades Móviles

### Capacitor Integration
- Funcionalidad nativa Android
- HTTP requests optimizados
- Gestión de archivos móvil

### UI/UX Móvil
- Componentes Ionic nativos
- Gestos táctiles
- Responsive design

## 🔄 Patrones de Diseño

### 1. Observer Pattern
- RxJS para state management
- BehaviorSubject para estado actual
- ReplaySubject para cache

### 2. Service Layer Pattern
- Separación de lógica de negocio
- Reutilización de servicios
- Inyección de dependencias

### 3. Guard Pattern
- Protección de rutas
- Validación de autenticación
- Redirección automática

### 4. Directive Pattern
- Control de visibilidad
- Lógica reutilizable
- Separación de responsabilidades

## 🎯 Casos de Uso Principales

### 1. Usuario Básico (Nivel 1)
- Ver tareas asignadas
- Crear tickets
- Actualizar estado de tickets

### 2. Supervisor (Nivel 2)
- Gestión de tareas del equipo
- Asignación de tickets
- Programación de actividades

### 3. Administrador (Nivel 3)
- Gestión completa de usuarios
- Validación de tareas
- Administración de catálogos
- Reportes y métricas

## 🔧 Consideraciones de Desarrollo

### 1. Performance
- Lazy loading de módulos
- Cache de catálogos
- Optimización de requests HTTP

### 2. Mantenibilidad
- Separación clara de responsabilidades
- Interfaces TypeScript bien definidas
- Servicios modulares

### 3. Escalabilidad
- Arquitectura modular
- Patrones reutilizables
- Configuración flexible

### 4. Testing
- Estructura preparada para testing
- Separación de lógica de negocio
- Componentes testables

---

**Nota**: Esta documentación debe mantenerse actualizada conforme evolucione el sistema. Para preguntas específicas sobre implementación, consultar los comentarios en el código fuente. 