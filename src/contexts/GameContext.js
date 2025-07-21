// contexts/GameContext.js
import React, { createContext, useContext, useMemo } from "react";
import { useInventory } from "../hooks/useInventory";
import { useMachines } from "../hooks/useMachines";
import { useProduction } from "../hooks/useProduction";
import { useBuilding } from "../hooks/useBuilding";
import { useMining } from "../hooks/useMining";
import { useCrafting } from "../hooks/useCrafting"; // Import the new hook

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // Static data like allResourceNodes are defined here or in a separate data file
  // and passed down. Keeping it here for simplicity.
  const allResourceNodes = useMemo(
    () => [
      {
        id: "ironNode1",
        name: "Iron Ore Node",
        type: "ironOre_node",
        x: 100,
        y: 100,
      },
      {
        id: "copperNode1",
        name: "Copper Ore Node",
        type: "copperOre_node",
        x: 200,
        y: 150,
      },
      {
        id: "limestoneNode1",
        name: "Limestone Node",
        type: "limestone_node",
        x: 300,
        y: 200,
      },
      { id: "coalNode1", name: "Coal Node", type: "coal_node", x: 150, y: 250 },
      {
        id: "cateriumNode1",
        name: "Caterium Ore Node",
        type: "cateriumOre_node",
        x: 400,
        y: 100,
      },
      {
        id: "rawQuartzNode1",
        name: "Raw Quartz Node",
        type: "rawQuartz_node",
        x: 500,
        y: 200,
      },
      {
        id: "sulfurNode1",
        name: "Sulfur Node",
        type: "sulfur_node",
        x: 250,
        y: 300,
      },
      {
        id: "crudeOilNode1",
        name: "Crude Oil Node",
        type: "crudeOil_node",
        x: 350,
        y: 400,
      },
      {
        id: "bauxiteNode1",
        name: "Bauxite Node",
        type: "bauxite_node",
        x: 100,
        y: 450,
      },
      {
        id: "uraniumNode1",
        name: "Uranium Node",
        type: "uranium_node",
        x: 550,
        y: 350,
      },
    ],
    []
  );

  const {
    inventory, // This is inventoryState.items
    ownedMachines, // This is inventoryState.ownedMachines
    addResource,
    removeResources,
    getInventoryItem,
    canAfford,
    buildableItems,
    addMachine,
  } = useInventory();

  const { placedMachines, mineableNodes, placeMachine } = useMachines(
    inventory, // This is `inventoryState.items`
    removeResources,
    allResourceNodes
  );

  useProduction(addResource, removeResources, placedMachines, allResourceNodes);

  const { buildItem } = useBuilding(
    addResource,
    removeResources,
    buildableItems,
    addMachine // <--- Pass addMachine so useBuilding can add machines to ownedMachines
  );

  const { mineResource } = useMining(addResource, allResourceNodes);

  const { craftItem } = useCrafting(
    inventory, // Pass inventory (which is inventoryState.items)
    ownedMachines, // Pass ownedMachines explicitly
    addResource,
    removeResources,
    canAfford,
    addMachine
  );

  const contextValue = useMemo(
    () => ({
      inventory, // Expose the items object
      ownedMachines, // <--- Expose ownedMachines
      mineableNodes,
      buildableItems,
      allResourceNodes,
      placedMachines,
      addResource,
      removeResources,
      getInventoryItem,
      canAfford,
      mineResource,
      buildItem,
      placeMachine,
      craftItem,
      addMachine, // <--- Expose addMachine
    }),
    [
      inventory,
      ownedMachines, // <--- Add to dependencies
      mineableNodes,
      buildableItems,
      allResourceNodes,
      placedMachines,
      addResource,
      removeResources,
      getInventoryItem,
      canAfford,
      mineResource,
      buildItem,
      placeMachine,
      craftItem,
      addMachine, // <--- Add to dependencies
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
