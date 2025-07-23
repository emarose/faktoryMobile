import { useCallback } from "react";
// No es necesario importar 'items' aquí si 'buildableItems' ya viene pre-calculado

export const useBuilding = (
  addResourceCallback,
  removeResourcesCallback,
  buildableItems, // Este array ya contiene la información de los ítems construibles y si se pueden construir
  addMachine // La función para añadir un tipo de máquina a la lista de poseídas
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

      // Añadir el ítem construido al inventario (si es un ítem consumible o un producto)
      // Para máquinas, esto significa que tienes una "máquina" en tu inventario de ítems.
      const quantityBuilt = itemToBuild.output?.[itemId] || 1;
      addResourceCallback(itemId, quantityBuilt);

      // CRÍTICO: Si el ítem construido es una máquina/edificio, también añadirlo a la lista de máquinas poseídas
      if (itemToBuild.type === "buildable" || itemToBuild.type === "machine") {
        console.log(
          "DEBUG: Intentando añadir máquina. itemToBuild:",
          itemToBuild
        );
        addMachine(itemId); // Llama a la función addMachine para actualizar ownedMachines
        console.log(
          `Máquina construida: ${itemToBuild.name}. Añadida a ownedMachines.`
        );
      }

      console.log(
        `Construido exitosamente ${itemToBuild.name}! Añadido al inventario.`
      );
      return true;
    },
    [addResourceCallback, removeResourcesCallback, buildableItems, addMachine] // Añadir addMachine a las dependencias
  );

  return {
    buildItem,
  };
};
