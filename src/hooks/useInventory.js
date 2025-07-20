// hooks/useInventory.js
import { useState, useCallback, useMemo } from 'react';
import { items } from '../data/items';

export const useInventory = () => {
  const [inventory, setInventory] = useState(() => {
    const initialInventory = {};
    Object.keys(items).forEach(key => {
      if (!key.endsWith('_node')) {
        initialInventory[key] = {
          id: key,
          name: items[key].name,
          description: items[key].description,
          icon: items[key].icon,
          type: items[key].type,
          currentAmount: 0,
        };
      }
    });

    // --- DEBUG/TEST: Initial resources for building ---
    if (initialInventory.ironOre) initialInventory.ironOre.currentAmount = 500;
    if (initialInventory.copperOre) initialInventory.copperOre.currentAmount = 500;
    if (initialInventory.limestone) initialInventory.limestone.currentAmount = 500;
    if (initialInventory.coal) initialInventory.coal.currentAmount = 200;

    if (initialInventory.ironIngot) initialInventory.ironIngot.currentAmount = 200;
    if (initialInventory.copperIngot) initialInventory.copperIngot.currentAmount = 100;
    if (initialInventory.ironPlates) initialInventory.ironPlates.currentAmount = 50;
    if (initialInventory.ironRods) initialInventory.ironRods.currentAmount = 50;
    if (initialInventory.wires) initialInventory.wires.currentAmount = 50;
    if (initialInventory.concrete) initialInventory.concrete.currentAmount = 20;

    if (initialInventory.miner) initialInventory.miner.currentAmount = 0;
    if (initialInventory.smelter) initialInventory.smelter.currentAmount = 0;
    if (initialInventory.constructor) initialInventory.constructor.currentAmount = 0;
    if (initialInventory.assembler) initialInventory.assembler.currentAmount = 0;
    if (initialInventory.manufacturer) initialInventory.manufacturer.currentAmount = 0;
    if (initialInventory.refinery) initialInventory.refinery.currentAmount = 0;
    if (initialInventory.foundry) initialInventory.foundry.currentAmount = 0;
    if (initialInventory.oilExtractor) initialInventory.oilExtractor.currentAmount = 0;

    return initialInventory;
  });

  const addResource = useCallback((resourceId, amount) => {
    setInventory(prevInventory => {
      const newInventory = { ...prevInventory };
      if (newInventory[resourceId]) {
        newInventory[resourceId] = {
          ...newInventory[resourceId],
          currentAmount: newInventory[resourceId].currentAmount + amount,
        };
      } else {
        // Fallback: Add new resource if not pre-initialized (should ideally not happen if all items are in initialInventory)
        console.warn(`Resource ${resourceId} not found in inventory definition, adding it.`);
        newInventory[resourceId] = {
          id: resourceId,
          name: items[resourceId]?.name || resourceId,
          description: items[resourceId]?.description || '',
          icon: items[resourceId]?.icon || '',
          type: items[resourceId]?.type || 'rawMaterial',
          currentAmount: amount,
        };
      }
      return newInventory;
    });
  }, []);

  const removeResources = useCallback((resourcesToRemove) => {
    // resourcesToRemove is an object like { 'ironOre': 5, 'copperOre': 2 }
    let hasEnough = true;
    setInventory(prevInventory => {
      const newInventory = { ...prevInventory };
      for (const resourceId in resourcesToRemove) {
        if ((newInventory[resourceId]?.currentAmount || 0) < resourcesToRemove[resourceId]) {
          hasEnough = false; // Cannot perform transaction
          return prevInventory; // Return original state if not enough resources
        }
      }

      if (hasEnough) {
        for (const resourceId in resourcesToRemove) {
          newInventory[resourceId] = {
            ...newInventory[resourceId],
            currentAmount: newInventory[resourceId].currentAmount - resourcesToRemove[resourceId],
          };
        }
      }
      return newInventory;
    });
    return hasEnough;
  }, []);

  const getInventoryItem = useCallback((itemId) => {
    return inventory[itemId];
  }, [inventory]);

  const canAfford = useCallback((cost) => {
    for (const itemId in cost) {
      if ((inventory[itemId]?.currentAmount || 0) < cost[itemId]) {
        return false;
      }
    }
    return true;
  }, [inventory]);

  // Memoized derived state for buildable items, now dependent only on inventory
  const buildableItems = useMemo(() => {
    return Object.keys(items)
      .filter(key => items[key].type === "buildable")
      .map(key => {
        const buildableItem = items[key];
        const requiredInputs = buildableItem.inputs || {};
        let canBuild = true;
        const missingResources = {};

        for (const inputId in requiredInputs) {
          const requiredAmount = requiredInputs[inputId];
          const currentAmount = inventory[inputId]?.currentAmount || 0;

          if (currentAmount < requiredAmount) {
            canBuild = false;
            missingResources[inputId] = requiredAmount - currentAmount;
          }
        }

        return {
          id: key,
          ...buildableItem,
          inputs: requiredInputs,
          canBuild: canBuild,
          missingResources: missingResources,
        };
      });
  }, [inventory]);

  return {
    inventory,
    addResource,
    removeResources,
    getInventoryItem,
    canAfford,
    buildableItems, // Still provide this derived state here for convenience
  };
};