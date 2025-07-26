import { useMemo } from "react";
import { items } from "../data/items";

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
  const productionRates = useMemo(() => {
    const rates = {};

    placedMachines.forEach((machine) => {
      const machineDefinition = items[machine.machineType];

      if (
        machineDefinition &&
        machineDefinition.output &&
        machineDefinition.processingTime
      ) {
        const resourceTarget = machine.resourceTarget;

        const baseRate = 1 / machineDefinition.processingTime;

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
