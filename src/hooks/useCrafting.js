// hooks/useCrafting.js
import { useState, useCallback, useEffect, useRef } from 'react'; // Import useRef
import { items } from '../data/items';

const useCrafting = (inventoryItems, ownedMachines, addResource, removeResources, canAfford, addMachine) => {
  const [activeCrafts, setActiveCrafts] = useState({});
  const activeCraftsRef = useRef(activeCrafts); // Create a ref to hold the latest activeCrafts

  // Update the ref whenever activeCrafts changes
  useEffect(() => {
    activeCraftsRef.current = activeCrafts;
  }, [activeCrafts]);

  // Effect to clean up intervals when component unmounts
  useEffect(() => {
    return () => {
      // Use the ref for cleanup to ensure we access the very latest state
      Object.values(activeCraftsRef.current).forEach(craft => {
        if (craft.intervalId) {
          clearInterval(craft.intervalId);
          console.log(`Cleared interval for ${craft.recipeId} on unmount.`); // Debugging
        }
      });
    };
  }, []); // Empty dependency array: runs once on mount, cleans up on unmount

  // Synchronous crafting: checks, removes resources, adds output
  const craftItem = useCallback((recipeId, amount = 1) => {
    const recipe = items[recipeId];
    if (!recipe || !recipe.inputs || !recipe.machine) {
      console.warn(`Attempted to craft invalid or incomplete recipe: ${recipeId}`);
      return false;
    }
    if (!ownedMachines.includes(recipe.machine)) {
      console.warn(`Cannot craft ${recipe.name}: Machine type '${recipe.machine}' not found in ownedMachines. Current owned:`, ownedMachines);
      return false;
    }
    // Check if enough resources for the requested amount
    const totalInputs = (recipe.inputs || []).map(input => ({
      item: input.item,
      amount: input.amount * amount
    }));
    if (!canAfford(totalInputs)) {
      console.warn(`Cannot craft ${recipe.name}: Not enough resources. Needs:`, totalInputs, 'Has:', inventoryItems);
      return false;
    }
    // Remove resources
    const resourcesRemoved = removeResources(totalInputs);
    if (resourcesRemoved) {
      // Add output(s)
      if (recipe.output) {
        // Single output
        addResource(recipe.output, (recipe.outputAmount || 1) * amount);
      } else if (recipe.outputs && Array.isArray(recipe.outputs)) {
        // Multiple outputs
        recipe.outputs.forEach(output => {
          addResource(output.item, (output.amount || 1) * amount);
        });
      }
      return true;
    } else {
      console.warn(`Failed to remove resources for crafting ${recipe.name}`);
      return false;
    }
  }, [inventoryItems, ownedMachines, addResource, removeResources, canAfford, addMachine]);

  return { craftItem, activeCrafts };
};

export default useCrafting;