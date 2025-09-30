### DeployedMachinesScreen [P2]
- [ ] Mejorar visualización de máquinas (🔑 Agrupar por tipo y función)
- [ ] Implementar filtros de estado (🔑 Activo/Inactivo/Procesando)
- [ ] Crear componente de flujo de producción (🔑 Visualizar cadenas de producción)

### ProductAssemblyScreen [P2]
- [ ] Mejorar cards de recetas (🔑 Mejor jerarquía visual de inputs/outputs)
- [ ] Implementar diagrama de flujo (🔑 Mostrar dependencias entre recetas)

## PRIORIDAD MEDIA

### BuildScreen [P3]
- [ ] Implementar tabs categorizados (🔑 Agrupar por tipo de construcción)
- [ ] Añadir filtros por recursos disponibles (🔑 Mostrar/ocultar lo que se puede construir)
- [ ] Mejorar visualización de requisitos (🔑 Mini-gráficos de recursos necesarios)
- [ ] Implementar vista de comparación (🔑 Permitir comparar máquinas similares)

### MapScreen [P3]
- [ ] Mejorar visualización de nodos (🔑 Indicadores de tipo/cantidad más claros)
- [ ] Añadir filtros por tipo de recurso (🔑 Permitir mostrar solo ciertos recursos)
- [ ] Mejorar controles de zoom (🔑 Gestos más intuitivos y suaves)


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

