import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { items } from "../data/items"; // Ensure this path is correct

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [inventory, setInventory] = useState(() => {
    const initialInventory = {};
    // Initialize all items from items.js in the inventory with 0 amount
    Object.keys(items).forEach((key) => {
      // Exclude _node items from direct inventory display, as they are map points
      if (!key.endsWith("_node")) {
        initialInventory[key] = {
          id: key,
          name: items[key].name,
          description: items[key].description,
          icon: items[key].icon,
          type: items[key].type,
          currentAmount: 0,
        };
      }
    });

    // --- DEBUG/TEST: Give player initial resources to start building ---
    // Make sure these match the actual item IDs in your items.js
    if (initialInventory.ironOre) initialInventory.ironOre.currentAmount = 500;
    if (initialInventory.copperOre)
      initialInventory.copperOre.currentAmount = 500;
    if (initialInventory.limestone)
      initialInventory.limestone.currentAmount = 500;
    if (initialInventory.coal) initialInventory.coal.currentAmount = 200;

    // Uncommented these to ensure you have intermediate products for building machines
    if (initialInventory.ironIngot)
      initialInventory.ironIngot.currentAmount = 200;
    if (initialInventory.copperIngot)
      initialInventory.copperIngot.currentAmount = 100;
    if (initialInventory.ironPlates)
      initialInventory.ironPlates.currentAmount = 50;
    if (initialInventory.ironRods) initialInventory.ironRods.currentAmount = 50;
    if (initialInventory.wires) initialInventory.wires.currentAmount = 50;
    if (initialInventory.concrete) initialInventory.concrete.currentAmount = 20;

    // Ensure your buildable items (machines) also exist in the inventory initialized with 0
    if (initialInventory.miner) initialInventory.miner.currentAmount = 0;
    if (initialInventory.smelter) initialInventory.smelter.currentAmount = 0;
    if (initialInventory.constructor)
      initialInventory.constructor.currentAmount = 0;
    if (initialInventory.assembler)
      initialInventory.assembler.currentAmount = 0;
    if (initialInventory.manufacturer)
      initialInventory.manufacturer.currentAmount = 0;
    if (initialInventory.refinery) initialInventory.refinery.currentAmount = 0;
    if (initialInventory.foundry) initialInventory.foundry.currentAmount = 0;
    if (initialInventory.oilExtractor)
      initialInventory.oilExtractor.currentAmount = 0;
    // Add other buildable items you have (e.g., modularFrame, rotors)

    return initialInventory;
  });

  const [placedMachines, setPlacedMachines] = useState([]);
  const productionLoopRef = useRef(null);

  const allResourceNodes = useMemo(
    () => [
      // Memoize allResourceNodes as it's static
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
  ); // Empty dependency array because it's static data

  const mineableNodes = useMemo(() => {
    return allResourceNodes
      .filter(
        (node) =>
          items[node.type]?.manualMineable ||
          items[node.type]?.machineRequired === "miner"
      )
      .map((node) => {
        const itemDefinition = items[node.type];
        const outputResourceId = itemDefinition?.output
          ? Object.keys(itemDefinition.output)[0]
          : undefined;
        const outputItemDefinition = outputResourceId
          ? items[outputResourceId]
          : undefined;

        const assignedMiner = placedMachines.find(
          (m) => m.type === "miner" && m.assignedNodeId === node.id
        );
        const automatedProductionRate =
          assignedMiner && outputResourceId
            ? (itemDefinition.output[outputResourceId] || 0) *
              (assignedMiner.efficiency || 1)
            : 0;

        return {
          ...node,
          currentAmount: inventory[outputResourceId]?.currentAmount ?? 0,
          outputItemName: outputItemDefinition?.name || "Unknown",
          productionRate: automatedProductionRate,
          hasMiner: !!assignedMiner,
          canManualMine: itemDefinition?.manualMineable || false,
        };
      });
  }, [allResourceNodes, inventory, placedMachines]);

  // Production loop logic: This useEffect manages the game's "tick"
  useEffect(() => {
    const processProductionTick = () => {
      setInventory((prevInventory) => {
        const newInventory = { ...prevInventory };

        placedMachines.forEach((machine) => {
          // Miner production logic
          if (machine.type === "miner" && machine.assignedNodeId) {
            const node = allResourceNodes.find(
              (n) => n.id === machine.assignedNodeId
            );
            if (node && items[node.type]?.output) {
              for (const resourceId in items[node.type].output) {
                const amountProducedPerTick =
                  items[node.type].output[resourceId] *
                  (machine.efficiency || 1);
                // Ensure the resource exists in newInventory before trying to add
                if (newInventory[resourceId]) {
                  newInventory[resourceId] = {
                    ...newInventory[resourceId], // Maintain other properties
                    currentAmount:
                      newInventory[resourceId].currentAmount +
                      amountProducedPerTick,
                  };
                } else {
                  // Fallback: If resource somehow isn't in inventory, add it
                  newInventory[resourceId] = {
                    id: resourceId,
                    name: items[resourceId]?.name || resourceId,
                    description: items[resourceId]?.description || "",
                    icon: items[resourceId]?.icon || "",
                    type: items[resourceId]?.type || "rawMaterial",
                    currentAmount: amountProducedPerTick,
                  };
                }
              }
            }
          }

          // Smelter production logic (example, needs to be expanded for all machine types)
          if (machine.type === "smelter" && machine.recipeId) {
            const recipe = items[machine.recipeId]; // Assuming recipes are defined in items.js
            if (
              recipe &&
              recipe.inputs &&
              recipe.output &&
              recipe.processingTime
            ) {
              let canProcess = true;
              // Check if all inputs are available *before* consuming
              for (const inputId in recipe.inputs) {
                if (
                  (newInventory[inputId]?.currentAmount || 0) <
                  recipe.inputs[inputId]
                ) {
                  canProcess = false;
                  break;
                }
              }

              if (canProcess) {
                // Consume inputs
                for (const inputId in recipe.inputs) {
                  newInventory[inputId] = {
                    ...newInventory[inputId],
                    currentAmount:
                      newInventory[inputId].currentAmount -
                      recipe.inputs[inputId],
                  };
                }
                // Produce outputs
                for (const outputId in recipe.output) {
                  newInventory[outputId] = {
                    ...newInventory[outputId],
                    currentAmount:
                      (newInventory[outputId]?.currentAmount || 0) +
                      recipe.output[outputId],
                  };
                }
              }
            }
          }
          // Add logic for other machine types (constructor, assembler, refinery, foundry, manufacturer, oilExtractor)
          // Each machine type will need its own logic to consume inputs and produce outputs based on its assigned recipe.
        });

        return newInventory;
      });
    };

    // Clear any existing interval before setting a new one
    if (productionLoopRef.current) {
      clearInterval(productionLoopRef.current);
    }

    productionLoopRef.current = setInterval(processProductionTick, 1000); // 1 second tick

    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => {
      if (productionLoopRef.current) {
        clearInterval(productionLoopRef.current);
      }
    };
  }, [placedMachines, allResourceNodes]); // IMPORTANT: Removed 'inventory' from dependencies!

  // Action for manual resource collection from a node
  const mineResource = useCallback(
    (nodeId) => {
      const node = allResourceNodes.find((n) => n.id === nodeId);
      if (!node || !items[node.type]?.manualMineable) {
        console.warn(
          `Node ${nodeId} is not manually mineable or does not exist.`
        );
        return;
      }

      setInventory((prevInventory) => {
        const newInventory = { ...prevInventory };
        const output = items[node.type].output;
        for (const resourceId in output) {
          if (newInventory[resourceId]) {
            newInventory[resourceId].currentAmount += output[resourceId];
          } else {
            console.warn(
              `Resource ${resourceId} not found in inventory definition, adding it.`
            );
            newInventory[resourceId] = {
              id: resourceId,
              name: items[resourceId]?.name || resourceId,
              description: items[resourceId]?.description || "",
              icon: items[resourceId]?.icon || "",
              type: items[resourceId]?.type || "rawMaterial",
              currentAmount: output[resourceId],
            };
          }
        }
        return newInventory;
      });
      console.log(`Mined from ${node.name}!`);
    },
    [allResourceNodes]
  ); // allResourceNodes is stable, setInventory is stable

  // Action to build a machine or component
  const buildItem = useCallback(
    (itemId) => {
      const itemToBuild = items[itemId]; // Access directly from items static object

      if (!itemToBuild || itemToBuild.type !== "buildable") {
        console.warn(`Attempted to build a non-buildable item: ${itemId}`);
        return false;
      }

      const requiredInputs = itemToBuild.inputs || {};
      for (const inputId in requiredInputs) {
        // Use inventory from closure, but for the check, rely on current state via functional update
        // Or, more robustly, use a `find` on `buildableItems` if it's already computed with `canBuild`
        if (
          (inventory[inputId]?.currentAmount || 0) < requiredInputs[inputId]
        ) {
          console.warn(
            `Not enough ${items[inputId]?.name || inputId} to build ${
              itemToBuild.name
            }. Missing: ${
              requiredInputs[inputId] - (inventory[inputId]?.currentAmount || 0)
            }`
          );
          return false;
        }
      }

      setInventory((prevInventory) => {
        const newInventory = { ...prevInventory };

        for (const inputId in requiredInputs) {
          newInventory[inputId] = {
            ...newInventory[inputId],
            currentAmount:
              newInventory[inputId].currentAmount - requiredInputs[inputId],
          };
        }

        const quantityBuilt = itemToBuild.output?.[itemId] || 1;
        newInventory[itemId] = {
          ...newInventory[itemId],
          currentAmount:
            (newInventory[itemId]?.currentAmount || 0) + quantityBuilt,
        };
        return newInventory;
      });

      console.log(
        `Successfully built ${itemToBuild.name}! Added to inventory.`
      );
      return true;
    },
    [inventory, items]
  ); // Depends on inventory (for checks) and items (for definitions)

  // Action to place a machine from inventory onto the world/map
  const placeMachine = useCallback(
    (machineIdInInventory, targetNodeId = null, recipeId = null) => {
      if ((inventory[machineIdInInventory]?.currentAmount || 0) <= 0) {
        console.warn(
          `No ${
            items[machineIdInInventory]?.name || machineIdInInventory
          } in inventory to place.`
        );
        return false;
      }

      const machineTypeData = items[machineIdInInventory];
      if (!machineTypeData || machineTypeData.type !== "buildable") {
        console.warn(
          `${machineIdInInventory} is not a valid machine type to place.`
        );
        return false;
      }

      if (machineTypeData.id === "miner") {
        if (!targetNodeId) {
          console.warn("A Miner must be assigned to a resource node.");
          return false;
        }
        const node = allResourceNodes.find((n) => n.id === targetNodeId);
        if (!node) {
          console.warn(`Node ${targetNodeId} not found.`);
          return false;
        }
        if (placedMachines.some((m) => m.assignedNodeId === targetNodeId)) {
          console.warn(
            `Node ${node.name} (${targetNodeId}) already has a Miner assigned.`
          );
          return false;
        }
        if (
          items[node.type]?.machineRequired &&
          items[node.type].machineRequired !== "miner"
        ) {
          console.warn(
            `Cannot place Miner on ${node.name}. It requires an ${
              items[node.type].machineRequired || "unknown machine type"
            }.`
          );
          return false;
        }

        setInventory((prevInventory) => ({
          ...prevInventory,
          [machineIdInInventory]: {
            ...prevInventory[machineIdInInventory],
            currentAmount:
              prevInventory[machineIdInInventory].currentAmount - 1,
          },
        }));

        setPlacedMachines((prevPlaced) => [
          ...prevPlaced,
          {
            id: `miner-${Date.now()}`,
            type: "miner",
            assignedNodeId: targetNodeId,
            efficiency: machineTypeData.efficiency || 1,
          },
        ]);
        console.log(`Miner placed on ${node.name} (${targetNodeId})!`);
        return true;
      } else {
        // For other machines (Smelter, Constructor etc.)
        setInventory((prevInventory) => ({
          ...prevInventory,
          [machineIdInInventory]: {
            ...prevInventory[machineIdInInventory],
            currentAmount:
              prevInventory[machineIdInInventory].currentAmount - 1,
          },
        }));

        setPlacedMachines((prevPlaced) => [
          ...prevPlaced,
          {
            id: `${machineTypeData.id}-${Date.now()}`,
            type: machineTypeData.id,
            recipeId: recipeId, // Allow assigning a default recipe or null
          },
        ]);
        console.log(`${machineTypeData.name} placed!`);
        return true;
      }
    },
    [inventory, placedMachines, allResourceNodes, items]
  ); 

  // Modified buildableItems calculation for robustness
  const buildableItems = useMemo(() => {
    console.log("Recalculating buildableItems..."); // Uncomment for debugging if needed
    return Object.keys(items)
      .filter((key) => items[key].type === "buildable")
      .map((key) => {
        const buildableItem = items[key];
        const requiredInputs = buildableItem.inputs || {};
        let canBuild = true;
        const missingResources = {};

        for (const inputId in requiredInputs) {
          const requiredAmount = requiredInputs[inputId];
          const currentAmount = inventory[inputId]?.currentAmount || 0;

          if (currentAmount < requiredAmount) {
            canBuild = false;
            missingResources[inputId] = requiredAmount - currentAmount;
          }
        }

        return {
          id: key,
          ...buildableItem,
          inputs: requiredInputs,
          canBuild: canBuild,
          missingResources: missingResources,
        };
      });
  }, [inventory]); // Correct dependency: only recalculate when inventory changes. 'items' is a static import.

  // Memoize the context value itself for overall stability
  const contextValue = useMemo(
    () => ({
      inventory,
      mineableNodes,
      buildableItems,
      allResourceNodes,
      placedMachines,

      mineResource,
      buildItem,
      placeMachine,
    }),
    [
      inventory,
      mineableNodes,
      buildableItems,
      allResourceNodes,
      placedMachines,
      mineResource,
      buildItem,
      placeMachine,
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
