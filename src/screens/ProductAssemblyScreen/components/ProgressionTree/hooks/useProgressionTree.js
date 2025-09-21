import { useState, useEffect } from "react";
import useMachineRecipes from "./useMachineRecipes";

/**
 * Hook that manages the progression tree's state and provides data for the UI
 * @returns {Object} Object containing the progression tree state and data
 */
export const useProgressionTree = () => {
  const { machineList, machineRecipes } = useMachineRecipes();
  
  // Initialize with the first machine if available
  const [selectedMachineId, setSelectedMachineId] = useState(
    machineList[0]?.id || null
  );

  // Handler for selecting a machine tab
  const handleMachineSelect = (machineId) => {
    setSelectedMachineId(machineId);
  };

  // Function to auto-select first machine with search results
  const autoSelectMachineWithResults = (filteredMachineList) => {
    if (filteredMachineList.length > 0) {
      const firstMachineWithResults = filteredMachineList[0];
      if (firstMachineWithResults && selectedMachineId !== firstMachineWithResults.id) {
        setSelectedMachineId(firstMachineWithResults.id);
      }
    }
  };

  // Get the currently selected machine data
  const selectedMachine = machineRecipes[selectedMachineId];

  return {
    machineList,
    machineRecipes,
    selectedMachineId,
    selectedMachine,
    handleMachineSelect,
    autoSelectMachineWithResults
  };
};

export default useProgressionTree;
