# Requerimientos Funcionales - Módulo 3D, Ferias, Salas, Stands y Personaje

**UAPAverse**

---

## Objetivo del Módulo 3D

UAPAverse debe proporcionar un entorno virtual 3D donde los usuarios puedan recorrer ferias, ingresar a salas temáticas, visitar stands y consultar/interactuar con los proyectos exhibidos.

---

## Requerimientos Funcionales

### RF-3D-01 — Acceso al Entorno
- Acceder al lobby
- Acceder a ferias disponibles
- Acceder a salas autorizadas
- Acceder a stands publicados
- Mantener la sesión durante la navegación
- Protegido por autenticación y autorización

### RF-3D-02 — Lobby Virtual
- Identificar el entorno o feria
- Acceder a salas
- Acceder a recorridos
- Utilizar mecanismos de orientación
- Acceder a funcionalidades disponibles para el usuario

### RF-3D-03 — Gestión de Ferias (Admin)
- Crear, consultar, editar, eliminar ferias
- Activar/desactivar ferias
- Definir: nombre, descripción, fecha inicio, fecha finalización
- Una feria podrá contener múltiples salas

### RF-3D-04 — Visualización de Ferias
- Consultar ferias disponibles
- Visualizar: nombre, descripción, estado, fechas, salas disponibles

### RF-3D-05 — Gestión de Salas (Admin)
- Crear, consultar, editar, eliminar salas
- Asociar sala a una feria
- Definir: nombre, temática/categoría
- Organizar los stands dentro de la sala

### RF-3D-06 — Salas 3D
- Entrar a una sala
- Recorrerla
- Visualizar los stands
- Identificar su temática
- Consultar información de la sala
- Salir de la sala / regresar a la feria

### RF-3D-07 — Gestión de Stands Virtuales
- Crear, consultar, editar, eliminar stands
- Publicar / deshabilitar stand
- Asociar stand a un proyecto
- Asociar stand a una sala
- Organizar espacialmente el stand dentro de la sala

### RF-3D-08 — Proyecto → Stand
- Un stand deberá estar asociado a un proyecto
- Flujo: Proyecto aprobado → Stand 3D → Sala → Feria
- Información del proyecto proveniente del Backend

### RF-3D-09 — Información en el Stand
- Nombre, descripción, categoría
- Responsable, integrantes
- Tecnologías, estado
- Información adicional

### RF-3D-10 — Multimedia
- Asociar contenido multimedia al proyecto
- Tipos: imagen, video, PDF, DEMO, modelo 3D
- Abrir o reproducir recursos disponibles

### RF-3D-11 — DEMO
- Indicar que existe una DEMO
- Permitir acceder a ella
- Informar cuando no exista
- Soporte de acceso controlado en Backend

### RF-3D-12 — Personalización del Stand
- Configuración visual
- Configuración de elementos
- Recursos, distribución permitida
- Vista previa, guardado, aplicación de cambios
- Persistencia de configuración

### RF-3D-13 — Layout del Stand (Data-Driven)
- Representación del stand construida a partir de configuración persistida
- Estructura, elementos, recursos, configuración visual
- Sin escena independiente hardcodeada para cada stand

### RF-3D-14 — Avatar IA del Stand
- Asociar avatar inteligente a proyecto/stand
- Aparecer dentro del stand
- Permitir interacción
- Responder preguntas sobre el proyecto
- Utilizar información asociada al proyecto
- Interacción por voz cuando esté habilitada

### RF-3D-15 — Knowledge Base
- Base de conocimiento por proyecto
- Contener: temas, contenido, palabras clave, información técnica/funcional

### RF-3D-16 — Preguntas al Avatar
1. Recibir pregunta
2. Procesar pregunta
3. Consultar información disponible
4. Generar respuesta
5. Mostrar/reproducir respuesta
6. Registrar interacción

### RF-3D-17 — Interacción por Voz
- Entrada de voz
- Procesamiento
- Generación de respuesta
- Reproducción de respuesta

### RF-3D-18 — Personaje del Usuario
- Representar visualmente al usuario
- Disponible durante la navegación 3D
- Utilizado como representación en multiusuario
- Movimientos y animaciones
- Ejecutar emotes

### RF-3D-19 — Primera Persona
- Observar el entorno desde perspectiva del personaje
- Recorrer lobby, ferias, salas y stands
- Interactuar con elementos del entorno
- Navegación fluida

### RF-3D-20 — Tercera Persona
- Visualizar propio personaje
- Cámara sigue al personaje
- Personaje visible durante movimiento
- Observar movimientos y animaciones
- Cambio de cámara no reinicia navegación
- Alternar entre primera y tercera persona

### RF-3D-21 — Emotes
- Mínimo 3 emotes: Saludar, Aplaudir, Celebrar
- Abrir selector de emotes
- Seleccionar y ejecutar emote
- Visualizar animación
- Volver al estado normal

### RF-3D-22 — Selector de Emotes
- Mostrar emotes disponibles
- Permitir seleccionar un emote
- Ejecutar el emote
- Mostrar feedback de selección
- Incorporar nuevos emotes posteriormente

### RF-3D-23 — Animaciones del Personaje
- Idle/reposo
- Caminar
- Correr (si está habilitado)
- Saludar, Aplaudir, Celebrar
- Transiciones sin superposiciones ni estados incorrectos

### RF-3D-24 — Sincronización de Emotes (Multiusuario)
- Sincronizar ejecución entre usuarios
- Mostrar animación correspondiente
- Asociarla al usuario correcto
- Evitar afectar otros personajes
- Parte de la sincronización de presencia

### RF-3D-25 — Navegación 3D
- Moverse por el lobby
- Entrar/recorrer salas
- Acercarse e interactuar con stands
- Salir de stands
- Cambiar de sala
- Regresar al lobby

### RF-3D-26 — Controles
- Movimiento, cámara, interacción
- Acciones disponibles
- Acceso a interfaces
- Salida del entorno
- Cambio de primera a tercera persona
- Uso de emotes

### RF-3D-27 — Minimapa
- Ubicación del usuario
- Salas, stands relevantes
- Otros usuarios (multiusuario)
- Actualización durante desplazamiento

### RF-3D-28 — Presencia
- Visualizar otros usuarios conectados
- Representación virtual, ubicación
- Presencia dentro de sala
- Animaciones/emotes

### RF-3D-29 — Multiusuario
- Conexión simultánea
- Presencia, actualización de posiciones/rotaciones
- Visualización de personajes y emotes
- Interacción según permisos

### RF-3D-30 — Recorridos Guiados
- Iniciar/definir recorrido
- Mostrar siguiente punto
- Guiar al usuario por salas y stands
- Finalizar recorrido

### RF-3D-31 — Asistente de Orientación
- Informar: feria actual, sala actual, ubicación
- Stands, recorridos, controles, acciones disponibles

### RF-3D-32 — Búsqueda de Proyectos
- Criterios: nombre, categoría, área temática, clasificación

### RF-3D-33 — Filtros de Proyectos
- Filtrar por categoría, temática, clasificación
- Combinar/limpiar filtros
- Mostrar resultados actualizados

### RF-3D-34 — Visitas a Ferias
- Registrar: feria, usuario, fecha, hora
- Datos para métricas

### RF-3D-35 — Visitas a Stands
- Registrar: stand, proyecto, usuario, fecha, hora

### RF-3D-36 — Interacciones
- Registrar: usuario, feria, sala, stand, proyecto, fecha, hora, tipo
- Ejemplos: entrar a stand, abrir multimedia, reproducir video, preguntar al avatar, marcar interés, solicitar contacto

### RF-3D-37 — Marcar Stand como Interesante
- Marcar/quitar interés
- Evitar registros duplicados
- Persistir relación usuario-stand

### RF-3D-38 — Historial de Intereses
- Consultar stands marcados como interesantes
- Mostrar: stand, proyecto, información relevante, fecha

### RF-3D-39 — Solicitud de Contacto
- Solicitar contacto desde el stand
- Identificar: usuario, expositor, proyecto, stand, fecha, estado

### RF-3D-40 — Chat
- Chat general de la sala (asociado a sala)
- Chat privado (respetando reglas de contacto y permisos)

### RF-3D-41 — Notificaciones
- Solicitudes de contacto
- Cambios en proyectos
- Incorporación de proyectos a stands
- Actividades relevantes
- Eventos de participación

### RF-3D-42 — Registro de Preguntas a Avatares
- Registrar: usuario, proyecto, avatar, pregunta, fecha, hora
- Datos para preguntas frecuentes

### RF-3D-43 — Métricas
- Visitas a ferias/stands
- Interacciones
- Consultas a avatares
- Intereses
- Solicitudes de contacto
- Actividad de proyectos
- Uso de emotes/presencia

### RF-3D-44 — Dashboard Admin
- Ferias más visitadas
- Salas con mayor actividad
- Stands más visitados
- Proyectos con mayor interacción
- Consultas a avatares / preguntas frecuentes
- Intereses / solicitudes de contacto

### RF-3D-45 — Dashboard Expositor
- Visitas, interacciones, consultas al avatar
- Intereses, solicitudes de contacto

### RF-3D-46 — Permisos por Rol

**ADMIN:**
- Gestionar ferias, salas, stands
- Gestionar proyectos según permisos
- Consultar métricas globales

**EXPOSITOR:**
- Gestionar sus proyectos/stands
- Personalizar sus stands
- Consultar sus métricas
- Gestionar solicitudes

**VISITANTE/INVITADO:**
- Recorrer ferias
- Entrar a salas
- Visitar stands
- Consultar proyectos
- Interactuar con avatares
- Marcar intereses / solicitar contacto
- Utilizar emotes

### RF-3D-47 — Persistencia
- Ferias, salas, stands, proyectos
- Configuración de stands
- Multimedia, avatares, base de conocimiento
- Visitas, interacciones, consultas IA
- Intereses, solicitudes de contacto
- Mensajes, notificaciones
- Datos de presencia (multiusuario)

### RF-3D-48 — Rendimiento
- Carga progresiva de assets
- Optimización de modelos 3D y texturas
- Reutilización de geometrías
- Control de cantidad de objetos
- Carga diferida de multimedia
- Evitar cargar innecesariamente todas las salas/stands
- Navegación fluida

### RF-3D-49 — Estados de UI
- **Loading:** feria, sala, stand, proyecto, assets
- **Empty:** sin proyectos, stands, multimedia, DEMO
- **Error:** carga, conexión, API
- **AI:** avatar procesando, respondiendo, error
- **Media:** cargando, reproduciendo, error

---

## Criterios de Aceptación

1. Usuario autenticado accede al entorno según su rol
2. Puede entrar al lobby
3. Puede acceder a una feria
4. Puede entrar a las salas
5. Las salas muestran los stands correspondientes
6. Cada stand está asociado a un proyecto
7. La información del stand proviene del Backend
8. El proyecto puede mostrar información y multimedia
9. La DEMO puede abrirse cuando está disponible
10. El stand puede tener configuración visual persistente
11. El avatar puede asociarse al proyecto y responder sobre él
12. Las preguntas al avatar pueden registrarse
13. El usuario puede desplazarse por el entorno
14. La primera persona funciona como perspectiva principal
15. El usuario puede cambiar a tercera persona y visualizar su personaje
16. El personaje puede ejecutar animaciones de locomoción
17. Existe un selector de emotes con mínimo 3 emotes funcionales
18. Cada emote reproduce una animación real del personaje
19. Al terminar un emote, el personaje vuelve al estado normal
20. Los emotes no rompen la navegación ni la cámara
21. En modo multiusuario, otros usuarios visualizan los emotes
22. El minimapa muestra la ubicación del usuario
23. Los recorridos guiados pueden ejecutarse
24. El asistente proporciona orientación
25. Los proyectos pueden buscarse y filtrarse
26. Las visitas a ferias/stands quedan registradas
27. Las interacciones quedan registradas
28. Los intereses quedan persistidos
29. Las solicitudes de contacto quedan persistidas
30. Los mensajes quedan persistidos
31. Las notificaciones se generan correctamente
32. Las métricas pueden alimentarse desde las interacciones del 3D
33. El administrador puede consultar métricas globales
34. El expositor solo puede consultar métricas de sus proyectos
35. Las funcionalidades respetan los permisos del usuario
36. El entorno maneja estados loading, empty y error
37. El entorno no depende de mocks para los procesos principales

---

## Fases de Implementación

| Fase | Nombre | Componentes |
|------|--------|-------------|
| 1 | Base | Autenticación, Roles, Lobby, Navegación, Estado global |
| 2 | Estructura 3D | Ferias, Salas, Stands, Posicionamiento, Assets |
| 3 | Proyectos | Carga de proyectos, Asociación proyecto/stand, Información, Multimedia, DEMO |
| 4 | Stands | Personalización, layoutConfig, Vista previa, Persistencia |
| 5 | Personaje | Crear/importar personaje, Rig/skeleton, Idle, Caminar, Cámaras |
| 6 | Emotes | Sistema de animaciones, Saludar, Aplaudir, Celebrar, Selector |
| 7 | Avatar IA | Avatar por proyecto, Knowledge Base, Chat, Voz, Registro |
| 8 | Navegación | Controles, HUD, Minimapa, Búsqueda, Filtros, Recorridos |
| 9 | Interacción | Visitas, Interacciones, Intereses, Contactos, Mensajería, Notificaciones |
| 10 | Multiusuario | Presencia, Usuarios conectados, Sincronización de personajes/emotes |
| 11 | Analytics | Métricas, Dashboard Admin, Dashboard Expositor, Reportes |
| 12 | Calidad | Eliminar mocks, Validar APIs, Optimizar assets, Pruebas de integración |

---

## Modelo de Datos Conceptual

```
Fair → Room → Stand → Project
                          ├── ProjectMember
                          ├── ProjectMedia
                          ├── KnowledgeBase
                          ├── AiAnalysis
                          └── ContactLead

SystemUser
  ├── ChatMessage
  ├── Notification
  ├── AuthLog
  └── visitas/interacciones

Usuario → Personaje 3D
            ├── Cámara (Primera/Tercera persona)
            ├── Animaciones (Idle, Caminar, Emotes)
            └── Presencia
```

---

## API / Backend

**Endpoints conocidos para proyectos:**
- `GET /api/uapaverse/project/list`
- `GET/UPDATE/DELETE /api/uapaverse/project/{id}`

**Servicios requeridos (pendientes de confirmar):**
- Ferias, Salas, Stands, Configuración de stands
- Multimedia, Avatares, Base de conocimiento
- Visitas, Interacciones, Intereses, Contactos
- Mensajería, Notificaciones, Métricas
- Presencia/multiusuario, Sincronización de personajes y emotes
