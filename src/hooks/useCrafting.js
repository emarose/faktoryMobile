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

  const craftItem = useCallback((recipeId, outputItemId, outputAmount) => {
    const recipe = items[recipeId];

    if (!recipe || !recipe.inputs || !recipe.machine || !recipe.processingTime) {
      console.warn(`Attempted to craft invalid or incomplete recipe: ${recipeId}`);
      return false;
    }

    // Use the ref to check active crafts
    if (activeCraftsRef.current[recipeId]) {
      console.warn(`Recipe ${recipe.name} is already being crafted.`);
      return false;
    }

    if (!ownedMachines.includes(recipe.machine)) {
      console.warn(`Cannot craft ${recipe.name}: Machine type '${recipe.machine}' not found in ownedMachines. Current owned:`, ownedMachines);
      return false;
    }

    if (!canAfford(recipe.inputs)) {
      console.warn(`Cannot craft ${recipe.name}: Not enough resources. Needs:`, recipe.inputs, 'Has:', inventoryItems);
      return false;
    }

    const resourcesRemoved = removeResources(recipe.inputs);
    if (resourcesRemoved) {
      const totalTime = recipe.processingTime;

      // Start the interval first and capture its ID
      const interval = setInterval(() => {
        setActiveCrafts(prevActiveCrafts => {
          const currentCraft = prevActiveCrafts[recipeId];
          if (!currentCraft) { // Craft might have been removed already
            clearInterval(interval);
            return prevActiveCrafts;
          }

          const newRemainingTime = currentCraft.remainingTime - 1;

          if (newRemainingTime <= 0) {
            clearInterval(interval);
            addResource(outputItemId, outputAmount);
            console.log(`Successfully crafted ${outputAmount} ${items[outputItemId]?.name || outputItemId}`);

            const finalActiveCrafts = { ...prevActiveCrafts };
            delete finalActiveCrafts[recipeId];
            return finalActiveCrafts;
          }

          return {
            ...prevActiveCrafts,
            [recipeId]: {
              ...currentCraft,
              remainingTime: newRemainingTime,
            }
          };
        });
      }, 1000); // Update every second

      // Now update the state with the initial craft details and the interval ID
      setActiveCrafts(prevActiveCrafts => ({
        ...prevActiveCrafts,
        [recipeId]: {
          remainingTime: totalTime,
          totalTime: totalTime,
          intervalId: interval, // Store the actual interval ID
        }
      }));

      return true;
    } else {
      console.warn(`Failed to remove resources for crafting ${recipe.name}`);
      return false;
    }
  }, [inventoryItems, ownedMachines, addResource, removeResources, canAfford, addMachine]); // Still no activeCrafts in dependency array

  return { craftItem, activeCrafts };
};

export default useCrafting;