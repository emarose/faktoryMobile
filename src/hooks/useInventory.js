import { useState, useCallback, useMemo } from "react";
import { items } from "../data/items";
import RESOURCE_CAP from "../constants/ResourceCap";

export const useInventory = () => {
  const getInitialState = () => {
    const initialItems = {};
    Object.keys(items).forEach((key) => {
      if (!key.endsWith("_node")) {
        initialItems[key] = {
          id: key,
          name: items[key].name,
          description: items[key].description,
          icon: items[key].icon,
          type: items[key].type,
          currentAmount: 0,
        };
      }
    });

    // Testing inventory: Add 200 of each item
    Object.keys(initialItems).forEach((key) => {
      initialItems[key].currentAmount = 200;
    });

    const initialOwnedMachines = [];

    return {
      items: initialItems,
      ownedMachines: initialOwnedMachines,
    };
  };

  const [inventoryState, setInventory] = useState(getInitialState);

  const addResource = useCallback((resourceId, amount) => {
    setInventory((prevInventory) => {
      const newItems = { ...prevInventory.items };
      // Ensure the item exists before trying to update it
      if (!newItems[resourceId]) {
        console.warn(
          `Attempted to add unknown resource: ${resourceId}. Initializing it.`
        );
        newItems[resourceId] = {
          id: resourceId,
          name: items[resourceId]?.name || resourceId,
          description: items[resourceId]?.description || "",
          icon: items[resourceId]?.icon || "",
          type: items[resourceId]?.type || "unknown",
          currentAmount: 0,
        };
      }
      const updatedAmount = Math.min(
        newItems[resourceId].currentAmount + amount,
        RESOURCE_CAP
      );
      newItems[resourceId] = {
        ...newItems[resourceId],
        currentAmount: updatedAmount,
      };
      return { ...prevInventory, items: newItems };
    });
  }, []);

  const removeResources = useCallback(
    (resourcesToRemove) => {
      const hasEnough = Object.entries(resourcesToRemove).every(
        ([item, amount]) => {
          const current = inventoryState.items[item]?.currentAmount || 0;
          const enough = current >= amount;

          return enough;
        }
      );

      if (!hasEnough) {
        console.warn("Not enough resources to remove:", resourcesToRemove);
        return false;
      }

      // Remove resources
      setInventory((prev) => {
        const newItems = { ...prev.items };
        Object.entries(resourcesToRemove).forEach(([item, amount]) => {
          const before = newItems[item]?.currentAmount || 0;
          newItems[item] = {
            ...newItems[item],
            currentAmount: Math.max(0, before - amount),
          };
        });
        return { ...prev, items: newItems };
      });

      return true;
    },
    [inventoryState]
  );
  const addMachine = useCallback((machineType) => {
    setInventory((prevInventory) => {
      // Always add a new machine instance with a unique id
      const newMachine = {
        id: `${machineType}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        type: machineType,
        currentRecipeId: null,
      };
      return {
        ...prevInventory,
        ownedMachines: [...prevInventory.ownedMachines, newMachine],
      };
    });
  }, []);

  const getInventoryItem = useCallback(
    (itemId) => {
      return inventoryState.items[itemId];
    },
    [inventoryState.items]
  );

  const canAfford = useCallback(
    (cost) => {
      for (const itemId in cost) {
        // CRITICAL: Check if the item exists in inventoryState.items before accessing currentAmount
        if (
          !inventoryState.items[itemId] ||
          (inventoryState.items[itemId]?.currentAmount || 0) < cost[itemId]
        ) {
          return false;
        }
      }
      return true;
    },
    [inventoryState.items]
  );

  const buildableItems = useMemo(() => {
    return Object.keys(items)
      .filter(
        (key) => items[key].type === "machine" || items[key].type === "building"
      )
      .map((key) => {
        const buildableItem = items[key];
        const requiredInputs = buildableItem.inputs || {};
        let canBuild = true;
        const missingResources = {};

        for (const inputId in requiredInputs) {
          const requiredAmount = requiredInputs[inputId];
          // CRITICAL: Check if item exists before accessing currentAmount
          const currentAmount =
            inventoryState.items[inputId]?.currentAmount || 0;

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
  }, [inventoryState.items]);

  return {
    inventory: inventoryState.items,
    ownedMachines: inventoryState.ownedMachines,
    addResource,
    removeResources,
    addMachine,
    getInventoryItem,
    canAfford,
    buildableItems,
    assignRecipeToMachine: (machineId, recipeId) => {
      setInventory((prevInventory) => {
        const updatedMachines = prevInventory.ownedMachines.map((machine) =>
          machine.id === machineId
            ? { ...machine, currentRecipeId: recipeId }
            : machine
        );
        return {
          ...prevInventory,
          ownedMachines: updatedMachines,
        };
      });
    },
    updateOwnedMachine: (machineId, updates) => {
      setInventory((prevInventory) => {
        const updatedMachines = prevInventory.ownedMachines.map((machine) =>
          machine.id === machineId ? { ...machine, ...updates } : machine
        );
        return {
          ...prevInventory,
          ownedMachines: updatedMachines,
        };
      });
    },
    setInventory,
  };
};
