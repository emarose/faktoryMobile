

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
import { useToastContext } from "./ToastContext";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // Initialize nodeAmounts for all nodes if not present
  useEffect(() => {
    setNodeAmounts((prev) => {
      const updated = { ...prev };
      allResourceNodes.forEach((node) => {
        if (typeof updated[node.id] !== "number") {
          updated[node.id] =
            typeof node.currentAmount === "number"
              ? node.currentAmount
              : node.capacity || 50;
        }
      });
      return updated;
    });
  }, [allResourceNodes, setNodeAmounts]);

  // Node depletion callback for mining
  const handleDepleteNode = (nodeId, newAmount, isManual = false) => {
    setNodeAmounts((prev) => {
      const updated = { ...prev, [nodeId]: Math.max(0, newAmount) };
      return updated;
    });
    if (isManual) {
      const node = allResourceNodes.find((n) => n.id === nodeId);
      const nodeDefinition = node && node.type ? require("../data/items").items[node.type] : null;
      if (nodeDefinition && nodeDefinition.output) {
        const resourceId = Object.keys(nodeDefinition.output)[0];
        addResource(resourceId, 1, nodeId);
      }
    }
  };
  const [nodeAmounts, setNodeAmounts] = useState({});
  const { allResourceNodes } = useMapNodes();
  const [resourceNodes, setResourceNodes] = useState([]);

  useEffect(() => {
    setResourceNodes(allResourceNodes);
  }, [allResourceNodes]);

  const [playerMapPosition, setPlayerMapPosition] = useState({ x: 5, y: 5 });
  const [discoveredNodes, setDiscoveredNodes] = useState({});
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
  const { showToast } = useToastContext();
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

  // Automatic mining effect for assigned miners (must be after placedMachines and allResourceNodes are defined)
  useEffect(() => {
    if (!placedMachines || !allResourceNodes) return;
    const interval = setInterval(() => {
      if (!Array.isArray(placedMachines) || !Array.isArray(allResourceNodes)) return;
      placedMachines.forEach((machine) => {
        if (machine.type !== "miner" || !machine.assignedNodeId) return;
        const node = allResourceNodes.find((n) => n.id === machine.assignedNodeId);
        if (!node) return;
        const nodeCap = typeof node.capacity === "number" ? node.capacity : 50;
        const nodeAmount = nodeAmounts[node.id] ?? nodeCap;
        if (nodeAmount <= 0) return; // Node depleted
        const nodeDefinition = node && node.type ? require("../data/items").items[node.type] : null;
        if (!nodeDefinition || !nodeDefinition.output) return;
        const resourceId = Object.keys(nodeDefinition.output)[0];
        const outputAmount = nodeDefinition.output[resourceId] * (machine.efficiency || 1);
        handleDepleteNode(node.id, nodeAmount - 1, false);
        addResource(resourceId, outputAmount, node.id);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [Array.isArray(placedMachines) ? placedMachines.length : 0, Array.isArray(allResourceNodes) ? allResourceNodes.length : 0, nodeAmounts]);

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
      nodeAmounts,
      setNodeAmounts,
      handleDepleteNode,
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
