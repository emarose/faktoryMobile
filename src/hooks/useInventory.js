// hooks/useInventory.js
import { useState, useCallback, useMemo } from "react";
import { items } from "../data/items"; // Make sure this path is correct

export const useInventory = () => {
  const [inventoryState, setInventoryState] = useState(() => {
    const initialItems = {};

    // Initialize ALL items from the 'items' data,
    // regardless of whether they are nodes or have debug amounts
    // This ensures every possible item ID used as an input exists.
    Object.keys(items).forEach((key) => {
      // Exclude '_node' types from the main inventory if you prefer,
      // but ensure other types (raw materials, products, buildables) are included.
      // If a '_node' item is also used as a crafting input, you might need to adjust.
      // For safety, let's include everything except resource nodes that only exist on the map.
      if (!key.endsWith("_node")) {
        // Adjust this condition if resource node IDs are also inputs
        initialItems[key] = {
          id: key,
          name: items[key].name,
          description: items[key].description,
          icon: items[key].icon,
          type: items[key].type,
          currentAmount: 0, // Start with 0 for all items by default
        };
      }
    });

    // --- DEBUG/TEST: Initial resources for building (apply to initialItems now) ---
    // Ensure these IDs match exactly what's in your items.js
    if (initialItems.ironOre) initialItems.ironOre.currentAmount = 500;
    if (initialItems.copperOre) initialItems.copperOre.currentAmount = 500;
    if (initialItems.limestone) initialItems.limestone.currentAmount = 500;
    if (initialItems.coal) initialItems.coal.currentAmount = 200;

    if (initialItems.ironIngot) initialItems.ironIngot.currentAmount = 200;
    if (initialItems.copperIngot) initialItems.copperIngot.currentAmount = 100;
    if (initialItems.ironPlates) initialItems.ironPlates.currentAmount = 50;
    if (initialItems.ironRods) initialItems.ironRods.currentAmount = 50;
    if (initialItems.wires) initialItems.wires.currentAmount = 50;
    if (initialItems.concrete) initialItems.concrete.currentAmount = 20;

    // Initialize machine *items* (these are the items you hold in inventory when you build a machine)
    if (initialItems.miner) initialItems.miner.currentAmount = 0;
    if (initialItems.smelter) initialItems.smelter.currentAmount = 0;
    if (initialItems.constructor) initialItems.constructor.currentAmount = 0;
    if (initialItems.assembler) initialItems.assembler.currentAmount = 0;
    if (initialItems.manufacturer) initialItems.manufacturer.currentAmount = 0;
    if (initialItems.refinery) initialItems.refinery.currentAmount = 0;
    if (initialItems.foundry) initialItems.foundry.currentAmount = 0;
    if (initialItems.oilExtractor) initialItems.oilExtractor.currentAmount = 0;
    // --- END DEBUG/TEST ---

    // Initialize ownedMachines as an empty array (for unique machine types you've built)
    const initialOwnedMachines = [];
    // For testing, add a 'smelter' to ownedMachines if you want to see recipes immediately.
    //initialOwnedMachines.push("smelter"); // REMOVE OR COMMENT THIS LINE ONCE BUILDING IS FULLY FUNCTIONAL

    return {
      items: initialItems,
      ownedMachines: initialOwnedMachines,
    };
  });

  const addResource = useCallback((resourceId, amount) => {
    setInventoryState((prevInventory) => {
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
          type: items[resourceId]?.type || "unknown", // Set a default type
          currentAmount: 0,
        };
      }
      newItems[resourceId] = {
        ...newItems[resourceId],
        currentAmount: newItems[resourceId].currentAmount + amount,
      };
      return { ...prevInventory, items: newItems };
    });
  }, []);

  const removeResources = useCallback(
    (resourcesToRemove) => {
      let hasEnough = true;
      const newItems = { ...inventoryState.items };

      for (const resourceId in resourcesToRemove) {
        // CRITICAL: Check if the resource exists in inventory before trying to access currentAmount
        if (
          !newItems[resourceId] ||
          (newItems[resourceId]?.currentAmount || 0) <
            resourcesToRemove[resourceId]
        ) {
          hasEnough = false;
          // console.warn(`Not enough or missing resource ${resourceId} to remove ${resourcesToRemove[resourceId]}. Current: ${newItems[resourceId]?.currentAmount || 0}`);
          return inventoryState; // Return original state if not enough resources or resource missing
        }
      }

      if (hasEnough) {
        for (const resourceId in resourcesToRemove) {
          newItems[resourceId] = {
            ...newItems[resourceId],
            currentAmount:
              newItems[resourceId].currentAmount -
              resourcesToRemove[resourceId],
          };
        }
        setInventoryState((prevInventory) => ({
          ...prevInventory,
          items: newItems,
        }));
      }
      return hasEnough;
    },
    [inventoryState]
  ); // Dependency on inventoryState ensures it uses the latest state for checks

  const addMachine = useCallback((machineType) => {
    setInventoryState((prevInventory) => {
      // Si el tipo de máquina ya está en la lista de máquinas poseídas, no hacer nada para evitar duplicados.
      // Esto asume que 'ownedMachines' es una lista de TIPOS únicos de máquinas que el jugador tiene.
      if (!prevInventory.ownedMachines.includes(machineType)) {
        console.log(
          `Añadiendo tipo de máquina a ownedMachines: ${machineType}`
        );
        return {
          ...prevInventory,
          ownedMachines: [...prevInventory.ownedMachines, machineType],
        };
      }
      console.log(`Tipo de máquina ${machineType} ya poseído.`);
      return prevInventory; // Retorna el estado anterior si ya existe
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
        (key) =>
          items[key].type === "machine" || items[key].type === "building"
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
  };
};
