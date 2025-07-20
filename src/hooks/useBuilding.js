// hooks/useBuilding.js
import { useCallback } from "react";
import { items } from "../data/items"; // For item definitions

export const useBuilding = (
  addResourceCallback,
  removeResourcesCallback,
  buildableItems
) => {
  const buildItem = useCallback(
    (itemId) => {
      const itemToBuild = buildableItems.find((item) => item.id === itemId); // Use the pre-calculated buildable item

      if (!itemToBuild || !itemToBuild.canBuild) {
        console.warn(
          `Cannot build ${
            itemToBuild?.name || itemId
          }: Not enough resources or not a buildable item.`
        );
        return false;
      }

      // Deduct resources
      const deducted = removeResourcesCallback(itemToBuild.inputs);
      if (!deducted) {
        console.warn(
          `Failed to deduct resources for ${itemToBuild.name}. This should not happen if canBuild is true.`
        );
        return false;
      }

      // Add the built item to inventory
      const quantityBuilt = itemToBuild.output?.[itemId] || 1;
      addResourceCallback(itemId, quantityBuilt);

      console.log(
        `Successfully built ${itemToBuild.name}! Added to inventory.`
      );
      return true;
    },
    [addResourceCallback, removeResourcesCallback, buildableItems]
  ); // Dependencies are callbacks and derived buildableItems

  return {
    buildItem,
  };
};
