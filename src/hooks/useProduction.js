import { useEffect, useRef } from "react";
import { items } from "../data/items";

export const useProduction = (
  addResourceCallback,
  removeResourcesCallback,
  placedMachines,
  allResourceNodes,
  nodeAmounts,
  onDepleteNode
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
          // Respeta el flag isIdle
          if (machine.isIdle) return; // No producir si está en pausa
          const node = allResourceNodes.find(
            (n) => n.id === machine.assignedNodeId
          );
          // Get current depletion from nodeAmounts
          const currentAmount =
            nodeAmounts && typeof nodeAmounts[node.id] === "number"
              ? nodeAmounts[node.id]
              : typeof node?.capacity === "number"
              ? node.capacity
              : 1000;

          if (node && items[node.type]?.output && currentAmount > 0) {
            for (const resourceId in items[node.type].output) {
              // --- CAP LOGIC ---
              const minersAssigned = placedMachines.filter(
                (m) => m.type === "miner" && m.assignedNodeId === node.id
              ).length;
              const maxAmount = minersAssigned * 1000;
              // Always produce 1 per tick for miners for consistency
              const amountProducedPerTick = 1;
              let allowedToAdd = amountProducedPerTick;
              // Only allow production if node is not depleted
              if (currentAmount < 1) {
                allowedToAdd = 0;
              }
              // Cap production if needed
              if (currentAmount + amountProducedPerTick > maxAmount) {
                allowedToAdd = Math.max(0, maxAmount - currentAmount);
              }
              // Deplete node by amount produced (decrease nodeAmounts)
              if (typeof onDepleteNode === "function" && allowedToAdd > 0) {
                const newNodeAmount = Math.max(0, currentAmount - allowedToAdd);
                onDepleteNode(node.id, newNodeAmount);
              }
              // Add resource to inventory (not node)
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
    nodeAmounts,
    addResourceCallback,
    removeResourcesCallback,
    onDepleteNode, // Ensure depletion stays in sync
  ]); // Dependencies are the stable callbacks and machine/node data

  // This hook doesn't directly return state, but manages side effects
  // Usage: pass handleDepleteNode from MapScreen as onDepleteNode
};
