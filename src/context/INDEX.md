# 📚 Índice de Documentación de Contexto

## 🎯 Propósito

Esta carpeta contiene la documentación completa del contexto del sistema de gestión de tareas y tickets. Está diseñada para ayudar a desarrolladores y modelos de IA a entender rápidamente la arquitectura, flujos y funcionamiento del sistema.

## 📋 Archivos de Documentación

### 1. [README.md](./README.md) - Documentación General
**Descripción**: Documentación principal del sistema que incluye:
- Descripción general del proyecto
- Arquitectura del sistema
- Sistema de autenticación y jerarquías
- Entidades principales (Usuario, Tarea, Ticket, Catálogos)
- Flujos de negocio
- Servicios principales
- Páginas y funcionalidades
- Configuración y despliegue
- Características especiales
- Seguridad y capacidades móviles
- Patrones de diseño
- Casos de uso por nivel de usuario

**Audiencia**: Desarrolladores, arquitectos, product managers

### 2. [ARQUITECTURA.md](./ARQUITECTURA.md) - Arquitectura Técnica
**Descripción**: Documentación técnica detallada que incluye:
- Diagramas de arquitectura general
- Flujos de autenticación (diagramas de secuencia)
- Flujos de gestión de tareas (diagramas de flujo)
- Jerarquías y permisos
- Estructura de componentes
- Patrones de servicios
- Flujo de datos en componentes
- Sistema de seguridad
- Patrones de UI/UX
- State management con RxJS
- Optimización de performance
- Workflow de desarrollo

**Audiencia**: Desarrolladores senior, arquitectos de software

### 3. [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Documentación de API
**Descripción**: Documentación completa de la API REST que incluye:
- Base URLs para desarrollo y producción
- Endpoints de autenticación
- Gestión de tareas (CRUD)
- Gestión de tickets (CRUD, estados, programación)
- Gestión de usuarios (CRUD)
- Gestión de catálogos (segmentos, categorías, subcategorías, conceptos)
- Acciones y programación
- Notificaciones
- Códigos de error y manejo
- Ejemplos de uso prácticos
- Consideraciones de seguridad

**Audiencia**: Desarrolladores frontend/backend, integradores de API

## 🎯 Cómo Usar Esta Documentación

### Para Desarrolladores Nuevos
1. **Empezar con** [README.md](./README.md) para entender el contexto general
2. **Revisar** [ARQUITECTURA.md](./ARQUITECTURA.md) para entender la estructura técnica
3. **Consultar** [API_ENDPOINTS.md](./API_ENDPOINTS.md) para implementar funcionalidades

### Para Modelos de IA
1. **Leer** [README.md](./README.md) para contexto del dominio
2. **Analizar** [ARQUITECTURA.md](./ARQUITECTURA.md) para patrones y estructura
3. **Usar** [API_ENDPOINTS.md](./API_ENDPOINTS.md) para generar código de integración

### Para Arquitectos y Tech Leads
1. **Revisar** [ARQUITECTURA.md](./ARQUITECTURA.md) para decisiones técnicas
2. **Validar** [README.md](./README.md) para alineación con requerimientos
3. **Evaluar** [API_ENDPOINTS.md](./API_ENDPOINTS.md) para diseño de API

## 🔍 Búsqueda Rápida

### Por Funcionalidad
- **Autenticación**: [README.md#sistema-de-autenticación](./README.md#-sistema-de-autenticación)
- **Gestión de Tareas**: [README.md#flujos-de-negocio](./README.md#-flujos-de-negocio)
- **Tickets**: [API_ENDPOINTS.md#gestión-de-tickets](./API_ENDPOINTS.md#-gestión-de-tickets)
- **Catálogos**: [API_ENDPOINTS.md#gestión-de-catálogos](./API_ENDPOINTS.md#-gestión-de-catálogos)
- **Usuarios**: [API_ENDPOINTS.md#gestión-de-usuarios](./API_ENDPOINTS.md#-gestión-de-usuarios)

### Por Nivel Técnico
- **Alto nivel**: [README.md](./README.md)
- **Arquitectura**: [ARQUITECTURA.md](./ARQUITECTURA.md)
- **Implementación**: [API_ENDPOINTS.md](./API_ENDPOINTS.md)

### Por Rol
- **Frontend Developer**: [README.md](./README.md) + [ARQUITECTURA.md](./ARQUITECTURA.md)
- **Backend Developer**: [API_ENDPOINTS.md](./API_ENDPOINTS.md) + [ARQUITECTURA.md](./ARQUITECTURA.md)
- **Full Stack Developer**: Todos los archivos
- **DevOps**: [README.md#configuración-y-despliegue](./README.md#-configuración-y-despliegue)

## 📊 Estructura del Sistema

```
Sistema de Gestión de Tareas y Tickets
├── Frontend (Angular 19 + Ionic 8)
│   ├── Autenticación (JWT)
│   ├── Gestión de Tareas
│   ├── Gestión de Tickets
│   ├── Catálogos
│   └── Usuarios
├── Backend API (REST)
│   ├── Auth Endpoints
│   ├── Tasks Endpoints
│   ├── Tickets Endpoints
│   ├── Users Endpoints
│   └── Catalogs Endpoints
└── Mobile (Capacitor Android)
    └── Funcionalidad nativa
```

## 🔄 Flujos Principales

### 1. Autenticación
```
Login → JWT Token → Session Storage → AuthGuard → Dashboard
```

### 2. Creación de Tarea
```
Form → Validation → API Call → Database → Response → UI Update
```

### 3. Gestión de Tickets
```
Create → Assign → Schedule → Execute → Complete → Validate
```

### 4. Jerarquías de Usuario
```
Nivel 1 (Básico) → Nivel 2 (Supervisor) → Nivel 3 (Admin)
```

## 🛠️ Tecnologías Clave

- **Frontend**: Angular 19, Ionic 8, TypeScript
- **Mobile**: Capacitor 7.2.0
- **HTTP**: CapacitorHttp
- **State**: RxJS (BehaviorSubject, ReplaySubject)
- **UI**: Syncfusion EJ2 (Grid, Kanban)
- **Auth**: JWT + SessionStorage
- **Security**: AuthGuard + Hierarchy Directive

## 📈 Métricas del Sistema

- **Páginas**: 10+ componentes principales
- **Servicios**: 9 servicios de negocio
- **Endpoints**: 20+ endpoints API
- **Entidades**: 4 entidades principales
- **Jerarquías**: 3 niveles de usuario
- **Estados**: 4 estados de ticket

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm start                    # Servidor de desarrollo
npm run build               # Build de producción
npm test                    # Ejecutar tests

# Mobile
ionic capacitor add android # Agregar plataforma Android
ionic capacitor build      # Build para móvil

# Documentación
# Los archivos en esta carpeta se actualizan manualmente
```

## 📝 Convenciones de Documentación

### Emojis Utilizados
- 📋 Descripción general
- 🏗️ Arquitectura
- 🔐 Autenticación/Seguridad
- 📊 Datos/Entidades
- 🔄 Flujos/Procesos
- 🛠️ Servicios/Herramientas
- 🎯 Páginas/Componentes
- 🔧 Configuración
- 🚀 Características
- 📱 Mobile
- 🎨 UI/UX
- 🚨 Errores/Problemas

### Estructura de Archivos
- **README.md**: Documentación general y contexto
- **ARQUITECTURA.md**: Documentación técnica y diagramas
- **API_ENDPOINTS.md**: Documentación de API y ejemplos

## 🔄 Mantenimiento

### Cuándo Actualizar
- Nuevas funcionalidades agregadas
- Cambios en la arquitectura
- Nuevos endpoints de API
- Modificaciones en flujos de negocio
- Cambios en patrones de diseño

### Responsabilidades
- **Desarrolladores**: Actualizar documentación de API
- **Arquitectos**: Actualizar documentación de arquitectura
- **Tech Leads**: Revisar y validar documentación general

---

**Última actualización**: Enero 2024
**Versión del sistema**: 1.0.0
**Mantenido por**: Equipo de desarrollo

Para sugerencias o correcciones, contactar al equipo de desarrollo. 