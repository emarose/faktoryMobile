# Guía de Pruebas Manuales - Faktory Mobile

## Descripción General del Juego

Faktory Mobile es un juego de automatización y construcción donde el jugador explora un mundo cuadriculado para descubrir nodos de recursos, extraer materiales y construir máquinas para automatizar la producción. El objetivo principal es progresionar a través de hitos (milestones) desbloqueando nuevas tecnologías y máquinas más avanzadas.

## Mecánicas Principales

- **Exploración**: Movimiento libre en un mapa cuadriculado para descubrir recursos
- **Extracción Manual**: Al inicio, el jugador puede extraer recursos manualmente de los nodos
- **Automatización**: Construcción de máquinas que extraen y procesan recursos automáticamente
- **Progresión**: Sistema de hitos que desbloquean nuevas tecnologías y máquinas
- **Gestión de Recursos**: Los nodos tienen capacidad finita y se agotan con el tiempo
- **Guardado Automático**: El juego guarda progreso automáticamente cada 30 segundos

## Navegación Principal

El juego utiliza un **navegador de pestañas inferior** con 5 secciones principales:
- **Factory** (centro): Pantalla principal del juego
- **Machines** (derecha): Acceso directo a máquinas desplegadas
- **Options** (derecha): Configuraciones y opciones del juego
- **Builder** (izquierda): Acceso directo al constructor de máquinas
- **Map** (izquierda): Acceso directo al mapa del mundo.

---

## Pantallas del Juego

### 1. Factory Screen (Pantalla de Fábrica) - PANTALLA PRINCIPAL

**Funcionalidad:**
- Pantalla central del juego, accesible desde la pestaña inferior
- Dashboard principal que muestra resumen del estado del juego
- Centro de navegación hacia todas las demás secciones
- Muestra información consolidada de progreso, recursos y máquinas

**Elementos Visuales:**
- Header con título "Factory" e icono de fábrica
- **Resource Overview Header**: Resumen de recursos básicos en la parte superior
- **Milestone Card**: Tarjeta grande con información del hito actual y progreso
- **Botones de navegación principal**:
  - **World Map**: Acceso al mapa de exploración (con imagen representativa)
  - **Machine Builder**: Acceso a construcción de máquinas (con imagen representativa)
- **Deployed Machines Card**: Resumen de máquinas colocadas en el mundo
- **Fila inferior con dos botones**:
  - **Inventory**: Acceso al inventario de productos
  - **Crafting guide**: Acceso al árbol de producción
- Fondo con imagen industrial y gradiente atmosférico

**Pruebas Sugeridas:**
- Verificar que el Resource Overview Header muestre correctamente los recursos básicos
- Confirmar que la Milestone Card refleje el hito actual y su progreso preciso
- Validar navegación a Map Screen desde el botón "World Map"
- Probar navegación a Build Screen desde el botón "Machine Builder"
- Verificar que la Deployed Machines Card muestre información precisa de máquinas
- Probar navegación a Inventory Screen e ProductAssembly Screen desde la fila inferior
- Confirmar que el scroll funcione correctamente con todo el contenido

---

### 2. Map Screen (Pantalla de Mapa)

**Funcionalidad:**
- Permite al jugador explorar el mundo cuadriculado
- Descubrimiento de nodos de recursos (hierro, cobre, carbón, etc.)
- Extracción manual de recursos tocando los nodos
- Colocación de máquinas en nodos específicos
- Control de movimiento del jugador en el mapa

**Elementos Visuales:**
- Grilla del mapa con tiles visibles
- Nodos de recursos con colores distintivos según el tipo de material
- Controles de movimiento (flechas direccionales)
- Radio de descubrimiento alrededor del jugador
- Indicadores visuales de máquinas colocadas
- Notificaciones toast cuando se descubren nuevos nodos

**Pruebas Sugeridas:**
- Probar movimiento del jugador en todas las direcciones
- Verificar que se descubran nodos al acercarse a ellos
- Confirmar que la extracción manual funcione tocando nodos
- Validar que aparezcan notificaciones al descubrir nuevos recursos
- Probar la colocación de máquinas en nodos válidos
- Verificar que los nodos se agoten gradualmente con el uso

---

### 3. Inventory Screen (Pantalla de Inventario)

**Funcionalidad:**
- Muestra todos los productos intermedios y finales que el jugador ha fabricado
- Visualización de cantidades disponibles de cada item
- Organización de items por tipo y nombre

**Elementos Visuales:**
- Grid de items con imágenes representativas
- Contador de cantidad para cada item
- Nombres de los productos
- Scroll vertical para navegar por todos los items
- Diseño de tarjetas para cada item del inventario

**Pruebas Sugeridas:**
- Verificar que solo aparezcan items con cantidad mayor a 0
- Confirmar que las cantidades mostradas sean precisas
- Probar el scroll cuando hay muchos items
- Validar que los items se ordenen alfabéticamente
- Verificar que las imágenes de los items se carguen correctamente

---

### 4. Build Screen (Pantalla de Construcción)

**Funcionalidad:**
- Permite construir nuevas máquinas utilizando recursos del inventario
- Muestra máquinas disponibles según el progreso del jugador
- Verificación de recursos necesarios antes de construir
- Actualización del inventario de máquinas después de la construcción

**Elementos Visuales:**
- Lista de máquinas construibles con imágenes
- Indicadores de recursos requeridos para cada máquina
- Estado visual (disponible/no disponible) según recursos
- Botones de construcción para cada máquina
- Resumen estadístico de máquinas poseídas

**Pruebas Sugeridas:**
- Verificar que solo aparezcan máquinas desbloqueadas
- Confirmar que los requisitos de recursos sean precisos
- Probar construcción cuando se tienen recursos suficientes
- Validar que se bloquee la construcción sin recursos necesarios
- Verificar actualización del inventario después de construir

---

### 5. Basic Resources Screen (Pantalla de Recursos Básicos)

**Acceso:** Desde Factory Screen → Resource Overview Header (tocar la sección de recursos)

**Funcionalidad:**
- Análisis estadístico detallado de recursos básicos (hierro, cobre, carbón, petróleo, etc.)
- Visualización de datos mediante múltiples tipos de gráficos
- Seguimiento de nodos descubiertos y máquinas mineras por tipo de recurso
- Métricas de inventario actual y producción

**Elementos Visuales:**
- Header con título "Basic Resources" e icono de gráfico
- **Tres gráficos de barras principales**:
  - **Resource Inventory**: Cantidades actuales en inventario por recurso
  - **Active Miners**: Número de máquinas mineras activas por tipo de recurso
  - **Discovered Nodes**: Cantidad de nodos descubiertos por tipo de recurso
- Cada gráfico tiene título descriptivo con iconos (pila de recursos, pico, marcadores de mapa)
- Labels abreviados en los ejes para mejor visualización
- Colores distintivos y consistentes para cada tipo de recurso
- Scroll vertical para navegar entre los diferentes gráficos

**Pruebas Sugeridas:**
- Verificar que los gráficos de inventario reflejen las cantidades reales de recursos
- Confirmar que el contador de "Active Miners" coincida con las máquinas realmente colocadas
- Validar que "Discovered Nodes" muestre solo nodos efectivamente descubiertos
- Probar que los datos se actualicen en tiempo real al minar o colocar máquinas
- Verificar que los labels de recursos se muestren correctamente abreviados
- Confirmar que el scroll funcione suavemente entre los diferentes gráficos

---

### 6. Milestones Screen (Pantalla de Hitos)

**Funcionalidad:**
- Muestra la progresión del jugador a través de objetivos específicos
- Visualización de requisitos para cada hito
- Indicación de hitos completados y próximos objetivos
- Desbloqueo de nuevas máquinas y tecnologías

**Elementos Visuales:**
- Lista de hitos con estado visual (completado/pendiente/bloqueado)
- Descripción detallada de cada objetivo
- Requisitos específicos con contadores de progreso
- Indicadores de recompensas desbloqueadas
- Expansión/colapso de detalles de hitos

**Pruebas Sugeridas:**
- Verificar que el progreso de hitos se actualice correctamente
- Confirmar que los requisitos mostrados sean precisos
- Probar el desbloqueo automático al cumplir objetivos
- Validar que las recompensas se otorguen correctamente
- Verificar navegación entre hitos completados y pendientes

---

### 7. Deployed Machines Screen (Pantalla de Máquinas Desplegadas)

**Funcionalidad:**
- Vista general de todas las máquinas colocadas en el mundo
- Agrupación por tipo de máquina (mineras, fundidoras, constructores, etc.)
- Estado operacional de cada máquina
- Navegación directa a pantallas específicas de máquinas

**Elementos Visuales:**
- Grupos expandibles por tipo de máquina
- Tarjetas individuales para cada máquina desplegada
- Indicadores de estado operacional
- Información de ubicación y producción
- Botones de navegación a pantallas detalladas

**Pruebas Sugeridas:**
- Verificar que aparezcan todas las máquinas colocadas
- Confirmar que la agrupación por tipo funcione correctamente
- Probar expansión/colapso de grupos de máquinas
- Validar que el estado operacional sea preciso
- Verificar navegación a pantallas específicas de máquinas

---

### 8. Pantallas de Máquinas Específicas

**IMPORTANTE**: Estas pantallas se acceden desde Deployed Machines Screen o directamente desde el mapa cuando se toca una máquina colocada.

#### 8.1 Smelter Screen (Fundidora)
**Funcionalidad:**
- Procesamiento de minerales básicos en lingotes (hierro, cobre)
- Sistema de recetas con ingredientes normalizados
- Control de cantidad mediante steppers
- Gestión de cola de producción
- Visualización en tiempo real del progreso

**Elementos Visuales:**
- Header personalizado con nombre de la máquina específica
- Lista scrolleable de recetas disponibles
- **Para cada receta**:
  - Imagen del producto resultante
  - Lista de ingredientes requeridos con cantidades
  - QuantityStepper para controlar cantidad a producir
  - CraftButton para iniciar producción
  - Indicador de disponibilidad según recursos en inventario
- **Cola de producción activa**:
  - Trabajos en progreso con barras de progreso
  - Tiempo restante estimado
  - Opción de cancelar trabajos pendientes
- MiniToast para notificaciones de estado

#### 8.2 Constructor Screen (Constructor)
**Funcionalidad:**
- Fabricación de componentes básicos (varillas de hierro, placas, tornillos)
- Misma interfaz base que Smelter pero con recetas de construcción
- Procesamiento de lingotes en componentes utilizables

#### 8.3 Assembler Screen (Ensamblador)
**Funcionalidad:**
- Combinación de múltiples componentes en productos complejos
- Recetas que requieren 2 o más tipos de ingredientes
- Producción de items de nivel intermedio (placas reforzadas, rotores)

#### 8.4 Foundry Screen (Fundición Avanzada)
**Funcionalidad:**
- Procesamiento avanzado con recetas de aleaciones
- Combinación de diferentes tipos de lingotes
- Producción de materiales de construcción especializados

#### 8.5 Refinery Screen (Refinería)
**Funcionalidad:**
- Procesamiento exclusivo de petróleo crudo
- Producción de combustibles, plásticos y gomas
- Recetas que utilizan recursos líquidos como base

#### 8.6 Manufacturer Screen (Fabricante)
**Funcionalidad:**
- Nivel más alto de producción
- Recetas complejas que combinan productos intermedios
- Fabricación de componentes avanzados para tecnologías superiores

#### 8.7 Extractor Screen (Extractor de Petróleo)
**Funcionalidad:**
- Extracción pasiva de petróleo crudo
- No tiene sistema de recetas (solo extracción)
- Interfaz simplificada para monitoreo de producción

**Pruebas Generales para Pantallas de Máquinas:**
- Verificar que las recetas mostradas correspondan al tipo de máquina y progreso del juego
- Probar QuantityStepper: incrementar/decrementar cantidades correctamente
- Confirmar que CraftButton se deshabilite cuando falten recursos
- Validar que los recursos se consuman inmediatamente al iniciar producción
- Verificar que los trabajos aparezcan en la cola de producción con progreso visual
- Probar cancelación de trabajos y que se devuelvan los recursos
- Confirmar que los productos terminados se agreguen al inventario
- Verificar que las barras de progreso se actualicen en tiempo real
- Probar navegación de regreso a la pantalla anterior

---

### 9. Node Selector Screen (Selector de Nodos)

**Funcionalidad:**
- Se accede al intentar colocar una máquina que requiere asignación a un nodo
- Filtrado inteligente de nodos compatibles según el tipo de máquina
- **Comportamiento especial para Extractor**: Muestra automáticamente solo nodos de petróleo crudo
- Agrupación de nodos por tipo de recurso
- Sistema de filtros por tipo de recurso
- Validación de nodos disponibles (descubiertos y con recursos)

**Elementos Visuales:**
- Header con título "Node Selector" personalizado según la máquina
- **Filtros por tipo de recurso**:
  - Botones de filtro organizados por tipo (Hierro, Cobre, Carbón, etc.)
  - Auto-selección de filtro para Extractors (solo petróleo crudo)
- **Lista de nodos disponibles**:
  - Nodos agrupados por tipo de recurso
  - Información de posición (coordenadas X, Y)
  - Indicador de distancia desde la posición del jugador
  - Estado visual de capacidad restante
  - Colores distintivos según el tipo de recurso
- Scroll vertical para navegar por todos los nodos disponibles
- Información contextual sobre compatibilidad máquina-nodo

**Pruebas Sugeridas:**
- Verificar que solo aparezcan nodos del tipo correcto para cada máquina
- Probar comportamiento especial con Extractor (solo nodos de petróleo)
- Confirmar que solo se muestren nodos descubiertos y con recursos disponibles
- Validar que nodos ya ocupados por otras máquinas no aparezcan
- Probar filtros por tipo de recurso y que funcionen correctamente
- Verificar información de posición y distancia
- Confirmar selección exitosa y actualización de la máquina asignada
- Probar cancelación y regreso a la pantalla anterior

---

### 10. Product Assembly Screen (Crafting guide)

**Funcionalidad:**
- Accesible desde la Factory Screen mediante el botón "Crafting guide"
- Visualización del árbol de progresión y recetas de fabricación
- Sistema de búsqueda para localizar productos específicos
- Vista jerárquica de todas las cadenas de producción disponibles

**Elementos Visuales:**
- Header con título "Crafting guide" e icono de lupa
- Botón de búsqueda que activa/desactiva la funcionalidad de filtrado
- **Componente ProgressionTree**: Árbol interactivo que muestra:
  - Relaciones entre materias primas y productos finales
  - Recetas de fabricación organizadas por niveles
  - Dependencias entre diferentes tipos de productos
  - Estado de desbloqueadas/bloqueadas según el progreso del jugador
- Interfaz de búsqueda cuando está activada

**Pruebas Sugeridas:**
- Probar el toggle del botón de búsqueda y verificar que aparezca/desaparezca la interfaz
- Verificar que el árbol de progresión muestre todas las recetas disponibles
- Confirmar que las recetas bloqueadas se muestren visualmente diferentes
- Probar la funcionalidad de búsqueda si está implementada
- Verificar navegación y zoom del árbol de progresión
- Validar que las conexiones entre productos sean precisas y fáciles de seguir

---

### 11. Options Screen (Pantalla de Opciones)

**Funcionalidad:**
- Accesible desde la pestaña "Options" en el navegador inferior
- Configuración completa de audio y música del juego
- Gestión de datos de guardado y reinicio de partida
- Configuración de interfaz de usuario
- Información sobre la versión del juego

**Elementos Visuales:**
- Header con título "Options" e icono de fábrica
- **Sección Music**:
  - Toggle para silenciar/activar música con iconos de volumen
  - Lista de pistas musicales disponibles para seleccionar
  - Indicador visual de la pista actualmente seleccionada
  - Controles de pausa/reproducción de música
- **Sección Game Save**:
  - Componente de guardado manual con timestamp del último guardado
- **Sección Game Data**:
  - Botón "New Game" con modal de confirmación
  - Advertencia sobre pérdida de progreso al resetear
- **Sección UI Settings**:
  - Selector de fuentes para la interfaz
- **Sección About**:
  - Información de versión "Faktory Mobile v1.0.0"
  - Descripción del juego
- Cada sección tiene tarjetas con fondo semi-transparente

**Pruebas Sugeridas:**
- Probar toggle de música (silenciar/activar) y verificar que se aplique inmediatamente
- Verificar selección de diferentes pistas musicales y que cambien correctamente
- Probar el guardado manual y confirmar que se actualice el timestamp
- Probar la funcionalidad "New Game" y el modal de confirmación
- Verificar que al confirmar "Reset Game" se eliminen todos los datos
- Probar el selector de fuentes y que los cambios se reflejen en la UI
- Validar que la información de versión sea precisa
- Confirmar que todas las configuraciones persistan al reiniciar la app

---

## Flujos de Prueba Recomendados

### Flujo de Nuevo Jugador
1. Ir a Options Screen → Game Data → "New Game" para reiniciar (si es necesario)
2. Desde Factory Screen, navegar a "World Map" para explorar
3. Usar controles de movimiento para explorar y descubrir primeros nodos
4. Realizar extracción manual tocando nodos descubiertos
5. Verificar progreso hacia el primer hito en Factory Screen
6. Ir a "Machine Builder" desde Factory Screen para construir un Miner y colocarlo en un nodo compatible
7. Regresar al mapa y verificar que el icono de nodo correcto fue reemplazado por el del Miner
8. Verificar producción automática desde Deployed Machines Screen y ResourceOverviewHeader

### Flujo de Progresión Intermedia
1. Completar varios hitos consecutivos
2. Construir cadenas de producción complejas
3. Verificar funcionamiento de múltiples máquinas
4. Probar diferentes tipos de recetas
5. Validar gestión de inventario con muchos items

### Flujo de Usuario Avanzado
1. Gestionar múltiples cadenas de producción simultáneas
2. Optimizar colocación de máquinas
3. Analizar eficiencia de producción
4. Probar límites del sistema (muchas máquinas, nodos agotándose)

---

## Aspectos Críticos a Verificar

### Persistencia de Datos
- El juego guarda automáticamente cada 30 segundos
- Estado se mantiene al cerrar y abrir la aplicación
- Progreso de hitos se conserva correctamente
- Máquinas desplegadas mantienen su estado

### Rendimiento
- Fluidez al explorar mapas grandes
- Capacidad de respuesta con muchas máquinas activas
- Carga rápida de pantallas con muchos elementos

### Consistencia de Datos
- Inventario coherente entre pantallas
- Progreso de hitos actualizado en tiempo real
- Estado de máquinas sincronizado correctamente

### Experiencia de Usuario
- Navegación intuitiva entre pantallas
- Feedback visual claro para acciones del jugador
- Información suficiente para tomar decisiones informadas

---

## Notas Importantes para el Tester

### Navegación y Controles
- **Navegador inferior**: Solo 3 pestañas (Factory, Machines, Options) - Factory es la única pantalla real
- **Navegación principal**: Desde Factory Screen se accede a todas las demás pantallas mediante botones específicos
- **Acciones táctiles**: Muchas acciones requieren tocar (no mantener presionado)
- **Botón de regreso**: Siempre disponible en headers para regresar a pantallas anteriores

### Elementos Visuales Importantes
- **Estados de máquinas**: Indicadores visuales muestran si están operativas o inactivas
- **Notificaciones toast**: Aparecen temporalmente al descubrir nodos o completar acciones
- **Barras de progreso**: Muestran estado de producción en máquinas y progreso de hitos

### Sistema de Guardado
- **Guardado automático**: Cada 30 segundos, no requiere intervención del usuario
- **Guardado manual**: Disponible en Options Screen → Game Save
- **Reinicio de juego**: Solo disponible en Options Screen → Game Data → "New Game"

### Flujo de Datos
- **Consistencia**: Inventario y estados deben ser consistentes entre todas las pantallas
- **Tiempo real**: Cambios se reflejan inmediatamente sin necesidad de refrescar
- **Persistencia**: Estado se mantiene al cambiar entre pantallas y al cerrar/abrir la app