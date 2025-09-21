# LISTA DE TAREAS PRIORITARIAS

## PRIORIDAD ALTA

3. Plan de acción recomendado
Paso 1: Centralizar colores
Define una paleta simple en Colors.js (máximo 8-10 colores semánticos).
Busca y reemplaza todos los colores hardcodeados en el proyecto por referencias a Colors.js.
Paso 2: Refactorizar estilos
Mueve estilos inline a archivos styles.js por componente.
Usa constantes de colores y espaciado en los estilos.
Paso 3: Componetización
Identifica componentes repetidos (cards, badges, barras, tooltips).
Crea componentes base reutilizables y reemplaza las implementaciones duplicadas.
Paso 4: Refactorizar archivos largos con lógica
Divide pantallas y contextos grandes en componentes/hook más pequeños.
Mantén los archivos de datos largos si solo contienen datos.
Paso 5: Mejorar consistencia visual
Usa constantes para tipografía, espaciado y sombras.
Aplica los componentes base y estilos centralizados en todas las pantallas.
4. ¿Cómo proseguir?
Define la paleta de colores y reemplaza hardcodeados.
Centraliza estilos en styles.js y usa constantes.
Componetiza UI repetida.
Refactoriza archivos largos con lógica.
Revisa y ajusta la consistencia visual en todas las pantallas.

### DeployedMachinesScreen [P2]
- [ ] Mejorar visualización de máquinas (🔑 Agrupar por tipo y función)
- [ ] Implementar filtros de estado (🔑 Activo/Inactivo/Procesando)
- [ ] Añadir vista de mapa/grid para visualizar ubicación (🔑 Mini-mapa con posiciones relativas)
- [ ] Crear componente de flujo de producción (🔑 Visualizar cadenas de producción)

### ProductAssemblyScreen [P2]
- [ ] Reimplementar ProgressionTree (🔑 Usar visualización de árbol interactivo)
- [ ] Mejorar cards de recetas (🔑 Mejor jerarquía visual de inputs/outputs)
- [ ] Implementar diagrama de flujo (🔑 Mostrar dependencias entre recetas)
- [ ] Añadir calculadora de ratio de producción (🔑 Ayudar a planificar cadenas eficientes)

## PRIORIDAD MEDIA

### BuildScreen [P3]
- [ ] Implementar tabs categorizados (🔑 Agrupar por tipo de construcción)
- [ ] Añadir filtros por recursos disponibles (🔑 Mostrar/ocultar lo que se puede construir)
- [ ] Mejorar visualización de requisitos (🔑 Mini-gráficos de recursos necesarios)
- [ ] Implementar vista de comparación (🔑 Permitir comparar máquinas similares)

### MapScreen [P3]
- [ ] Implementar minimap para navegación rápida (🔑 Vista general en una esquina)
- [ ] Mejorar visualización de nodos (🔑 Indicadores de tipo/cantidad más claros)
- [ ] Añadir filtros por tipo de recurso (🔑 Permitir mostrar solo ciertos recursos)
- [ ] Mejorar controles de zoom (🔑 Gestos más intuitivos y suaves)

### FactoryScreen [P3]
- [ ] Implementar animaciones sutiles (🔑 Transiciones entre acciones)
- [ ] Mejorar diseño responsivo (🔑 Adaptación a diferentes tamaños)
- [ ] Agregar vista de "favoritos" (🔑 Acceso rápido a máquinas frecuentes)
- [ ] Optimizar rendimiento (🔑 Usar React.memo para componentes pesados)

## PRIORIDAD BAJA

### BasicResourcesScreen [P4]
- [ ] Implementar gráficos interactivos (🔑 Mostrar tendencias de recursos)
- [ ] Añadir proyecciones de consumo/producción (🔑 Visualizar futuro basado en tasas actuales)
- [ ] Crear indicadores para recursos críticos (🔑 Alertas visuales para escasez)

### InventoryScreen [P4]
- [ ] Implementar sistema de categorías con tabs (🔑 Agrupar items por tipo)
- [ ] Añadir búsqueda y filtros avanzados (🔑 Encontrar items rápidamente)
- [ ] Mejorar visualización con agrupación (🔑 Organizar por uso/frecuencia)

### MilestonesScreen [P4]
- [ ] Crear visualización de árbol de progresión (🔑 Mostrar ruta de desarrollo)
- [ ] Implementar indicadores de progreso más claros (🔑 Porcentaje/fracción visual)
- [ ] Añadir tooltips con sugerencias (🔑 Ayudar a completar hitos difíciles)

### SmelterScreen/ConstructorScreen [P4]
- [ ] Unificar experiencia entre pantallas (🔑 Componentes compartidos para consistencia)
- [ ] Estandarizar visualización input/output (🔑 Mismo estilo en todas las máquinas)
- [ ] Implementar selector de eficiencia (🔑 Control unificado de velocidad/consumo)

## OPTIMIZACIONES TÉCNICAS [P5]

- [ ] Implementar memorización para componentes pesados (🔑 useMemo, React.memo)
- [ ] Optimizar renders con useCallback (🔑 Evitar recreación de funciones)
- [ ] Revisar performance de listas largas (🔑 Usar FlatList con virtualización)
- [ ] Implementar lazy loading (🔑 Cargar solo componentes visibles)

## MEJORAS DE UX [P5]

- [ ] Implementar tutoriales contextuales (🔑 Guías para funciones complejas)
- [ ] Añadir animaciones de feedback (🔑 Respuesta visual a acciones del usuario)
- [ ] Mejorar accesibilidad (🔑 Mejor contraste y targets de toque)
- [ ] Implementar gestos intuitivos (🔑 Acciones comunes con gestos)

// CAMBIOS A POSTERIORI - No realizar automaticamente

* Cambiar recetas de maquinas:
 - smelter
 - foundry
 - refinery
 - Assembler
 - Manufacturer
 - Constructor

* Acomodar requisitos de milestones.

## IMPLEMENTACIONES FUTURAS

* Agregar un tutorial/onboarding:
  - [ ] Navegar a la posición x,y (🔑 Encuentra nodo específico)
  - [ ] Explorar el mapa (🔑 Descubrir cierta cantidad de área)
  - [ ] Tutorial de producción básica (🔑 Guiar primera cadena de producción)
  - [ ] Explicación de hitos (🔑 Entender sistema de progresión)

* Nuevas características:
  - [ ] Sistema de logros (🔑 Recompensas por completar desafíos)
  - [ ] Perfiles de producción guardados (🔑 Guardar/cargar configuraciones)
  - [ ] Sistema de automatización avanzado (🔑 Programación de máquinas)
  - [ ] Estadísticas detalladas (🔑 Análisis profundo de producción/consumo)

