# Arquitectura Recomendada para FaktoryMobile

## 1. Estructura de Carpetas

La estructura de carpetas está pensada para maximizar la organización y la escalabilidad del proyecto. Cada carpeta agrupa archivos por su responsabilidad principal:

```
src/
  components/        # Componentes UI atómicos y reutilizables (ej: botones, cards, modals)
  screens/           # Pantallas principales y subcomponentes, cada pantalla en su propia carpeta
  contexts/          # Contextos globales por dominio, para manejar estado compartido
  hooks/             # Custom hooks para lógica desacoplada y reutilizable
  data/              # Modelos y datos estáticos, como recipes, items, milestones
  constants/         # Constantes globales (colores, límites, tipos)
  navigation/        # Configuración de navegación y rutas
  utils/             # Funciones utilitarias y helpers puros
  assets/            # Imágenes, fuentes, íconos
```

Esta separación permite que el código sea fácil de mantener, escalar y testear. Los cambios en una sección no afectan otras áreas del proyecto.

## 2. Contextos Globales

Los contextos globales permiten compartir estado y lógica entre diferentes partes de la aplicación sin prop drilling. Cada contexto debe ser responsable de un solo dominio:

- **GameContext**: Maneja el estado general del juego, como el progreso, la cola de crafting, los nodos del mapa y milestones. Es el "cerebro" del juego.
- **InventoryContext**: Encargado del inventario, reservas de recursos y métodos para modificar recursos. Permite atomicidad en operaciones de crafting y consumo.
- **MachinesContext**: Gestiona las máquinas desplegadas, sus tipos, estados (idle, running, paused) y asignaciones a nodos o recetas.
- **UIContext**: Controla el estado de la interfaz de usuario global, como toasts, modals y loaders. Permite mostrar feedback y manejar errores.
- **SettingsContext**: (Opcional) Preferencias de usuario, idioma, tema, etc.

**Ventajas:**
- Atomicidad: Cada contexto maneja solo su dominio, evitando dependencias cruzadas.
- Escalabilidad: Puedes agregar/quitar contextos sin romper el resto.
- Testeabilidad: Contextos pequeños son más fáciles de testear y mantener.

## 3. Hooks Personalizados


Los hooks personalizados encapsulan lógica reutilizable y desacoplada de la UI. Permiten que los componentes sean más simples y enfocados solo en la presentación.

**Síntesis de métodos/lógica principal por hook:**

- **useInventory**: Métodos para agregar/quitar recursos (`addResource`, `removeResources`), reservar recursos (`reserveResources`, `commitReserved`, `releaseReserved`), verificar si se puede costear (`canAfford`), obtener items y máquinas. Atomicidad en el manejo de inventario y reservas.
- **useMachines**: Métodos para colocar máquinas (`placeMachine`), pausar/reanudar (`pauseMachine`, `resumeMachine`), consultar máquinas desplegadas (`placedMachines`), asignar máquinas a nodos. Lógica de asignación y control de estado.
- **useCrafting**: Método principal para craftear (`craftItem`), manejo de colas y validación de recursos antes de iniciar crafting. Encapsula la lógica de crafting y reservas.
- **useProduction**: Lógica de producción automática por tick, usando callbacks para agregar/quitar recursos. No retorna estado, solo gestiona efectos de producción periódica.
- **useToast**: Métodos para mostrar y ocultar mensajes (`showToast`, `hideToast`), controla visibilidad y contenido del toast.
- **useMilestone**: Métodos para consultar milestones, verificar si se puede completar (`canCompleteCurrentMilestone`), completar milestone (`completeCurrentMilestone`), y obtener máquinas desbloqueadas.
- **useWorldMap**: Métodos para explorar direcciones (`exploreDirection`), fijar nodos manualmente (`manualPinNode`), obtener nodo fijado (`pinnedNodeId`). Lógica de exploración y descubrimiento de nodos.

Esto promueve la reutilización y la separación de responsabilidades.

## 4. Screens y Subcomponentes

Cada pantalla representa una vista principal de la app y puede tener subcomponentes propios. La estructura recomendada es:

- **screens/FactoryScreen/**: Vista principal de la fábrica, muestra resumen de recursos, máquinas y milestones.
- **screens/DeployedMachinesScreen/**: Lista de máquinas desplegadas, cada una con su MachineCard para mostrar estado y controles.
- **screens/SmelterScreen/**, **ConstructorScreen/**: Pantallas específicas para cada tipo de máquina, con lógica y UI propia.
- **screens/InventoryScreen/**: Muestra el inventario y permite gestión de recursos.
- **screens/MapScreen/**: Permite explorar el mapa y los nodos disponibles.

**Subcomponentes:**
- **MachineCard**: Componente atómico para mostrar estado, controles y detalles de una máquina.
- **ResourceSlot**: Muestra recursos requeridos o producidos.
- **ProgressBar**: Visualiza progreso de crafting o producción.
- **CraftButton**: Botón para iniciar crafting.
- **MiniToast**: Mensajes temporales.

Esta organización facilita la reutilización y el mantenimiento.

## 5. Atomicidad y Manejo de Estado

La atomicidad asegura que cada componente y función tenga una única responsabilidad y no dependa de detalles internos de otros módulos:

- Los componentes atómicos (ej: MachineCard, ResourceSlot) solo reciben props y callbacks, nunca acceden directamente a contextos globales.
- La lógica de negocio (reservas, crafting, cambios de estado) vive en hooks y contextos, no en la UI.
- El estado global se usa solo para datos compartidos (inventario, máquinas, craftingQueue), mientras que el estado local se usa para UI (modals abiertos, selección de receta, cantidad a producir).
- Todas las actualizaciones de estado se realizan a través de métodos del contexto/hook, nunca modificando el estado directamente desde la UI.

Esto previene efectos colaterales y facilita el testing.

## 6. Gestión de Máquinas (MachineCard y MachinesContext)

La gestión de máquinas se divide en dos partes:

- **MachinesContext**: Mantiene el estado de todas las máquinas desplegadas, sus tipos, asignaciones y estados (idle, running, paused). Provee métodos para desplegar, pausar, asignar recetas y actualizar el estado de cada máquina. Permite centralizar la lógica y evitar duplicidad.
- **MachineCard**: Componente UI que muestra el estado, controles y detalles de una máquina. Recibe props y callbacks para interactuar con MachinesContext, pero no maneja lógica interna de negocio.

Esto permite agregar nuevos tipos de máquinas fácilmente y mantener la UI desacoplada de la lógica.

## 7. Atomicidad en Crafting y Reservas

El sistema de crafting y reservas está diseñado para evitar condiciones de carrera y garantizar la consistencia de los recursos:

- **CraftingQueue** vive en GameContext y gestiona los procesos de crafting encolados.
- **Reservas** se manejan en InventoryContext, permitiendo reservar recursos al encolar un crafting y liberarlos si se cancela.
- Al iniciar un crafting, se realiza el commit de la reserva (los recursos se consumen realmente). Si se cancela antes de iniciar, se liberan los recursos reservados.
- Los hooks y contextos aseguran que todas las operaciones sean atómicas y consistentes, evitando que dos procesos consuman los mismos recursos.

## 8. Ejemplo de Flujo para MachineCard

**Flujo típico de interacción:**

1. **Visualización:** MachineCard muestra el estado actual y los controles disponibles para la máquina.
2. **Acción de usuario:** El usuario presiona "Pausar" o "Reanudar"; MachineCard dispara un callback que llama a MachinesContext para actualizar el estado.
3. **Inicio de crafting:** El usuario inicia un crafting; MachineCard llama a GameContext para encolar el proceso y a InventoryContext para reservar los recursos necesarios.
4. **Finalización:** Al completar el crafting, GameContext actualiza el inventario y el estado de la máquina, reflejando los cambios en la UI.

Este flujo asegura que la UI y la lógica estén desacopladas y que el estado sea consistente.

## 9. Otras recomendaciones

**Buenas prácticas adicionales:**

- **Testing:** Implementa tests unitarios para hooks y contextos, asegurando que la lógica funcione correctamente en todos los casos.
- **Tipado:** Utiliza TypeScript para tipar props, estados y métodos, lo que previene errores y facilita el mantenimiento.
- **Documentación:** Documenta cada contexto, hook y componente, explicando su propósito y uso.
- **Performance:** Usa memoización (`useMemo`, `React.memo`) en componentes y hooks que lo requieran para evitar renders innecesarios y mejorar el rendimiento.

## Resumen de Contextos y Hooks recomendados

**Contexts recomendados:**
- Game, Inventory, Machines, UI/Toast, Auth, Settings.

**Hooks recomendados:**
- useInventory, useMachines, useCrafting, useProduction, useToast, useMilestone, useWorldMap.

---

Esta arquitectura te permitirá escalar, mantener y testear tu proyecto de forma eficiente, con separación clara de responsabilidades y atomicidad en el manejo de estado y lógica de negocio.
