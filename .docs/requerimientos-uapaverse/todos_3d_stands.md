# TODOs - Módulo 3D, Ferias, Salas, Stands y Personaje

**UAPAverse** | Actualizado: 2026-09-01

---

## FASE 1 — BASE

### Autenticación y Acceso
- [ ] Integrar autenticación con el entorno 3D
- [ ] Implementar control de acceso por roles
- [ ] Mantener sesión durante navegación 3D

### RF-3D-01 — Acceso al Entorno
- [ ] Acceder al lobby
- [ ] Acceder a ferias disponibles
- [ ] Acceder a salas autorizadas
- [ ] Acceder a stands publicados
- [ ] Mantener la sesión durante la navegación

### RF-3D-02 — Lobby Virtual
- [ ] Crear lobby 3D como punto de entrada
- [ ] Identificar el entorno o feria
- [ ] Acceder a salas desde lobby
- [ ] Acceder a recorridos desde lobby
- [ ] Mecanismos de orientación en lobby
- [ ] Acceso a funcionalidades disponibles

### Navegación
- [ ] Implementar controles de movimiento básicos
- [ ] Implementar controles de cámara
- [ ] Estado global de la aplicación

---

## FASE 2 — ESTRUCTURA 3D

### RF-3D-03 — Gestión de Ferias (Admin)
- [ ] Crear ferias
- [ ] Consultar ferias
- [ ] Editar ferias
- [ ] Eliminar ferias
- [ ] Activar/desactivar ferias
- [ ] Definir nombre
- [ ] Definir descripción
- [ ] Definir fecha de inicio
- [ ] Definir fecha de finalización
- [ ] Soporte para múltiples salas por feria

### RF-3D-04 — Visualización de Ferias
- [ ] Consultar ferias disponibles
- [ ] Visualizar nombre
- [ ] Visualizar descripción
- [ ] Visualizar estado
- [ ] Visualizar fechas
- [ ] Visualizar salas disponibles

### RF-3D-05 — Gestión de Salas (Admin)
- [ ] Crear sala
- [ ] Consultar sala
- [ ] Editar sala
- [ ] Eliminar sala
- [ ] Asociar sala a una feria
- [ ] Definir nombre
- [ ] Definir temática/categoría
- [ ] Organizar stands dentro de la sala

### RF-3D-06 — Salas 3D
- [ ] Representar salas en entorno 3D
- [ ] Entrar a una sala
- [ ] Recorrer sala
- [ ] Visualizar stands
- [ ] Identificar temática
- [ ] Consultar información de la sala
- [ ] Salir de la sala
- [ ] Regresar a la feria

### RF-3D-07 — Gestión de Stands Virtuales
- [ ] Crear stand
- [ ] Consultar stand
- [ ] Editar stand
- [ ] Eliminar stand
- [ ] Publicar stand
- [ ] Deshabilitar stand
- [ ] Asociar stand a un proyecto
- [ ] Asociar stand a una sala
- [ ] Organizar espacialmente el stand

### Assets 3D
- [ ] Modelos 3D de ferias
- [ ] Modelos 3D de salas
- [ ] Modelos 3D de stands
- [ ] Posicionamiento de objetos
- [ ] Optimización de modelos
- [ ] Optimización de texturas
- [ ] Reutilización de geometrías

---

## FASE 3 — PROYECTOS

### RF-3D-08 — Proyecto → Stand
- [ ] Asociar stand a un proyecto
- [ ] Flujo: Proyecto aprobado → Stand 3D → Sala → Feria
- [ ] Información del proyecto proveniente del Backend

### RF-3D-09 — Información en el Stand
- [ ] Mostrar nombre del proyecto
- [ ] Mostrar descripción
- [ ] Mostrar categoría
- [ ] Mostrar responsable
- [ ] Mostrar integrantes
- [ ] Mostrar tecnologías
- [ ] Mostrar estado
- [ ] Mostrar información adicional

### RF-3D-10 — Multimedia
- [ ] Asociar contenido multimedia al proyecto
- [ ] Mostrar imágenes
- [ ] Reproducir videos
- [ ] Visualizar PDFs
- [ ] Visualizar modelos 3D
- [ ] Abrir/reproducir recursos disponibles

### RF-3D-11 — DEMO
- [ ] Indicar que existe una DEMO
- [ ] Permitir acceder a DEMO
- [ ] Informar cuando no exista DEMO
- [ ] Soporte de acceso controlado en Backend

### Integración Backend
- [ ] Consumir `GET /api/uapaverse/project/list`
- [ ] Consumir `GET /api/uapaverse/project/{id}`
- [ ] Consumir `UPDATE /api/uapaverse/project/{id}`
- [ ] Consumir `DELETE /api/uapaverse/project/{id}`
- [ ] Endpoints para ferias (confirmar existencia)
- [ ] Endpoints para salas (confirmar existencia)
- [ ] Endpoints para stands (confirmar existencia)

---

## FASE 4 — STANDS

### RF-3D-12 — Personalización del Stand
- [ ] Configuración visual del stand
- [ ] Configuración de elementos
- [ ] Gestión de recursos
- [ ] Distribución permitida
- [ ] Vista previa
- [ ] Guardado de configuración
- [ ] Aplicación de cambios
- [ ] Persistencia de configuración

### RF-3D-13 — Layout del Stand (Data-Driven)
- [ ] Construir representación desde configuración persistida
- [ ] Definir estructura
- [ ] Definir elementos
- [ ] Definir recursos
- [ ] Definir configuración visual
- [ ] Eliminar escenas hardcodeadas por stand

---

## FASE 5 — PERSONAJE

### RF-3D-18 — Personaje del Usuario
- [ ] Crear/importar personaje 3D
- [ ] Representar visualmente al usuario
- [ ] Disponible durante navegación 3D
- [ ] Movimientos y animaciones
- [ ] Ejecutar emotes
- [ ] Preparado para representación en multiusuario

### RF-3D-19 — Primera Persona
- [ ] Perspectiva principal desde el personaje
- [ ] Recorrer lobby, ferias, salas y stands
- [ ] Interactuar con elementos del entorno
- [ ] Navegación fluida

### RF-3D-20 — Tercera Persona
- [ ] Visualizar propio personaje
- [ ] Cámara sigue al personaje
- [ ] Personaje visible durante movimiento
- [ ] Observar movimientos y animaciones
- [ ] Cambio de cámara no reinicia navegación
- [ ] Alternar entre primera y tercera persona

### Animaciones del Personaje
- [ ] Animación idle/reposo
- [ ] Animación caminar
- [ ] Animación correr (opcional)
- [ ] Transiciones sin superposiciones
- [ ] Transiciones sin estados visuales incorrectos

---

## FASE 6 — EMOTES

### RF-3D-21 — Emotes
- [ ] Implementar emote: Saludar
- [ ] Implementar emote: Aplaudir
- [ ] Implementar emote: Celebrar
- [ ] Abrir selector de emotes
- [ ] Seleccionar emote
- [ ] Ejecutar emote
- [ ] Visualizar animación
- [ ] Volver al estado normal

### RF-3D-22 — Selector de Emotes
- [ ] Mostrar emotes disponibles
- [ ] Permitir selección
- [ ] Feedback de selección
- [ ] Soporte para agregar nuevos emotes

### RF-3D-23 — Animaciones del Personaje
- [ ] Animación saludar
- [ ] Animación aplaudir
- [ ] Animación celebrar
- [ ] Transiciones correctas

---

## FASE 7 — AVATAR IA

### RF-3D-14 — Avatar IA del Stand
- [ ] Asociar avatar a proyecto/stand
- [ ] Avatar aparece dentro del stand
- [ ] Permitir interacción con avatar
- [ ] Responder preguntas sobre el proyecto
- [ ] Utilizar información del proyecto
- [ ] Interacción por voz (opcional)

### RF-3D-15 — Knowledge Base
- [ ] Base de conocimiento por proyecto
- [ ] Almacenar temas
- [ ] Almacenar contenido
- [ ] Almacenar palabras clave
- [ ] Almacenar información técnica
- [ ] Almacenar información funcional

### RF-3D-16 — Preguntas al Avatar
- [ ] Recibir pregunta del usuario
- [ ] Procesar pregunta
- [ ] Consultar información disponible
- [ ] Generar respuesta
- [ ] Mostrar respuesta
- [ ] Registrar interacción

### RF-3D-17 — Interacción por Voz
- [ ] Entrada de voz
- [ ] Procesamiento de voz
- [ ] Generación de respuesta
- [ ] Reproducción de respuesta

### RF-3D-42 — Registro de Preguntas a Avatares
- [ ] Registrar usuario
- [ ] Registrar proyecto
- [ ] Registrar avatar
- [ ] Registrar pregunta
- [ ] Registrar fecha/hora

---

## FASE 8 — NAVEGACIÓN

### RF-3D-25 — Navegación 3D
- [ ] Moverse por el lobby
- [ ] Entrar a salas
- [ ] Recorrer salas
- [ ] Acercarse a stands
- [ ] Interactuar con stands
- [ ] Salir de stands
- [ ] Cambiar de sala
- [ ] Regresar al lobby

### RF-3D-26 — Controles
- [ ] Instrucciones de movimiento
- [ ] Instrucciones de cámara
- [ ] Instrucciones de interacción
- [ ] Acciones disponibles
- [ ] Acceso a interfaces
- [ ] Salida del entorno
- [ ] Cambio primera/tercera persona
- [ ] Uso de emotes

### RF-3D-27 — Minimapa
- [ ] Mostrar ubicación del usuario
- [ ] Mostrar salas
- [ ] Mostrar stands relevantes
- [ ] Mostrar otros usuarios (multiusuario)
- [ ] Actualización durante desplazamiento

### RF-3D-30 — Recorridos Guiados
- [ ] Iniciar recorrido
- [ ] Definir recorrido
- [ ] Mostrar siguiente punto
- [ ] Guiar al usuario
- [ ] Recorrer salas
- [ ] Recorrer stands
- [ ] Finalizar recorrido

### RF-3D-31 — Asistente de Orientación
- [ ] Informar feria actual
- [ ] Informar sala actual
- [ ] Informar ubicación
- [ ] Informar stands
- [ ] Informar recorridos
- [ ] Informar controles
- [ ] Informar acciones disponibles

### RF-3D-32 — Búsqueda de Proyectos
- [ ] Búsqueda por nombre
- [ ] Búsqueda por categoría
- [ ] Búsqueda por área temática
- [ ] Búsqueda por clasificación

### RF-3D-33 — Filtros de Proyectos
- [ ] Filtrar por categoría
- [ ] Filtrar por temática
- [ ] Filtrar por clasificación
- [ ] Combinar filtros
- [ ] Limpiar filtros
- [ ] Mostrar resultados actualizados

---

## FASE 9 — INTERACCIÓN

### RF-3D-34 — Visitas a Ferias
- [ ] Registrar feria visitada
- [ ] Registrar usuario
- [ ] Registrar fecha/hora
- [ ] Datos disponibles para métricas

### RF-3D-35 — Visitas a Stands
- [ ] Registrar stand visitado
- [ ] Registrar proyecto
- [ ] Registrar usuario
- [ ] Registrar fecha/hora

### RF-3D-36 — Interacciones
- [ ] Registrar usuario
- [ ] Registrar feria
- [ ] Registrar sala
- [ ] Registrar stand
- [ ] Registrar proyecto
- [ ] Registrar fecha/hora
- [ ] Registrar tipo de interacción
- [ ] Soporte para: entrar a stand, abrir multimedia, reproducir video, preguntar al avatar, marcar interés, solicitar contacto

### RF-3D-37 — Marcar Stand como Interesante
- [ ] Marcar stand como interesante
- [ ] Quitar interés
- [ ] Evitar registros duplicados
- [ ] Persistir relación usuario-stand

### RF-3D-38 — Historial de Intereses
- [ ] Consultar stands marcados como interesantes
- [ ] Mostrar stand
- [ ] Mostrar proyecto
- [ ] Mostrar información relevante
- [ ] Mostrar fecha

### RF-3D-39 — Solicitud de Contacto
- [ ] Solicitar contacto desde el stand
- [ ] Identificar usuario
- [ ] Identificar expositor
- [ ] Identificar proyecto
- [ ] Identificar stand
- [ ] Identificar fecha
- [ ] Identificar estado

### RF-3D-40 — Chat
- [ ] Chat general de la sala
- [ ] Chat privado
- [ ] Respetar reglas de contacto y permisos

### RF-3D-41 — Notificaciones
- [ ] Notificar solicitudes de contacto
- [ ] Notificar cambios en proyectos
- [ ] Notificar incorporación de proyectos a stands
- [ ] Notificar actividades relevantes
- [ ] Notificar eventos de participación

---

## FASE 10 — MULTIUSUARIO

### RF-3D-28 — Presencia
- [ ] Visualizar otros usuarios conectados
- [ ] Representación virtual
- [ ] Ubicación en tiempo real
- [ ] Presencia dentro de sala
- [ ] Mostrar animaciones/emotes de otros

### RF-3D-29 — Multiusuario
- [ ] Conexión simultánea de usuarios
- [ ] Presencia en tiempo real
- [ ] Actualización de posiciones
- [ ] Actualización de rotaciones
- [ ] Visualización de personajes
- [ ] Visualización de emotes
- [ ] Interacción según permisos

### RF-3D-24 — Sincronización de Emotes
- [ ] Sincronizar ejecución entre usuarios
- [ ] Mostrar animación correspondiente
- [ ] Asociarla al usuario correcto
- [ ] Evitar afectar otros personajes
- [ ] Integrar con sincronización de presencia

---

## FASE 11 — ANALYTICS

### RF-3D-43 — Métricas
- [ ] Métricas de visitas a ferias
- [ ] Métricas de visitas a stands
- [ ] Métricas de interacciones
- [ ] Métricas de consultas a avatares
- [ ] Métricas de intereses
- [ ] Métricas de solicitudes de contacto
- [ ] Métricas de actividad de proyectos
- [ ] Métricas de uso de emotes/presencia

### RF-3D-44 — Dashboard Admin
- [ ] Ferias más visitadas
- [ ] Salas con mayor actividad
- [ ] Stands más visitados
- [ ] Proyectos con mayor interacción
- [ ] Consultas a avatares / preguntas frecuentes
- [ ] Intereses / solicitudes de contacto

### RF-3D-45 — Dashboard Expositor
- [ ] Consultar visitas propias
- [ ] Consultar interacciones propias
- [ ] Consultar consultas al avatar
- [ ] Consultar intereses
- [ ] Consultar solicitudes de contacto

### RF-3D-46 — Permisos por Rol
- [ ] **ADMIN:** Gestionar ferias, salas, stands, proyectos según permisos, métricas globales
- [ ] **EXPOSITOR:** Gestionar sus proyectos/stands, personalizar stands, sus métricas, solicitudes
- [ ] **VISITANTE/INVITADO:** Recorrer ferias, entrar a salas, visitar stands, consultar proyectos, avatar, intereses, contacto, emotes

---

## FASE 12 — CALIDAD

### RF-3D-47 — Persistencia
- [ ] Persistir ferias
- [ ] Persistir salas
- [ ] Persistir stands
- [ ] Persistir proyectos
- [ ] Persistir configuración de stands
- [ ] Persistir multimedia
- [ ] Persistir avatares
- [ ] Persistir base de conocimiento
- [ ] Persistir visitas
- [ ] Persistir interacciones
- [ ] Persistir consultas IA
- [ ] Persistir intereses
- [ ] Persistir solicitudes de contacto
- [ ] Persistir mensajes
- [ ] Persistir notificaciones
- [ ] Persistir datos de presencia

### RF-3D-48 — Rendimiento
- [ ] Carga progresiva de assets
- [ ] Optimización de modelos 3D
- [ ] Optimización de texturas
- [ ] Reutilización de geometrías
- [ ] Control de cantidad de objetos
- [ ] Carga diferida de multimedia
- [ ] Evitar cargar innecesariamente todas las salas/stands
- [ ] Navegación fluida

### RF-3D-49 — Estados de UI
- [ ] Loading: feria, sala, stand, proyecto, assets
- [ ] Empty: sin proyectos, stands, multimedia, DEMO
- [ ] Error: carga, conexión, API
- [ ] AI: avatar procesando, respondiendo, error
- [ ] Media: cargando, reproduciendo, error

### Validación Final
- [ ] Eliminar mocks
- [ ] Validar APIs
- [ ] Validar permisos
- [ ] Optimizar assets
- [ ] Validar rendimiento
- [ ] Pruebas de integración
