import { useMemo, useState, useEffect } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useMachineColors } from '../../../hooks';
import { items } from '../../../data/items';

export default function useConstructorCard(machine) {
  const {
    placedMachines,
    craftingQueue,
    cancelCrafting,
    pauseCrafting,
    resumeCrafting,
  } = useGame();

  const { getMachineColor } = useMachineColors();

  // Get the live machine state
  const liveMachine = useMemo(() => {
    return placedMachines.find((m) => m.id === machine.id) || machine;
  }, [placedMachines, machine]);

  // Get current recipe
  const currentRecipe = useMemo(() => {
    return liveMachine.currentRecipeId ? items[liveMachine.currentRecipeId] : null;
  }, [liveMachine.currentRecipeId]);

  // Get crafting processes for this machine
  const machineProcesses = useMemo(() => {
    return craftingQueue.filter(
      (proc) =>
        proc.machineId === machine.id &&
        (proc.status === "pending" || proc.status === "paused")
    );
  }, [craftingQueue, machine.id]);

  const isProcessing = machineProcesses.length > 0;
  const currentProcess = machineProcesses[0];

  // Calculate progress for crafting
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!currentProcess) {
      setProgress(0);
      return;
    }

    const getSafeStartedAt = (proc) => {
      if (proc.startedAt) return proc.startedAt;
      if (proc.endsAt && proc.processingTime) {
        return proc.endsAt - proc.processingTime * 1000;
      }
      return Date.now();
    };

    const updateProgress = () => {
      const now = Date.now();
      const startedAt = getSafeStartedAt(currentProcess);
      const elapsed = (now - startedAt) / 1000;
      const totalTime = currentProcess.processingTime || 1;
      const currentProgress = Math.min(Math.max(elapsed, 0), totalTime);
      setProgress(currentProgress);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 10);
    return () => clearInterval(interval);
  }, [
    currentProcess?.id,
    currentProcess?.status,
    currentProcess?.startedAt,
  ]);

  // Calculate machine status
  const status = useMemo(() => {
    let statusText = "Idle";
    let statusColor = "#666";

    if (isProcessing && currentProcess) {
      if (currentProcess.status === "paused") {
        statusText = `Paused: ${currentProcess.itemName}`;
        statusColor = "#ff9800";
      } else {
        statusText = `Crafting: ${currentProcess.itemName}`;
        statusColor = "#4CAF50";
      }
    } else if (currentRecipe) {
      statusText = `Ready: ${currentRecipe.name}`;
      statusColor = "#2196F3";
    } else {
      statusText = "No recipe assigned";
      statusColor = "#666";
    }

    return {
      text: statusText,
      color: statusColor,
      isIdle: !isProcessing,
      isProcessing,
      isPaused: currentProcess?.status === "paused",
      hasRecipe: !!currentRecipe,
    };
  }, [isProcessing, currentProcess, currentRecipe]);

  // Action handlers
  const handlePauseResume = () => {
    if (currentProcess) {
      if (currentProcess.status === "paused") {
        resumeCrafting(machine.id);
      } else {
        pauseCrafting(machine.id);
      }
    }
  };

  const handleCancelCrafting = () => {
    if (isProcessing) {
      cancelCrafting(machine.id);
    }
  };

  return {
    liveMachine,
    currentRecipe,
    machineProcesses,
    currentProcess,
    progress,
    status,
    machineColor: getMachineColor(machine.type),
    displayName: items[machine.type]?.name || machine.type,
    actions: {
      handlePauseResume,
      handleCancelCrafting,
    },
  };
}