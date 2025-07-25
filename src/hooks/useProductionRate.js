// hooks/useProductionRate.js
import { useMemo } from 'react';
import { items } from '../data/items';

/**
 * Custom hook to calculate the total production rate for a given resource
 * based on placed production machines.
 *
 * @param {Array} placedMachines - An array of objects representing currently placed production machines.
 * Each object should at least contain { id: 'uniqueMachineId', machineType: 'miner', resourceTarget: 'ironOre' }.
 * @returns {function(string): number} A function `getProductionRate` that takes a resourceId
 * and returns its total production rate per second.
 */
const useProductionRate = (placedMachines) => {

  // Memoize the production rates to avoid recalculating on every render
  // unless placedMachines changes.
  const productionRates = useMemo(() => {
    const rates = {};

    placedMachines.forEach(machine => {
      // Find the machine definition from your raw game data to get its output and processing time.
      const machineDefinition = items[machine.machineType]; // e.g., rawGameData['miner']

      if (machineDefinition && machineDefinition.output && machineDefinition.processingTime) {
        // Assuming a miner/pump directly outputs a raw material at a base rate
        // You might need more complex logic here if:
        // - Miners have levels that affect rate
        // - Different machine types produce at different base speeds
        // - Recipes need to be considered for constructors/foundries (this hook is for raw material extraction primarily)

        const resourceTarget = machine.resourceTarget; // The resource ID this machine is extracting

        // For simplicity, let's assume raw material extractors produce 1 unit per processing time
        // Adjust this if your game has a base production rate per machine type or per resource node
        const baseRate = 1 / machineDefinition.processingTime; // Units per second

        if (rates[resourceTarget]) {
          rates[resourceTarget] += baseRate;
        } else {
          rates[resourceTarget] = baseRate;
        }
      }
    });

    return rates;
  }, [placedMachines]);

  /**
   * Returns the total production rate per second for a given resource ID.
   * @param {string} resourceId - The ID of the resource (e.g., 'ironOre').
   * @returns {number} The total production rate. Defaults to 0 if not found.
   */
  const getProductionRate = (resourceId) => {
    return productionRates[resourceId] || 0;
  };

  return { getProductionRate };
};

export default useProductionRate;