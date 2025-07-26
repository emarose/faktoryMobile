import { useEffect, useRef } from "react";
import { items } from "../data/items";

export const useProduction = (
  addResourceCallback,
  removeResourcesCallback,
  placedMachines,
  allResourceNodes
) => {
  const productionLoopRef = useRef(null);

  useEffect(() => {
    const processProductionTick = () => {
      // Functional updates for safety when modifying inventory via callbacks
      // The callbacks (addResourceCallback, removeResourcesCallback) handle the actual state updates.
      // This hook focuses on the *logic* of production.
      placedMachines.forEach((machine) => {
        // Miner production logic
        if (machine.type === "miner" && machine.assignedNodeId) {
          const node = allResourceNodes.find(
            (n) => n.id === machine.assignedNodeId
          );
          if (node && items[node.type]?.output) {
            for (const resourceId in items[node.type].output) {
              // --- CAP LOGIC ---
              // Count miners assigned to this node
              const minersAssigned = placedMachines.filter(
                (m) => m.type === "miner" && m.assignedNodeId === node.id
              ).length;
              const maxAmount = minersAssigned * 100;
              // Get current amount from inventory
              // NOTE: addResourceCallback should not add more than maxAmount
              // So we need to check current amount and only add up to the cap
              const currentAmount =
                typeof node.currentAmount === "number"
                  ? node.currentAmount
                  : 0;
              // If node.currentAmount is not available, you may need to get it from inventory
              // (Assuming inventory[resourceId]?.currentAmount is available via context)
              // If not, you may need to pass inventory to this hook or fetch it from context

              // For now, let's assume addResourceCallback will not add more than allowed
              // So, calculate how much can be added:
              const amountProducedPerTick =
                items[node.type].output[resourceId] * (machine.efficiency || 1);
              // Calculate allowed amount to add
              let allowedToAdd = amountProducedPerTick;
              if (typeof node.currentAmount === "number") {
                if (node.currentAmount + amountProducedPerTick > maxAmount) {
                  allowedToAdd = Math.max(0, maxAmount - node.currentAmount);
                }
              }
              if (allowedToAdd > 0) {
                addResourceCallback(resourceId, allowedToAdd, node.id);
              }
            }
          }
        }

        // Smelter production logic (example)
        if (machine.type === "smelter" && machine.recipeId) {
          const recipe = items[machine.recipeId];
          if (
            recipe &&
            recipe.inputs &&
            recipe.output &&
            recipe.processingTime
          ) {
            // Check if resources are available BEFORE attempting to remove and add
            // This implicitly uses the latest state from useInventory through the callback.
            const hasInputs = removeResourcesCallback(recipe.inputs); // Try to remove inputs
            if (hasInputs) {
              // If inputs were successfully removed, add outputs
              for (const outputId in recipe.output) {
                addResourceCallback(outputId, recipe.output[outputId]);
              }
            }
          }
        }
        // Add logic for other machine types (constructor, assembler, etc.)
      });
    };

    if (productionLoopRef.current) {
      clearInterval(productionLoopRef.current);
    }

    productionLoopRef.current = setInterval(processProductionTick, 1000); // 1 second tick

    return () => {
      if (productionLoopRef.current) {
        clearInterval(productionLoopRef.current);
      }
    };
  }, [
    placedMachines,
    allResourceNodes,
    addResourceCallback,
    removeResourcesCallback,
  ]); // Dependencies are the stable callbacks and machine/node data

  // This hook doesn't directly return state, but manages side effects
};
