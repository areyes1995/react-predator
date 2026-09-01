# Descripción Conceptual del Entorno 3D - UAPAverse

**Visión general:** Cómo se ve, se siente y se construye el entorno virtual.

---

## 1. Lobby Principal

**Cómo debe verse:**
Un espacio amplio, moderno y minimalista tipo centro de convenciones digital. Piso brillante con reflejos sutiles, paredes translúcidas con luz ambiental suave. En el centro, un mapa holográfico flotante que muestra las ferias disponibles. Pantallas grandes en las paredes con thumbnails de las salas. Sensación de bienvenida y orientación inmediata.

**Cómo debe sentirse:**
El usuario llega y sabe exactamente a dónde ir. Es un punto de decisión, no de confusión. Iluminación cálida, espacioso, sin objetos innecesarios que distraigan.

---

## 2. Feria

**Cómo debe verse:**
Un pasillo o nave industrial virtual, estilo expo center. Techo alto con estructura metálica visible, iluminación tipo gallery. Cada sala se representa como una puerta o portal con el nombre y temática de la sala. Señalización clara con categorías. Estilo limpio, profesional, sin exceso de decoración.

**Cómo debe sentirse:**
Es el tránsito entre el lobby y las salas. El usuario recorre un camino que le da contexto de qué hay disponible. Como caminar por una feria real antes de entrar a cada stands.

---

## 3. Sala Temática

**Cómo debe verse:**
Una habitación cerrada con temática según la categoría (Tecnología, Salud, Educación, etc.). Cada sala tiene un estilo visual diferenciado: colores, texturas, elementos decorativos. Los stands están distribuidos en el espacio (en fila, en círculo, en layout libre). Iluminación focalizada en cada stand.

**Cómo debe sentirse:**
El usuario entra y percibe que está en un lugar con identidad. Puede recorrer libremente, acercarse a los stands que le llamen la atención. Sensación de Explorar una zona temática.

---

## 4. Stand Individual

**Cómo debe verse:**
Una estructura tipo booth de feria: paredes laterales, mesón o mesa frontal, pantallas o paneles informativos. Estilo moderno con identidad visual propia del proyecto. Pantalla principal con nombre del proyecto, logo, descripción. Espacio para multimedia (video, imágenes). Zona de interacción con avatar IA (un personaje virtual en el stand). Sensación de espacio propio, identificable.

**Cómo debe sentirse:**
El usuario se acerca al stand y siente que está "ante un proyecto real". Puede ver información, abrir contenido, hablar con el avatar. Es interactivo, no decorativo.

---

## 5. Personaje del Usuario

**Cómo debe verse:**
Un avatar stylized (no realista, no cartoon extremo). Tipo low-poly con texturas limpias, moderno. Colores personalizables. Rostro con expresiones básicas. Vestimenta simple pero profesional. Debe verse bien tanto de cerca (tercera persona) como no verse (primera persona).

**Cómo debe sentirse:**
Es la representación del usuario en el mundo 3D. Debe verse bien, sentirse "suyo", pero no robar protagonismo al contenido. Animaciones suaves: caminar, reposo, emotes.

---

## 6. Emotes

**Cómo debe verse:**
Animaciones cortas y expresivas del personaje. Saludar (mano arriba), Aplaudir (manos juntas), Celebrar (brazos arriba). Transiciones suaves, sin cortes bruscos. El personaje vuelve al estado idle automáticamente.

**Cómo debe sentirse:**
Diversión y expresión social. El usuario puede saludar a otros, aplaudir un proyecto, celebrar algo. Son gestos rápidos, no animaciones largas.

---

## 7. Avatar IA del Stand

**Cómo debe verse:**
Un personaje virtual (puede ser un humanoide, robot, o personaje temático) posicionado dentro del stand. Tiene una burbuja de对话 o interfaz de chat flotante. Puede tener animaciones básicas (gestos, talking). No debe parecer un chatbot en pantalla, sino un personaje presente en el espacio.

**Cómo debe sentirse:**
Es el "expositor virtual". El usuario siente que hay alguien que puede responder preguntas. Interacción por texto o voz. Sensación de conversar con alguien que sabe del proyecto.

---

## 8. Interfaz / HUD

**Cómo debe verse:**
Elementos flotantes en pantalla, minimalistas, semi-transparentes. Minimapa en esquina inferior. Barra de controles discreta. Indicador de sala/feria actual. Botón de emotes. Indicador de multiusuario (avatars cercanos). Todo con estilo futurista-clean, sin saturar la pantalla.

**Cómo debe sentirse:**
El usuario tiene toda la información sin que le estorbe. La interfaz es utilitaria, no decorativa. Se siente como un HUD de juego moderno: sutil, funcional, always visible but not annoying.

---

## 9. Navegación y Cámaras

**Primera persona:** La cámara está donde estarían los ojos del personaje. Se ve el entorno directamente. Movimiento con WASD o flechas. Sensación de estar ahí.

**Tercera persona:** La cámara sigue al personaje desde atrás y arriba. Se ve al avatar moviéndose. Sensación de control y dirección.

**Cambio entre ambas:** Un botón o tecla (ej. V) alterna sin recargar ni reiniciar. Transición suave, no brusca.

---

## 10. Multimedia en Stands

**Cómo debe verse:**
Pantallas o paneles dentro del stand que muestran contenido. Imágenes en marcos, videos en pantallas flotantes, PDFs en lectores embebidos. Todo dentro del espacio del stand, no como popups externos.

**Cómo debe sentirse:**
El contenido está "presente" en el stand, como en una feria real donde ves pantallas y materiales. El usuario puede acercarse y abrir lo que le interese.

---

## 11. Multiusuario (Futuro)

**Cómo debe verse:**
Otros avatares visibles en la sala, moviéndose libremente. Cada uno con su identificación (nombre). Pueden ejecutar emotes visibles para todos. Sin exceso de usuarios simultáneos visibles (limitar a cercanos).

**Cómo debe sentirse:**
Sensación de comunidad y presencia. No es un mundo vacío, hay gente. Pero no es abrumador. Como una feria real con visitantes.

---

## Tecnología Recomendada

### Motor 3D: **Three.js** + **React Three Fiber**

**Por qué:**
- Rendering 3D directo en el navegador (Canvas WebGL)
- No requiere plugins ni descargas
- Integración nativa con React (el proyecto ya usa React)
- Rendimiento suficiente para este tipo de escenarios
- Comunidad activa, muchas librerías auxiliares
- Soporte para modelos GLB/GLTF (estándar de assets 3D)

### Alternativas descartadas:

| Tecnología | Por qué NO |
|------------|------------|
| Unity WebGL | Excesivo para web, bundle enorme, overkill |
| Babylon.js | Válida pero menos integración con React |
| CSS 3D | Limitado, no soporta modelos complejos |
| Canvas 2D puro | No escala, no soporta 3D real |
| A-Frame | Depende de ecosistema WebXR, más para VR |

### Stack técnico sugerido:

```
React + React Three Fiber (R3F)
  ├── @react-three/drei (helpers: cámara, controles, textos, etc.)
  ├── @react-three/postprocessing (efectos visuales)
  ├── three.js (motor 3D base)
  ├── GLTFLoader (carga de modelos .glb/.gltf)
  └── zustand / context (estado global)
```

### Formato de assets 3D:
- Modelos: `.glb` (binario, compacto)
- Texturas: `.jpg` o `.webp` (compresión)
- Animaciones: embebidas en el modelo GLB
- Optimización: Blender → exportar GLB con texturas comprimidas

### Herramientas para crear assets:
- **Blender** (gratis) → modelado, texturizado, animaciones
- **Mixamo** (gratis) → animaciones de personaje (idle, walk, emotes)
- **Kenney.nl** (gratis) → assets base si se necesita prototipar rápido

---

## Resumen Visual del Flujo

```
┌─────────────────────────────────────────────────┐
│                    LOBBY                         │
│  [Mapa holográfico] [Botón feria 1] [Feria 2]   │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                   FERIA                          │
│  [Sala Tecnología] [Sala Salud] [Sala Educ]     │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│               SALA TEMÁTICA                      │
│  [Stand A] [Stand B] [Stand C] [Stand D]        │
│         (posición libre en el espacio)           │
└─────────────────────┬───────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│                STAND INDIVIDUAL                  │
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐    │
│  │ Info    │  │ Multimedia│  │ Avatar IA   │    │
│  │ Proyecto│  │ Video/Img│  │ (chat/voz)  │    │
│  └─────────┘  └──────────┘  └─────────────┘    │
└─────────────────────────────────────────────────┘
```
