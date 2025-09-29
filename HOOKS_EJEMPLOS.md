# Ejemplos Básicos de Hooks en FaktoryMobile

Este documento muestra ejemplos mínimos de uso para cada uno de los hooks principales del proyecto, junto con una breve explicación de su propósito.

---

## useInventory

**Propósito:** Maneja el inventario, permite agregar, quitar y reservar recursos, y verifica si se pueden costear acciones.

**Ejemplo:**
```javascript
const { inventory, addResource, removeResources, canAfford } = useInventory();
addResource('ironOre', 5);
const canBuild = canAfford({ ironOre: 10 });
removeResources({ ironOre: 2 });
```

---

## useMachines

**Propósito:** Gestiona las máquinas desplegadas, su asignación a nodos y su estado (pausada, activa).

**Ejemplo:**
```javascript
const { placedMachines, placeMachine, pauseMachine, resumeMachine } = useMachines(inventory, removeResourcesCallback, allResourceNodes);
placeMachine('miner', 'node-123');
pauseMachine('miner-123');
resumeMachine('miner-123');
```

---

## useCrafting

**Propósito:** Encapsula la lógica de crafting, manejo de colas y validación de recursos.

**Ejemplo:**
```javascript
const { craftItem } = useCrafting(inventoryItems, ownedMachines, addResource, removeResources, canAfford, addMachine);
craftItem({ name: 'Iron Ingot', inputs: { ironOre: 1 }, output: { ironIngot: 1 }, machine: 'smelter' }, 1);
```

---

## useProduction

**Propósito:** Controla la producción automática de recursos por máquinas y nodos.

**Ejemplo:**
```javascript
useProduction(addResourceCallback, removeResourcesCallback, placedMachines, allResourceNodes, nodeAmounts, onDepleteNode);
```

---

## useToastMessage

**Propósito:** Muestra mensajes temporales (toast) en la UI.

**Ejemplo:**
```javascript
const { visible, message, showToast, hideToast } = useToast();
showToast('¡Acción realizada!');
hideToast();
```

---

## useMilestone

**Propósito:** Gestiona la progresión y desbloqueo de milestones.

**Ejemplo:**
```javascript
const { milestones, canCompleteCurrentMilestone, completeCurrentMilestone } = useMilestone(inventory, discoveredCount);
if (canCompleteCurrentMilestone) completeCurrentMilestone();
```

---

## useWorldMapExploration

**Propósito:** Lógica de exploración y manipulación de nodos en el mapa.

**Ejemplo:**
```javascript
const { exploreDirection, pinnedNodeId, manualPinNode } = useWorldMapExploration(
  nodes, discoveryRadiusPx, discoveredNodes, setDiscoveredNodes, playerMapPosition, setPlayerMapPosition, onMove
);
exploreDirection('up');
manualPinNode('node-123');
```

---

Cada ejemplo puede adaptarse según las necesidades del componente y el flujo de la aplicación.