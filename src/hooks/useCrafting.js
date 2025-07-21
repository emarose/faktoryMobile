import { useCallback } from "react";
import { items } from "../data/items";

export const useCrafting = (
  inventoryItems,
  ownedMachines,
  addResource,
  removeResources,
  canAfford,
  addMachine
) => {
  const craftItem = useCallback(
    (recipeId, outputItemId, outputAmount) => {
      const recipe = items[recipeId];

      if (!recipe || !recipe.inputs || !recipe.machine) {
        console.warn(`Attempted to craft invalid recipe: ${recipeId}`);
        return false;
      }

      if (!ownedMachines.includes(recipe.machine)) {
        console.warn(
          `Cannot craft ${recipe.name}: Machine type '${recipe.machine}' not found in ownedMachines. Current owned:`,
          ownedMachines
        );
        return false;
      }

      if (!canAfford(recipe.inputs)) {
        console.warn(
          `Cannot craft ${recipe.name}: Not enough resources. Needs:`,
          recipe.inputs,
          "Has:",
          inventoryItems
        );
        return false;
      }

      const resourcesRemoved = removeResources(recipe.inputs);
      if (resourcesRemoved) {
        addResource(outputItemId, outputAmount);

        console.log(
          `Successfully crafted ${outputAmount} ${
            items[outputItemId]?.name || outputItemId
          }`
        );
        return true;
      } else {
        console.warn(`Failed to remove resources for crafting ${recipe.name}`);
        return false;
      }
    },
    [
      inventoryItems,
      ownedMachines,
      addResource,
      removeResources,
      canAfford,
      addMachine,
    ]
  );

  return { craftItem };
};
