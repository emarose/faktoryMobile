import { useState, useEffect, useRef } from "react";
import milestonesData from "../data/milestones";

export function useMilestone(inventory, discoveredCount) {
  const [milestones, setMilestones] = useState(milestonesData);
  const [activeMilestone, setActiveMilestone] = useState(milestonesData[0].id);

  // Find the current milestone (first locked one)
  const currentMilestone = milestones.find((m) => !m.unlocked);
  const unlockedMachineNames = milestones
    .filter((m) => m.unlocked)
    .flatMap((m) => m.unlocks);

  const canCompleteCurrentMilestone = currentMilestone
    ? Object.entries(currentMilestone.requirements || {}).every(
        ([itemId, requiredAmount]) => {
          if (itemId === "discoveredNodes") {
            return discoveredCount >= requiredAmount;
          }
          return (inventory[itemId]?.currentAmount || 0) >= requiredAmount;
        }
      )
    : false;

  const completeCurrentMilestone = () => {
    if (!currentMilestone || !canCompleteCurrentMilestone) return null;
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === currentMilestone.id ? { ...m, unlocked: true } : m
      )
    );
    setActiveMilestone(currentMilestone.id);
    return `Milestone reached: ${currentMilestone.name}`;
  };


  return {
    milestones,
    activeMilestone,
    currentMilestone,
    unlockedMachineNames,
    canCompleteCurrentMilestone,
    completeCurrentMilestone,
    setMilestones,
    setActiveMilestone,
  };
}

export default useMilestone;
