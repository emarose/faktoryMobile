import { useCallback } from "react";

export const useBuilding = (
  addResourceCallback,
  removeResourcesCallback,
  buildableItems,
  addMachine,
  showToast
) => {
  const buildItem = useCallback(
    (itemId) => {
      const itemToBuild = buildableItems.find((item) => item.id === itemId);

      if (!itemToBuild || !itemToBuild.canBuild) {
        console.warn(
          `No se puede construir ${
            itemToBuild?.name || itemId
          }: Recursos insuficientes o no es un ítem construible.`
        );
        return false;
      }

      // Deducir recursos
      const deducted = removeResourcesCallback(itemToBuild.inputs);
      if (!deducted) {
        console.warn(
          `Fallo al deducir recursos para ${itemToBuild.name}. Esto no debería ocurrir si canBuild es true.`
        );
        return false;
      }

      const quantityBuilt = itemToBuild.output?.[itemId] || 1;
      addResourceCallback(itemId, quantityBuilt);

      if (itemToBuild.type === "buildable" || itemToBuild.type === "machine") {
        addMachine(itemId);
      }

      // Show toast notification instead of console.log
      if (showToast) {
        const isMachine = itemToBuild.type === "buildable" || itemToBuild.type === "machine";
        const icon = isMachine ? "🏭" : "🔧";
        showToast(`${icon} ${itemToBuild.name} constructed successfully!`, 2500);
      }
      
      return true;
    },
    [addResourceCallback, removeResourcesCallback, buildableItems, addMachine, showToast]
  );

  return {
    buildItem,
  };
};
