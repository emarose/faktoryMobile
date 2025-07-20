// hooks/useMachines.js
import { useState, useCallback, useMemo } from "react";
import { items } from "../data/items";

export const useMachines = (
  inventory,
  removeResourcesCallback,
  allResourceNodes
) => {
  const [placedMachines, setPlacedMachines] = useState([]);

  // Memoized data about mineable nodes with current state
  const mineableNodes = useMemo(() => {
    return allResourceNodes
      .filter(
        (node) =>
          items[node.type]?.manualMineable ||
          items[node.type]?.machineRequired === "miner"
      )
      .map((node) => {
        const itemDefinition = items[node.type];
        const outputResourceId = itemDefinition?.output
          ? Object.keys(itemDefinition.output)[0]
          : undefined;
        const outputItemDefinition = outputResourceId
          ? items[outputResourceId]
          : undefined;

        const assignedMiner = placedMachines.find(
          (m) => m.type === "miner" && m.assignedNodeId === node.id
        );
        const automatedProductionRate =
          assignedMiner && outputResourceId
            ? (itemDefinition.output[outputResourceId] || 0) *
              (assignedMiner.efficiency || 1)
            : 0;

        return {
          ...node,
          currentAmount: inventory[outputResourceId]?.currentAmount ?? 0,
          outputItemName: outputItemDefinition?.name || "Unknown",
          productionRate: automatedProductionRate,
          hasMiner: !!assignedMiner,
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
      if (!machineTypeData || machineTypeData.type !== "buildable") {
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

      if (machineTypeData.id === "miner") {
        if (!targetNodeId) {
          console.warn("A Miner must be assigned to a resource node.");
          return false;
        }
        const node = allResourceNodes.find((n) => n.id === targetNodeId);
        if (!node) {
          console.warn(`Node ${targetNodeId} not found.`);
          return false;
        }
        if (placedMachines.some((m) => m.assignedNodeId === targetNodeId)) {
          console.warn(
            `Node ${node.name} (${targetNodeId}) already has a Miner assigned.`
          );
          return false;
        }
        if (
          items[node.type]?.machineRequired &&
          items[node.type].machineRequired !== "miner"
        ) {
          console.warn(
            `Cannot place Miner on ${node.name}. It requires an ${
              items[node.type].machineRequired || "unknown machine type"
            }.`
          );
          return false;
        }

        setPlacedMachines((prevPlaced) => [
          ...prevPlaced,
          {
            id: `miner-${Date.now()}`,
            type: "miner",
            assignedNodeId: targetNodeId,
            efficiency: machineTypeData.efficiency || 1,
          },
        ]);
        console.log(`Miner placed on ${node.name} (${targetNodeId})!`);
        return true;
      } else {
        setPlacedMachines((prevPlaced) => [
          ...prevPlaced,
          {
            id: `${machineTypeData.id}-${Date.now()}`,
            type: machineTypeData.id,
            recipeId: recipeId, // Allow assigning a default recipe or null
          },
        ]);
        console.log(`${machineTypeData.name} placed!`);
        return true;
      }
    },
    [inventory, removeResourcesCallback, placedMachines, allResourceNodes]
  );

  return {
    placedMachines,
    mineableNodes,
    placeMachine,
    // Add functions for updating machine recipes, removing machines, etc.
  };
};
