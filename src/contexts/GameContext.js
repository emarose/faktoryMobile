import React, { createContext, useContext, useMemo } from "react";
import { useMapNodes } from "../hooks/useMapNodes";
import { useInventory } from "../hooks/useInventory";
import { useMachines } from "../hooks/useMachines";
import { useProduction } from "../hooks/useProduction";
import { useBuilding } from "../hooks/useBuilding";
import { useMining } from "../hooks/useMining";
import useCrafting from "../hooks/useCrafting";
import useProductionRate from "../hooks/useProductionRate";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { allResourceNodes } = useMapNodes();

  const {
    inventory,
    ownedMachines,
    addResource,
    removeResources,
    getInventoryItem,
    canAfford,
    buildableItems,
    addMachine,
  } = useInventory(placedMachines, allResourceNodes);

  const { placedMachines, setPlacedMachines, mineableNodes, placeMachine } = useMachines(
    inventory,
    removeResources,
    allResourceNodes
  );

  useProduction(addResource, removeResources, placedMachines, allResourceNodes);

  const { buildItem } = useBuilding(
    addResource,
    removeResources,
    buildableItems,
    addMachine
  );

  const { mineResource } = useMining(addResource, allResourceNodes, placedMachines, inventory);

  const { craftItem, activeCrafts } = useCrafting(
    inventory,
    ownedMachines,
    addResource,
    removeResources,
    canAfford,
    addMachine
  );

  const { getProductionRate } = useProductionRate(placedMachines);

  const contextValue = useMemo(
    () => ({
      inventory,
      ownedMachines,
      mineableNodes,
      buildableItems,
      allResourceNodes,
      placedMachines,
      setPlacedMachines,
      addResource,
      removeResources,
      getInventoryItem,
      canAfford,
      mineResource,
      buildItem,
      placeMachine,
      craftItem,
      activeCrafts,
      addMachine,
      getProductionRate,
    }),
    [
      inventory,
      ownedMachines,
      mineableNodes,
      buildableItems,
      allResourceNodes,
      placedMachines,
      setPlacedMachines,
      addResource,
      removeResources,
      getInventoryItem,
      canAfford,
      mineResource,
      buildItem,
      placeMachine,
      craftItem,
      activeCrafts,
      addMachine,
      getProductionRate,
    ]
  );

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
