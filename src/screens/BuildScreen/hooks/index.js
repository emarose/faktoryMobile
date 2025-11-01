// Helpers for BuildScreen: sorting buildable items and machine icon mapping
export const getMachineIcon = (machineId) => {
  const icons = {
    miner: "robot-industrial",
    smelter: "fire",
    constructor: "hammer-wrench",
    assembler: "cog",
    foundry: "anvil",
    manufacturer: "factory",
    refinery: "chemical-weapon",
    oilExtractor: "oil-lamp",
  };
  return icons[machineId] || "cog";
};

export const getSortedBuildable = (buildableItems = [], unlockedMachineNames = [], milestones = []) => {
  return buildableItems
    .map((item) => {
      const isUnlocked = unlockedMachineNames.includes(item.name);
      const requiredMilestone = milestones.find(
        (milestone) =>
          milestone.unlockedMachines && milestone.unlockedMachines.includes(item.name)
      );
      return {
        ...item,
        isUnlocked,
        requiredMilestone: requiredMilestone || null,
      };
    })
    .sort((a, b) => {
      const fixedOrder = ["miner", "smelter", "constructor", "foundry", "assembler"];
      const aOrderIndex = fixedOrder.indexOf(a.id);
      const bOrderIndex = fixedOrder.indexOf(b.id);

      if (aOrderIndex !== -1 && bOrderIndex !== -1) {
        return aOrderIndex - bOrderIndex;
      }
      if (aOrderIndex !== -1 && bOrderIndex === -1) return -1;
      if (aOrderIndex === -1 && bOrderIndex !== -1) return 1;

      // For machines not in fixed order, use milestone-based ordering
      if (aOrderIndex === -1 && bOrderIndex === -1) {
        const aCanBuild = a.isUnlocked && a.canBuild;
        const bCanBuild = b.isUnlocked && b.canBuild;
        if (aCanBuild && !bCanBuild) return -1;
        if (!aCanBuild && bCanBuild) return 1;

        const aUnlockedOnly = a.isUnlocked && !a.canBuild;
        const bUnlockedOnly = b.isUnlocked && !b.canBuild;
        if (aUnlockedOnly && !bUnlockedOnly) return -1;
        if (!aUnlockedOnly && bUnlockedOnly) return 1;

        const aLocked = !a.isUnlocked;
        const bLocked = !b.isUnlocked;
        if (!aLocked && bLocked) return -1;
        if (aLocked && !bLocked) return 1;

        if (a.requiredMilestone && b.requiredMilestone) {
          const milestoneCompare = a.requiredMilestone.id - b.requiredMilestone.id;
          if (milestoneCompare !== 0) return milestoneCompare;
        }

        return a.name.localeCompare(b.name);
      }
    });
};
