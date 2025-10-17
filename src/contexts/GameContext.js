import React, {
  useEffect,
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useRef
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
import useStorage, { STORAGE_KEYS } from "../hooks/useStorage";
import RESOURCE_CAP from "../constants/ResourceCap";
import { items } from "../data/items";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // Storage system for saving/loading game data
  const { saveData, loadData, isLoading: isStorageLoading, deleteAllGameData } = useStorage();
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [saveTimestamp, setSaveTimestamp] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Inicializa nodeAmounts de forma síncrona cuando cambian los nodos
  const didMountNodes = React.useRef(false);
  useEffect(() => {
    if (!didMountNodes.current) {
      didMountNodes.current = true;
      return;
    }
    if (!allResourceNodes || allResourceNodes.length === 0) return;
    setNodeAmounts(() => {
      const newAmounts = {};
      allResourceNodes.forEach((node) => {
        newAmounts[node.id] =
          typeof node.currentAmount === "number"
            ? node.currentAmount
            : node.capacity || 1000;
      });
      return newAmounts;
    });
  }, [allResourceNodes]);

  // Node depletion callback for mining
  const handleDepleteNode = (nodeId, newAmount, isManual = false) => {
    setNodeAmounts((prev) => {
      const updated = { ...prev, [nodeId]: Math.max(0, newAmount) };
      return updated;
    });
    if (isManual) {
      const node = allResourceNodes.find((n) => n.id === nodeId);
      const nodeDefinition =
        node && node.type ? require("../data/items").items[node.type] : null;
      if (nodeDefinition && nodeDefinition.output) {
        const resourceId = Object.keys(nodeDefinition.output)[0];
        addResource(resourceId, 1, nodeId);
      }
    }
  };
  const [nodeAmounts, setNodeAmounts] = useState({});
  const [playerMapPosition, setPlayerMapPosition] = useState({ x: 5, y: 5 });
  // allResourceNodes ahora depende de la posición del jugador
  const {
    allResourceNodes,
    regenerateSeed: baseRegenerateSeed,
    setTestSeed: baseSetTestSeed,
    seed,
    setSeed
  } = useMapNodes(playerMapPosition);

  // Función extendida para regenerar el seed y limpiar el estado relacionado

  const resetNodeAmounts = (nodes) => {
    if (!nodes || nodes.length === 0) return;
    const newAmounts = {};
    nodes.forEach((node) => {
      newAmounts[node.id] =
        typeof node.capacity === "number" ? node.capacity : 1000;
    });
    setNodeAmounts(newAmounts);
  };

  const regenerateSeed = () => {
    baseRegenerateSeed();
    setDiscoveredNodes({});
    setToastShownNodeIds(new Set());
    // setPlayerMapPosition({ x: 5, y: 5 });
    // Reinicializar nodeAmounts tras cambio de seed
    resetNodeAmounts(allResourceNodes);
  };

  // Función para activar el seed de test y limpiar el estado relacionado
  const setTestSeed = () => {
    baseSetTestSeed();
    setDiscoveredNodes({});
    setToastShownNodeIds(new Set());
    // setPlayerMapPosition({ x: 5, y: 5 });
    resetNodeAmounts(allResourceNodes);
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
    updateOwnedMachine,
    setInventory
  } = useInventory(placedMachines, allResourceNodes);

  const {
    placedMachines,
    setPlacedMachines,
    mineableNodes,
    placeMachine,
    pauseMiner,
    resumeMiner,
  } = useMachines(inventory, removeResources, allResourceNodes);

  // Depletion/production global: siempre activo
  useProduction(
    addResource,
    removeResources,
    placedMachines,
    allResourceNodes,
    nodeAmounts,
    handleDepleteNode
  );

  const { showToast } = useToastContext();

  const { buildItem } = useBuilding(
    addResource,
    removeResources,
    buildableItems,
    addMachine,
    showToast
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
  const placedMachinesRef = React.useRef(placedMachines);
  useEffect(() => {
    placedMachinesRef.current = placedMachines;
  }, [placedMachines]);

  useEffect(() => {
    if (!placedMachines || !allResourceNodes) return;
    const interval = setInterval(() => {
      // Update crafting queue
      updateCraftingQueue();
      
      const machines = placedMachinesRef.current;
      if (!Array.isArray(machines) || !Array.isArray(allResourceNodes)) return;
      
      // Group active miners/extractors by node
      const machinesByNode = {};
      machines.forEach((machine) => {
        if ((machine.type !== "miner" && machine.type !== "oilExtractor") || !machine.assignedNodeId) return;
        if (machine.isIdle) return; // Skip idle machines
        
        if (!machinesByNode[machine.assignedNodeId]) {
          machinesByNode[machine.assignedNodeId] = [];
        }
        machinesByNode[machine.assignedNodeId].push(machine);
      });

      // Process each node with assigned machines
      Object.entries(machinesByNode).forEach(([nodeId, assignedMachines]) => {
        const node = allResourceNodes.find((n) => n.id === nodeId);
        if (!node) return;
        
        const nodeCap = typeof node.capacity === "number" ? node.capacity : 1000;
        const nodeAmount = nodeAmounts[node.id] ?? nodeCap;
        if (nodeAmount <= 0) {
          // Node depleted - system pause all machines on this node
          assignedMachines.forEach((machine) => {
            pauseMiner(machine.id, { system: true });
          });
          return;
        }
        
        const nodeDefinition = node && node.type ? require("../data/items").items[node.type] : null;
        if (!nodeDefinition || !nodeDefinition.output) return;
        
        const resourceId = Object.keys(nodeDefinition.output)[0];
        
        // Check if storage is full before mining
        const currentAmount = inventory[resourceId]?.currentAmount || 0;
        const isStorageFull = currentAmount >= RESOURCE_CAP;
        
        if (isStorageFull) {
          // Storage is full, system pause all miners on this node
          assignedMachines.forEach((machine) => {
            if (!machine.isIdle) {
              pauseMiner(machine.id, { system: true });
            }
          });
          return; // Skip resource generation
        }
        
        // Calculate total output from all machines on this node
        const totalOutput = assignedMachines.reduce((total, machine) => {
          return total + (nodeDefinition.output[resourceId] * (machine.efficiency || 1));
        }, 0);
        
        // Apply depletion (1 unit per active machine)
        const depletionAmount = assignedMachines.length;
        const newNodeAmount = Math.max(0, nodeAmount - depletionAmount);
        
        // Update node amount and add resources
        handleDepleteNode(node.id, newNodeAmount, false);
        addResource(resourceId, totalOutput, node.id);
        
        // If node becomes depleted, pause all machines
        if (newNodeAmount <= 0) {
          assignedMachines.forEach((machine) => {
            pauseMiner(machine.id, { system: true });
          });
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [allResourceNodes.length, JSON.stringify(nodeAmounts)]);

  useEffect(() => {
    if (canCompleteCurrentMilestone && !milestoneProcessing) {
      setMilestoneProcessing(true);

      // Use requestAnimationFrame to defer milestone processing
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            const message = completeCurrentMilestone();
            if (message) {
              showToast(message);
            }
          } catch (error) {
            console.error("Milestone completion error:", error);
          } finally {
            setMilestoneProcessing(false);
          }
        }, 100);
      });
    }
  }, [
    canCompleteCurrentMilestone,
    completeCurrentMilestone,
    showToast,
    discoveredNodesCount,
    milestoneProcessing,
  ]);

  // Effect to auto-resume miners when storage has space
  useEffect(() => {
    const interval = setInterval(() => {
      const machines = [...placedMachines, ...ownedMachines];
      const idleMiners = machines.filter(machine => 
        (machine.type === "miner" || machine.type === "oilExtractor") && 
        machine.isIdle && 
        machine.assignedNodeId
      );

      idleMiners.forEach((machine) => {
        const node = allResourceNodes.find(n => n.id === machine.assignedNodeId);
        if (!node) return;

        const nodeDefinition = node && node.type ? require("../data/items").items[node.type] : null;
        if (!nodeDefinition || !nodeDefinition.output) return;

        const resourceId = Object.keys(nodeDefinition.output)[0];
        const currentAmount = inventory[resourceId]?.currentAmount || 0;
        const nodeAmount = nodeAmounts[node.id] ?? (node.capacity || 1000);

        // Resume if storage has space and node is not depleted
        if (currentAmount < RESOURCE_CAP && nodeAmount > 0) {
          // Only resume systems-paused machines; user-paused machines remain paused
          resumeMiner(machine.id, { system: true });
        }
      });
    }, 2000); // Check every 2 seconds
    
    return () => clearInterval(interval);
  }, [placedMachines.length, ownedMachines.length, JSON.stringify(inventory), JSON.stringify(nodeAmounts)]);
  
  // Show toast when saving state changes
  useEffect(() => {
    // Skip showing toast on first load and only show when an autosave has happened
    if (isSaving && saveTimestamp !== null) {
      // Use setTimeout to avoid synchronous toast updates
      const toastTimer = setTimeout(() => {
        showToast("Saving game", 3000);
      }, 0);
      
      return () => clearTimeout(toastTimer);
    }
  }, [isSaving, saveTimestamp, showToast]);

  // Cola de crafting global
  const [craftingQueue, setCraftingQueue] = useState([]);
  const [milestoneProcessing, setMilestoneProcessing] = useState(false);

  const addToCraftingQueue = ({
    machineId,
    recipeId,
    amount,
    processingTime,
    itemName,
  }) => {
    const now = Date.now();
    const queue = [];
    
    // Find existing processes for this machine to calculate proper start times
    const existingMachineProcesses = craftingQueue.filter(
      proc => proc.machineId === machineId && proc.status === "pending"
    );
    
    let lastEndTime = now;
    if (existingMachineProcesses.length > 0) {
      // If there are existing processes, start after the last one
      lastEndTime = Math.max(...existingMachineProcesses.map(proc => proc.endsAt));
    }
    
    for (let i = 0; i < amount; i++) {
      const start = i === 0 ? lastEndTime : lastEndTime + (processingTime * 1000 * i);
      queue.push({
        id: `${machineId}_${recipeId}_${now}_${i}`,
        machineId,
        recipeId,
        itemName,
        startedAt: start,
        endsAt: start + processingTime * 1000,
        processingTime,
        status: "pending",
      });
    }
    setCraftingQueue((prev) => [...prev, ...queue]);
  };

  const updateCraftingQueue = () => {
    const now = Date.now();
    setCraftingQueue((prev) => {
      const updated = prev.map((proc) => {
        if (proc.status === "pending" && now >= proc.endsAt) {
          // Process completed - give rewards
          const recipe = require("../data/items").items[proc.recipeId];
          if (recipe && recipe.output) {
            // Handle both object and array outputs
            if (Array.isArray(recipe.output)) {
              recipe.output.forEach(output => {
                addResource(output.item, output.amount);
              });
            } else if (typeof recipe.output === 'object') {
              Object.entries(recipe.output).forEach(([item, amount]) => {
                addResource(item, amount);
              });
            }
          } else if (recipe && recipe.outputs) {
            recipe.outputs.forEach(output => {
              addResource(output.item, output.amount);
            });
          }
          
          return { ...proc, status: "done" };
        }
        return proc;
      });
      
      // Remove completed processes after a short delay to allow UI updates
      return updated.filter(proc => {
        if (proc.status === "done") {
          const timeSinceCompletion = now - proc.endsAt;
          return timeSinceCompletion < 2000; // Keep for 2 seconds after completion
        }
        return true;
      });
    });
  };

  const cancelCrafting = useCallback((machineId, processId = null) => {
    setCraftingQueue((prev) => {
      if (processId) {
        // Cancel specific process
        return prev.filter(proc => proc.id !== processId);
      } else {
        // Cancel all processes for the machine
        return prev.filter(proc => proc.machineId !== machineId);
      }
    });
  }, []);

  const pauseCrafting = useCallback((machineId) => {
    setCraftingQueue((prev) => prev.map(proc => {
      if (proc.machineId === machineId && proc.status === "pending") {
        return { ...proc, status: "paused", pausedAt: Date.now() };
      }
      return proc;
    }));
  }, []);

  const resumeCrafting = useCallback((machineId) => {
    setCraftingQueue((prev) => prev.map(proc => {
      if (proc.machineId === machineId && proc.status === "paused") {
        const pauseDuration = Date.now() - (proc.pausedAt || 0);
        const newStartedAt = (proc.startedAt || proc.endsAt - proc.processingTime * 1000) + pauseDuration;
        const newEndsAt = (proc.endsAt || newStartedAt + proc.processingTime * 1000) + pauseDuration;
        return { 
          ...proc, 
          status: "pending", 
          startedAt: newStartedAt,
          endsAt: newEndsAt,
          pausedAt: undefined
        };
      }
      return proc;
    }));
  }, []);

  // Detach a machine from its node and mark as user-paused
  const detachMachine = useCallback((machineId) => {
    setPlacedMachines((prev) =>
      prev.map((m) =>
        m.id === machineId ? { ...m, assignedNodeId: undefined, isIdle: true, pausedByUser: true } : m
      )
    );
  }, []);

  // Load game data
  const loadGameData = useCallback(async () => {
    try {
      console.log('Loading game data...');
      
      // Load player position
      const savedPlayerPosition = await loadData(STORAGE_KEYS.PLAYER_POSITION);
      if (savedPlayerPosition) {
        setPlayerMapPosition(savedPlayerPosition);
      }
      
      // Load map seed
      const savedSeed = await loadData(STORAGE_KEYS.MAP_SEED);
      if (savedSeed !== null && typeof savedSeed === 'number') {
        // Call setSeed function from useMapNodes
        // This should be accessed through our exposed function
        setSeed(savedSeed);
      }
      
      // Load discovered nodes
      const savedDiscoveredNodes = await loadData(STORAGE_KEYS.DISCOVERED_NODES, {});
      if (savedDiscoveredNodes) {
        setDiscoveredNodes(savedDiscoveredNodes);
      }
      
      // Load toast shown nodes
      const savedToastShownNodeIds = await loadData(STORAGE_KEYS.TOAST_SHOWN_NODE_IDS, []);
      if (savedToastShownNodeIds) {
        setToastShownNodeIds(new Set(savedToastShownNodeIds));
      }
      
      // Wait for nodes to be generated before loading node amounts
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      // Load node amounts
      const savedNodeAmounts = await loadData(STORAGE_KEYS.NODE_AMOUNTS, {});
      if (savedNodeAmounts && Object.keys(savedNodeAmounts).length > 0) {
        setNodeAmounts(prev => ({...prev, ...savedNodeAmounts}));
      }
      
      // Load milestones
      const savedMilestones = await loadData(STORAGE_KEYS.MILESTONES);
      if (savedMilestones) {
        setMilestones(savedMilestones.milestones);
        setActiveMilestone(savedMilestones.activeMilestone);
      }
      
      // Load inventory and machines
      const savedInventory = await loadData(STORAGE_KEYS.INVENTORY);
      if (savedInventory) {
        // These are set through the useInventory hook
        setInventory(savedInventory);
      }
      
      // Load placed machines
      const savedMachines = await loadData(STORAGE_KEYS.MACHINES, []);
      if (savedMachines) {
        setPlacedMachines(savedMachines);
      }
      
      // Load crafting queue
      const savedCraftingQueue = await loadData(STORAGE_KEYS.CRAFTING_QUEUE, []);
      if (savedCraftingQueue) {
        setCraftingQueue(savedCraftingQueue);
      }
      
      console.log('Game data loaded successfully');
      setIsGameLoaded(true);
    } catch (error) {
      console.error('Error loading game data:', error);
    }
  }, [loadData]);

  // Auto-save game data periodically
  useEffect(() => {
    if (!isGameLoaded) return;

    const saveGameState = async () => {
      try {
        // Flag that saving has started but don't show toast immediately
        setIsSaving(true);
        
        await Promise.all([
          saveData(STORAGE_KEYS.PLAYER_POSITION, playerMapPosition),
          saveData(STORAGE_KEYS.DISCOVERED_NODES, discoveredNodes),
          saveData(STORAGE_KEYS.NODE_AMOUNTS, nodeAmounts),
          saveData(STORAGE_KEYS.MILESTONES, {
            milestones,
            activeMilestone
          }),
          saveData(STORAGE_KEYS.INVENTORY, {
            items: inventory,
            ownedMachines
          }),
          saveData(STORAGE_KEYS.MACHINES, placedMachines),
          saveData(STORAGE_KEYS.CRAFTING_QUEUE, craftingQueue),
          saveData(STORAGE_KEYS.MAP_SEED, seed),
          saveData(STORAGE_KEYS.TOAST_SHOWN_NODE_IDS, Array.from(toastShownNodeIds))
        ]);

        setSaveTimestamp(new Date());
      } catch (error) {
        console.error('Error saving game state:', error);
        // Only show error toast, not success toast
        showToast("Error saving game!", 3000);
      } finally {
        setIsSaving(false);
      }
    };

    // Save every 30 seconds
    const saveInterval = setInterval(saveGameState, 30000);
    
    // Save on first load with a slight delay
    const initialSaveTimeout = setTimeout(saveGameState, 1000);

    return () => {
      clearInterval(saveInterval);
      clearTimeout(initialSaveTimeout);
      // Save when unmounting - but don't trigger the toast
      const unmountSave = async () => {
        try {
          await Promise.all([
            saveData(STORAGE_KEYS.PLAYER_POSITION, playerMapPosition),
            saveData(STORAGE_KEYS.DISCOVERED_NODES, discoveredNodes),
            saveData(STORAGE_KEYS.NODE_AMOUNTS, nodeAmounts),
            saveData(STORAGE_KEYS.MILESTONES, {
              milestones,
              activeMilestone
            }),
            saveData(STORAGE_KEYS.INVENTORY, {
              items: inventory,
              ownedMachines
            }),
            saveData(STORAGE_KEYS.MACHINES, placedMachines),
            saveData(STORAGE_KEYS.CRAFTING_QUEUE, craftingQueue),
            saveData(STORAGE_KEYS.MAP_SEED, seed),
            saveData(STORAGE_KEYS.TOAST_SHOWN_NODE_IDS, Array.from(toastShownNodeIds))
          ]);
        } catch (error) {
          console.error('Error saving game state on unmount:', error);
        }
      };
      unmountSave();
    };
  }, [isGameLoaded, saveData]);

  // Function for manual saving
  const saveGameManually = useCallback(async () => {
    try {
      setIsSaving(true);
      
      await Promise.all([
        saveData(STORAGE_KEYS.PLAYER_POSITION, playerMapPosition),
        saveData(STORAGE_KEYS.DISCOVERED_NODES, discoveredNodes),
        saveData(STORAGE_KEYS.NODE_AMOUNTS, nodeAmounts),
        saveData(STORAGE_KEYS.MILESTONES, {
          milestones,
          activeMilestone
        }),
        saveData(STORAGE_KEYS.INVENTORY, {
          items: inventory,
          ownedMachines
        }),
        saveData(STORAGE_KEYS.MACHINES, placedMachines),
        saveData(STORAGE_KEYS.CRAFTING_QUEUE, craftingQueue),
        saveData(STORAGE_KEYS.MAP_SEED, seed),
        saveData(STORAGE_KEYS.TOAST_SHOWN_NODE_IDS, Array.from(toastShownNodeIds))
      ]);
      
      setSaveTimestamp(new Date());
      return true;
    } catch (error) {
      console.error('Error saving game manually:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [saveData, playerMapPosition, discoveredNodes, nodeAmounts, milestones, 
      activeMilestone, inventory, ownedMachines, placedMachines, craftingQueue, 
      seed, toastShownNodeIds]);

  // Reset game data (for starting a new game)
  const resetGameData = useCallback(async () => {
    try {
      console.log('Resetting game data...');
      await deleteAllGameData();
      
      // Reset all state to initial values
      setPlayerMapPosition({ x: 5, y: 5 });
      setDiscoveredNodes({});
      setToastShownNodeIds(new Set());
      regenerateSeed();
      
      // Reset inventory to initial state
      const initialInventoryState = {
        items: {},
        ownedMachines: []
      };
      
      // Initialize items with default values
      Object.keys(items).forEach((key) => {
        if (!key.endsWith("_node")) {
          initialInventoryState.items[key] = {
            id: key,
            name: items[key].name,
            description: items[key].description,
            icon: items[key].icon,
            type: items[key].type,
            currentAmount: 0,
          };
        }
      });

      // Reset inventory using the setter from useInventory
      setInventory(initialInventoryState);
      
      // Reset placed machines
      setPlacedMachines([]);
      
      // Reset crafting queue
      setCraftingQueue([]);
      
      // Reset milestones
      const defaultMilestones = require('../data/milestones').default;
      setMilestones(defaultMilestones);
      setActiveMilestone(defaultMilestones[0].id);
      
      console.log('Game data reset successfully');
      return true;
    } catch (error) {
      console.error('Error resetting game data:', error);
      return false;
    }
  }, [deleteAllGameData]);

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
      updateOwnedMachine,
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
      cancelCrafting,
      pauseCrafting,
      resumeCrafting,
      pauseMiner,
      resumeMiner,
      detachMachine,
      regenerateSeed,
      setTestSeed,
      // New save-related functionality
      isGameLoaded,
      loadGameData,
      resetGameData,
      saveTimestamp,
      saveGameManually
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
      updateOwnedMachine,
      getProductionRate,
      playerMapPosition,
      setPlayerMapPosition,
      discoveredNodes,
      setDiscoveredNodes,
      craftingQueue,
      setCraftingQueue,
      nodeAmounts,
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
      isGameLoaded,
      loadGameData,
      resetGameData,
      saveTimestamp,
      saveGameManually
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
