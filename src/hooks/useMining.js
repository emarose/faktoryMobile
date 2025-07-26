import { useCallback } from "react";
import { items } from "../data/items";

export const useMining = (
  addResourceCallback,
  allResourceNodes,
  placedMachines,
  inventory
) => {
  const mineResource = useCallback(
    (nodeId) => {
      const node = allResourceNodes.find((n) => n.id === nodeId);
      if (!node || !items[node.type]?.manualMineable) {
        console.warn(
          `Node ${nodeId} is not manually mineable or does not exist.`
        );
        return;
      }

      const output = items[node.type].output;
      for (const resourceId in output) {
        // --- CAP LOGIC ---
        // The cap for each resource is always 100, regardless of miners
        const maxAmount = 1000;
        const currentAmount =
          inventory && inventory[resourceId]
            ? inventory[resourceId].currentAmount
            : 0;
        let allowedToAdd = output[resourceId];
        if (currentAmount + output[resourceId] > maxAmount) {
          allowedToAdd = Math.max(0, maxAmount - currentAmount);
        }
        if (allowedToAdd > 0) {
          addResourceCallback(resourceId, allowedToAdd, node.id);
        }
      }
      console.log(`Mined from ${node.name}!`);
    },
    [addResourceCallback, allResourceNodes, placedMachines, inventory]
  );

  return {
    mineResource,
  };
};
