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
import { useMapNodes } from "../hooks/useGeneratedMapNodes";
import useMilestone from "../hooks/useMilestone";
import { useToastContext } from "./ToastContext";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  useEffect(() => {
    setNodeAmounts((prev) => {
      const updated = { ...prev };
      allResourceNodes.forEach((node) => {
        if (typeof updated[node.id] !== "number") {
          updated[node.id] =
            typeof node.currentAmount === "number"
              ? node.currentAmount
              : node.capacity || 1000;
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
  const [playerMapPosition, setPlayerMapPosition] = useState({ x: 5, y: 5 });
  // allResourceNodes ahora depende de la posición del jugador
  const { allResourceNodes, regenerateSeed: baseRegenerateSeed } = useMapNodes(playerMapPosition);

  // Función extendida para regenerar el seed y limpiar el estado relacionado
  const regenerateSeed = () => {
    baseRegenerateSeed();
    setNodeAmounts({});
    setDiscoveredNodes({});
    setToastShownNodeIds(new Set());
    // Opcional: podrías resetear la posición del jugador si quieres
    // setPlayerMapPosition({ x: 5, y: 5 });
  };
  const [resourceNodes, setResourceNodes] = useState([]);

  useEffect(() => {
    setResourceNodes(allResourceNodes);
  }, [allResourceNodes]);

  // (ya definido arriba)
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

  const { placedMachines, setPlacedMachines, mineableNodes, placeMachine, pauseMiner, resumeMiner } =
    useMachines(inventory, removeResources, allResourceNodes);

  // Depletion/production global: siempre activo
  useProduction(
    addResource,
    removeResources,
    placedMachines,
    allResourceNodes,
    nodeAmounts,
    handleDepleteNode
  );

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
        if (machine.isIdle) return; // No producir si está en idle
        const node = allResourceNodes.find((n) => n.id === machine.assignedNodeId);
        if (!node) return;
        const nodeCap = typeof node.capacity === "number" ? node.capacity : 1000;
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

  // Cola de crafting global
  const [craftingQueue, setCraftingQueue] = useState([]);

  const addToCraftingQueue = ({ machineId, recipeId, amount, processingTime, itemName }) => {
    const now = Date.now();
    const queue = [];
    for (let i = 0; i < amount; i++) {
      const lastEnd = queue.length > 0 ? queue[queue.length - 1].endsAt : (craftingQueue.length > 0 ? craftingQueue[craftingQueue.length - 1].endsAt : now);
      const start = i === 0 && craftingQueue.length === 0 ? now : lastEnd;
      queue.push({
        id: `${machineId}_${recipeId}_${now}_${i}`,
        machineId,
        recipeId,
        itemName,
        startedAt: start,
        endsAt: start + processingTime * 1000,
        processingTime,
        status: 'pending',
      });
    }
    setCraftingQueue(prev => [...prev, ...queue]);
  };

  const updateCraftingQueue = () => {
    const now = Date.now();
    setCraftingQueue(prev => prev.map(proc => {
      if (proc.status === 'pending' && now >= proc.endsAt) {
        return { ...proc, status: 'done' };
      }
      return proc;
    }));
  };

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
  craftingQueue,
  setCraftingQueue,
  addToCraftingQueue,
  updateCraftingQueue,
  pauseMiner,
  resumeMiner,
  regenerateSeed,
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
