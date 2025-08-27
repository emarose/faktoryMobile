import { useCallback } from "react";
import { items } from "../data/items";
import RESOURCE_CAP from "../constants/ResourceCap";

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
        const maxAmount = RESOURCE_CAP;
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
    },
    [addResourceCallback, allResourceNodes, placedMachines, inventory]
  );

  return {
    mineResource,
  };
};
