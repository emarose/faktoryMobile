import React, {
  useEffect,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useInventory } from "../hooks/useInventory";
import { useMachines } from "../hooks/useMachines";
import { useProduction } from "../hooks/useProduction";
import { useBuilding } from "../hooks/useBuilding";
import { useMining } from "../hooks/useMining";
import useCrafting from "../hooks/useCrafting";
import useProductionRate from "../hooks/useProductionRate";
import { useMapNodes } from "../hooks/useMapNodes";
import useMilestone from "../hooks/useMilestone";
import { useToast } from "./ToastContext";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { allResourceNodes } = useMapNodes();
  const [resourceNodes, setResourceNodes] = useState([]);

  useEffect(() => {
    setResourceNodes(allResourceNodes);
  }, [allResourceNodes]);

  const [playerMapPosition, setPlayerMapPosition] = useState({ x: 5, y: 5 });
  const [discoveredNodes, setDiscoveredNodes] = useState({});
  // Track all nodeIds for which toast was dismissed
  const [dismissedNodeIds, setDismissedNodeIds] = useState(new Set());
  const [toastShownNodeIds, setToastShownNodeIds] = useState(new Set());

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

  const { placedMachines, setPlacedMachines, mineableNodes, placeMachine } =
    useMachines(inventory, removeResources, allResourceNodes);

  useProduction(addResource, removeResources, placedMachines, allResourceNodes);

  const { buildItem } = useBuilding(
    addResource,
    removeResources,
    buildableItems,
    addMachine
  );

  const { mineResource } = useMining(
    addResource,
    allResourceNodes,
    placedMachines,
    inventory
  );

  const { craftItem, activeCrafts } = useCrafting(
    inventory,
    ownedMachines,
    addResource,
    removeResources,
    canAfford,
    addMachine
  );

  const { getProductionRate } = useProductionRate(placedMachines);
  const { showToast } = useToast();
  const discoveredNodesCount = Object.keys(discoveredNodes).length;
  const {
    milestones,
    canCompleteCurrentMilestone,
    completeCurrentMilestone,
    activeMilestone,
    currentMilestone,
    unlockedMachineNames,
    setMilestones,
    setActiveMilestone,
  } = useMilestone(inventory, discoveredNodesCount);

  useEffect(() => {
    if (canCompleteCurrentMilestone) {
      Promise.resolve().then(() => {
        const message = completeCurrentMilestone();
        if (message) {
          showToast(message);
        }
      });
    }
  }, [
    canCompleteCurrentMilestone,
    completeCurrentMilestone,
    showToast,
    discoveredNodesCount,
  ]);

  const contextValue = useMemo(
    () => ({
      inventory,
      allResourceNodes,
      ownedMachines,
      mineableNodes,
      buildableItems,
      resourceNodes,
      setResourceNodes,
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
      playerMapPosition,
      setPlayerMapPosition,
      discoveredNodes,
      setDiscoveredNodes,
      milestones,
      canCompleteCurrentMilestone,
      completeCurrentMilestone,
      activeMilestone,
      currentMilestone,
      unlockedMachineNames,
      setMilestones,
      setActiveMilestone,
      toastShownNodeIds,
      setToastShownNodeIds,
    }),
    [
      inventory,
      ownedMachines,
      mineableNodes,
      buildableItems,
      resourceNodes,
      setResourceNodes,
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
      playerMapPosition,
      setPlayerMapPosition,
      discoveredNodes,
      setDiscoveredNodes,
      milestones,
      canCompleteCurrentMilestone,
      completeCurrentMilestone,
      activeMilestone,
      currentMilestone,
      unlockedMachineNames,
      setMilestones,
      setActiveMilestone,
      toastShownNodeIds,
      setToastShownNodeIds,
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
