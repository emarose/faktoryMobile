// hooks/useMining.js
import { useCallback } from "react";
import { items } from "../data/items";

export const useMining = (addResourceCallback, allResourceNodes) => {
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
        addResourceCallback(resourceId, output[resourceId]);
      }
      console.log(`Mined from ${node.name}!`);
    },
    [addResourceCallback, allResourceNodes]
  ); // Dependencies are callback and static node data

  return {
    mineResource,
  };
};
