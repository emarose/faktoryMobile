import { useState, useCallback, useMemo } from "react";
import { items } from "../data/items";

export const useMachines = (
  inventory,
  removeResourcesCallback,
  allResourceNodes
) => {
  const [placedMachines, setPlacedMachines] = useState([]);

  const mineableNodes = useMemo(() => {
    return allResourceNodes
      .filter(
        (node) =>
          items[node.type]?.manualMineable ||
          items[node.type]?.machineRequired === "miner" ||
          items[node.type]?.machineRequired === "oilExtractor"
      )
      .map((node) => {
        const itemDefinition = items[node.type];
        const outputResourceId = itemDefinition?.output
          ? Object.keys(itemDefinition.output)[0]
          : undefined;
        const outputItemDefinition = outputResourceId
          ? items[outputResourceId]
          : undefined;

        const assignedMachines = placedMachines.filter(
          (m) => (m.type === "miner" || m.type === "oilExtractor") && m.assignedNodeId === node.id
        );
        const activeMachines = assignedMachines.filter(m => !m.isIdle);
        const automatedProductionRate =
          activeMachines.length > 0 && outputResourceId
            ? activeMachines.reduce((total, machine) => {
                return total + (itemDefinition.output[outputResourceId] || 0) * (machine.efficiency || 1);
              }, 0)
            : 0;

        return {
          ...node,
          currentAmount: inventory[outputResourceId]?.currentAmount ?? 0,
          outputItemName: outputItemDefinition?.name || "Unknown",
          productionRate: automatedProductionRate,
          hasMachine: assignedMachines.length > 0,
          assignedMachineCount: assignedMachines.length,
          activeMachineCount: activeMachines.length,
          maxMachinesAllowed: 4,
          assignedMachineType: assignedMachines[0]?.type || null,
          canManualMine: itemDefinition?.manualMineable || false,
        };
      });
  }, [allResourceNodes, inventory, placedMachines]);

  const placeMachine = useCallback(
    (machineIdInInventory, targetNodeId = null, recipeId = null) => {
      
      // Check inventory via the canAfford callback from useInventory (or directly via inventory prop)
      if ((inventory[machineIdInInventory]?.currentAmount || 0) <= 0) {
        console.warn(
          `No ${
            items[machineIdInInventory]?.name || machineIdInInventory
          } in inventory to place.`
        );
        return false;
      }

      const machineTypeData = items[machineIdInInventory];
      if (!machineTypeData || machineTypeData.type !== "machine") {
        console.warn(
          `${machineIdInInventory} is not a valid machine type to place.`
        );
        return false;
      }

      // Deduct from inventory first
      const deducted = removeResourcesCallback({ [machineIdInInventory]: 1 });
      if (!deducted) {
        // Should already be checked, but for robustness
        console.warn(
          `Failed to deduct ${machineIdInInventory} from inventory.`
        );
        return false;
      }

      if (machineTypeData.id === "miner" || machineTypeData.id === "oilExtractor") {
        if (!targetNodeId) {
          console.warn(`A ${machineTypeData.name} must be assigned to a resource node.`);
          return false;
        }
        const node = allResourceNodes.find((n) => n.id === targetNodeId);
        if (!node) {
          console.warn(`Node ${targetNodeId} not found.`);
          return false;
        }
        // Check how many machines are already assigned to this node
        const assignedMachines = placedMachines.filter(
          (m) => (m.type === "miner" || m.type === "oilExtractor") && m.assignedNodeId === targetNodeId
        );
        const MAX_MACHINES_PER_NODE = 4;
        
        if (assignedMachines.length >= MAX_MACHINES_PER_NODE) {
          console.warn(
            `Node ${node.name} (${targetNodeId}) already has the maximum number of machines (${MAX_MACHINES_PER_NODE}) assigned.`
          );
          return false;
        }
        if (
          items[node.type]?.machineRequired &&
          items[node.type].machineRequired !== machineTypeData.id
        ) {
          console.warn(
            `Cannot place ${machineTypeData.name} on ${node.name}. It requires a ${
              items[node.type].machineRequired || "unknown machine type"
            }.`
          );
          return false;
        }

        // Genera un id único y consistente para la máquina
        const uniqueMachineId = `${machineTypeData.id}-${targetNodeId}-${Date.now()}-${Math.floor(Math.random()*10000)}`;
        setPlacedMachines((prevPlaced) => [
          ...prevPlaced,
          {
            id: uniqueMachineId,
            type: machineTypeData.id,
            assignedNodeId: targetNodeId,
            efficiency: machineTypeData.efficiency || 1,
            isIdle: false,
          },
        ]);
        console.log(`${machineTypeData.name} placed on ${node.name} (${targetNodeId})!`);
        return true;
      } else {
        setPlacedMachines((prevPlaced) => [
          ...prevPlaced,
          {
            id: `${machineTypeData.id}-${Date.now()}-${Math.floor(Math.random()*10000)}`,
            type: machineTypeData.id,
            recipeId: recipeId, // Allow assigning a default recipe or null
            isIdle: false,
          },
        ]);
        console.log(`${machineTypeData.name} placed!`);
        return true;
      }
    },
    [inventory, removeResourcesCallback, placedMachines, allResourceNodes]
  );


  // Función para pausar una máquina de extracción (miner o oilExtractor)
  const pauseMachine = useCallback((machineId) => {
    setPlacedMachines((prev) => prev.map(m => {
      if (m.id === machineId) {
        return { ...m, isIdle: true };
      }
      // Si la máquina no tiene isIdle, lo agrega por robustez
      if ((m.type === "miner" || m.type === "oilExtractor") && typeof m.isIdle === 'undefined') {
        return { ...m, isIdle: false };
      }
      return m;
    }));
  }, []);

  // Función para reanudar una máquina de extracción (miner o oilExtractor)
  const resumeMachine = useCallback((machineId) => {
    setPlacedMachines((prev) => prev.map(m => {
      if (m.id === machineId) {
        return { ...m, isIdle: false };
      }
      if ((m.type === "miner" || m.type === "oilExtractor") && typeof m.isIdle === 'undefined') {
        return { ...m, isIdle: false };
      }
      return m;
    }));
  }, []);

  // Legacy functions for backward compatibility
  const pauseMiner = pauseMachine;
  const resumeMiner = resumeMachine;

  return {
    placedMachines,
    setPlacedMachines,
    mineableNodes,
    placeMachine,
    pauseMachine,
    resumeMachine,
    // Legacy exports for backward compatibility
    pauseMiner,
    resumeMiner,
  };
};
