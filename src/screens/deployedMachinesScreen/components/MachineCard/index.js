import React, { useState, useMemo, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../../../components";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import ProgressBar from "../../../../components/ProgressBar";

import styles from "./styles";

import { useGame } from "../../../../contexts/GameContext";
import { useMachineColors } from "../../../../hooks";

// helper: resource icon mapping (returns MaterialCommunityIcons name)
function getResourceIcon(resourceType) {
  if (!resourceType) return "cube-outline";
  const t = resourceType.toLowerCase();
  if (t.includes("iron")) return "circle-slice-8";
  if (t.includes("copper")) return "hexagon-multiple";
  if (t.includes("coal")) return "fire";
  if (t.includes("oil")) return "oil";
  if (t.includes("limestone")) return "square-outline";
  if (t.includes("uranium")) return "radioactive";
  return "cube-outline";
}

function getResourceColor(resourceType) {
  if (!resourceType) return "#4CAF50";
  const t = resourceType.toLowerCase();
  if (t.includes("iron")) return "#8B4513";
  if (t.includes("copper")) return "#CD7F32";
  if (t.includes("coal")) return "#2F2F2F";
  if (t.includes("oil")) return "#6a4c93";
  if (t.includes("limestone")) return "#bfbfbf";
  if (t.includes("uranium")) return "#00c853";
  return "#4CAF50";
}

function getMachineIcon(type, color) {
  switch (type) {
    case "miner":
      return (
        <MaterialCommunityIcons
          name="robot-industrial"
          size={28}
          color={color}
        />
      );
    case "refinery":
      return (
        <MaterialCommunityIcons
          name="chemical-weapon"
          size={28}
          color={color}
        />
      );
    case "smelter":
      return <MaterialCommunityIcons name="factory" size={28} color={color} />;
    case "constructor":
      return <MaterialCommunityIcons name="cog" size={28} color={color} />;
    case "assembler":
      return <MaterialCommunityIcons name="wrench" size={28} color={color} />;
    case "manufacturer":
      return <MaterialCommunityIcons name="factory" size={28} color={color} />;
    case "foundry":
      return <MaterialCommunityIcons name="anvil" size={28} color={color} />;
    case "oilExtractor":
      return <MaterialCommunityIcons name="oil-lamp" size={28} color={color} />;
    default:
      return <MaterialIcons name="build" size={28} color={color || "#aaa"} />;
  }
}

const MachineCard = ({ machine, node, children, onPress, navigation, onPauseResume, onCancelCrafting }) => {
  const gameContext = useGame();
  const { 
    setPlacedMachines, 
    placedMachines = [], 
    craftingQueue = [], 
    allResourceNodes = [], 
    nodeAmounts = {} 
  } = gameContext || {};
  const { getMachineColor, getMachineColorWithOpacity } = useMachineColors();

  // Get machine color
  const machineColor = getMachineColor(machine.type);
  const machineColorBackground = getMachineColorWithOpacity(machine.type, 0.1);

  // Constants
  const MAX_MACHINES_PER_NODE = 4;

  // For miners and oil extractors - calculate node depletion progress
  const nodeDepletionData = useMemo(() => {
    try {
      if (machine?.type !== "miner" && machine?.type !== "oilExtractor") return null;
      if (!node || !machine?.assignedNodeId) return null;

      // Find all machines assigned to this node
      const assignedMachines = Array.isArray(placedMachines) ? placedMachines.filter(
        (m) => m && (m.type === "miner" || m.type === "oilExtractor") && 
               m.assignedNodeId === machine.assignedNodeId
      ) : [];

    // Get node data
    const nodeData = allResourceNodes.find(n => n.id === machine.assignedNodeId);
    if (!nodeData) return null;

    const nodeCap = typeof nodeData.capacity === "number" ? nodeData.capacity : 1000;
    const currentAmount = nodeAmounts[machine.assignedNodeId] ?? nodeCap;
    
    // Calculate how much has been mined (depletion progress)
    const minedAmount = nodeCap - currentAmount;
    const depletionProgress = nodeCap > 0 ? (minedAmount / nodeCap) * 100 : 0;
    
    // Count active machines
    const activeMachines = assignedMachines.filter(m => !m.isIdle);
    
    // Calculate combined mining rate
    const totalMiningRate = activeMachines.reduce((total, m) => {
      const efficiency = m.efficiency || 1;
      return total + efficiency; // Base rate per machine
    }, 0);

    // Calculate time to depletion
    const timeToDepletionMinutes = totalMiningRate > 0 ? 
      Math.ceil(currentAmount / (totalMiningRate * 60)) : Infinity;

    return {
      progress: Math.min(depletionProgress, 100),
      currentAmount,
      maxAmount: nodeCap,
      assignedCount: assignedMachines.length,
      activeCount: activeMachines.length,
      maxAllowed: MAX_MACHINES_PER_NODE,
      combinedRate: totalMiningRate,
      timeToDepletion: timeToDepletionMinutes,
      isDepleted: currentAmount <= 0,
      isNearDepletion: depletionProgress > 80,
      canAddMore: assignedMachines.length < MAX_MACHINES_PER_NODE
    };
    } catch (error) {
      console.error('Error in nodeDepletionData calculation:', error);
      return null;
    }
  }, [machine, node, placedMachines, allResourceNodes, nodeAmounts, machine?.assignedNodeId]);

  // For crafting machines - check for active crafting processes
  const machineProcesses = useMemo(() => {
    if (machine.type === "miner" || machine.type === "oilExtractor") return [];
    return craftingQueue.filter(
      (proc) => proc.machineId === machine.id && (proc.status === "pending" || proc.status === "paused")
    );
  }, [craftingQueue, machine.id, machine.type]);

  const isProcessing = machineProcesses.length > 0;
  const currentProcess = machineProcesses[0]; // Get the current running process

  // Calculate progress for crafting machines
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only for crafting machines
    if (machine.type === "miner" || machine.type === "oilExtractor") {
      setProgress(0);
      return;
    }

    if (!currentProcess) {
      setProgress(0);
      return;
    }

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = (now - currentProcess.startedAt) / 1000;
      const totalTime = currentProcess.processingTime;
      const currentProgress = Math.min(elapsed, totalTime);
      setProgress(currentProgress);
    };

    // Update immediately
    updateProgress();

    // Set up interval to update progress
    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [currentProcess, machine.type]);

  const openNodeSelector = () => {
    navigation.navigate('NodeSelectorScreen', { machine });
  };

  const openSmelterScreen = () => {
    navigation.navigate('SmelterScreen', { machine });
  };

  const openConstructorScreen = () => {
    console.log('openConstructorScreen called');
    console.log('navigation:', navigation);
    console.log('machine:', machine);
    console.log('machine.currentRecipeId:', machine?.currentRecipeId);
    
    try {
      if (navigation && typeof navigation.navigate === 'function') {
        navigation.navigate('ConstructorScreen', { 
          machine: machine,
          recipe: machine.currentRecipeId ? { id: machine.currentRecipeId } : null
        });
      } else {
        console.error('Navigation is not available or navigate is not a function');
      }
    } catch (error) {
      console.error('Error in openConstructorScreen:', error);
    }
  };



  const handleSelectRecipe = (recipeId) => {
    if (setPlacedMachines && typeof setPlacedMachines === 'function') {
      setPlacedMachines((prev) => {
        if (!Array.isArray(prev)) return [];
        return prev.map((m) =>
          m && m.id === machine?.id ? { ...m, currentRecipeId: recipeId } : m
        );
      });
    }
    // Both constructor and smelter now use screen navigation, no modals to close
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const props = {};
      if (machine.type === "miner") {
        props.onOpenModal = openNodeSelector;
      } else if (machine.type === "smelter") {
        props.onOpenModal = openSmelterScreen;
      } else if (machine.type === "constructor") {
        props.onOpenModal = openConstructorScreen;
      }
      return React.cloneElement(child, props);
    }
    return child;
  });

  const liveMachine = Array.isArray(placedMachines) 
    ? placedMachines.find((m) => m && m.id === machine?.id) || machine
    : machine;



  return (
    <View
      style={[
        styles.machineCard,
        {
          borderLeftWidth: 4,
          borderLeftColor: machineColor,
          backgroundColor: machineColorBackground,
        },
      ]}
    >
      <View style={styles.rowAlignCenter}>
        <View style={styles.machineInfo}>
          <View style={styles.rowSpaceBetween}>
            <View style={styles.rowAlignCenterGap}>
              <View
                style={[
                  styles.machineIconContainer,
                  { backgroundColor: machineColor },
                ]}
              >
                {getMachineIcon(machine.type, "#FFFFFF")}
              </View>
              <Text style={[styles.machineName, { color: machineColor }]}>
                {machine.displayName || machine.name || machine.type}
              </Text>
            </View>
            {/* Show loupe icon for miners, smelters, and constructors */}
            {machine.type === "miner" ||
            machine.type === "smelter" ||
            machine.type === "constructor" ? (
              <TouchableOpacity
                onPress={machine.type === "miner" ? onPress : undefined}
                style={styles.loupeButton}
                activeOpacity={0.7}
                disabled={
                  machine.type === "smelter" || machine.type === "constructor"
                }
              >
                <MaterialIcons name="loupe" size={32} color="#bbb" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      {/* Render children components (specific machine type content) */}
      {childrenWithProps}

      {/* Progress Section */}
      {(((machine.type === "miner" || machine.type === "oilExtractor") && nodeDepletionData) || 
       (isProcessing && currentProcess)) && (
        <View style={styles.extraInfoContainer}>
          
          {/* Node Depletion Progress for Miners/Oil Extractors */}
          {(machine.type === "miner" || machine.type === "oilExtractor") && nodeDepletionData && (
            <View>
              <View style={styles.headerRow}>
                <View
                  style={[
                    styles.selectedNodePill,
                    { 
                      backgroundColor: nodeDepletionData.isDepleted ? "#ff6b6b" : 
                                     nodeDepletionData.isNearDepletion ? "#ff9800" : machineColor 
                    },
                  ]}
                >
                  <Text style={styles.selectedNodePillText}>
                    {nodeDepletionData.isDepleted ? "Depleted" : 
                     nodeDepletionData.isNearDepletion ? "Near Depletion" : 
                     `${machine.type === "miner" ? "Mining" : "Extracting"}`}
                  </Text>
                </View>
                <Text style={styles.machineStatus}>
                  {nodeDepletionData.activeCount}/{nodeDepletionData.assignedCount} active 
                  {nodeDepletionData.canAddMore ? ` (max ${nodeDepletionData.maxAllowed})` : " (full)"}
                </Text>
              </View>

              {/* Node Depletion Bar */}
              <View style={styles.depletionSection}>
                <ProgressBar
                  value={nodeDepletionData.progress}
                  max={100}
                  label={`Node Depletion: ${nodeDepletionData.currentAmount.toLocaleString()}/${nodeDepletionData.maxAmount.toLocaleString()} remaining`}
                  color={nodeDepletionData.isDepleted ? "#ff6b6b" : 
                         nodeDepletionData.isNearDepletion ? "#ff9800" : "#4CAF50"}
                />
                {nodeDepletionData.timeToDepletion !== Infinity && !nodeDepletionData.isDepleted && (
                  <Text style={styles.depletionTime}>
                    ~{nodeDepletionData.timeToDepletion} min to depletion at current rate
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Crafting Progress for other machines */}
          {isProcessing && currentProcess && machine.type !== "miner" && machine.type !== "oilExtractor" && (
            <View>
              <View style={styles.headerRow}>
                <View
                  style={[
                    styles.selectedNodePill,
                    { backgroundColor: machineColor },
                  ]}
                >
                  <Text style={styles.selectedNodePillText}>
                    Crafting: {currentProcess.itemName}
                  </Text>
                </View>
                <Text style={styles.machineStatus}>
                  Processing... ({machineProcesses.length} in queue)
                </Text>
              </View>

              {/* Crafting Progress Bar */}
              <View style={styles.depletionSection}>
                <ProgressBar
                  value={progress}
                  max={currentProcess.processingTime}
                  label={`Crafting Progress`}
                  color={currentProcess.status === "paused" ? "#ff9800" : "#4CAF50"}
                />
                
                {/* Crafting Controls */}
                <View style={styles.craftingControlsContainer}>
                  {onPauseResume && (
                    <TouchableOpacity
                      style={[
                        styles.craftingControlButton,
                        currentProcess.status === "paused" ? styles.resumeButton : styles.pauseButton
                      ]}
                      onPress={onPauseResume}
                    >
                      <MaterialIcons
                        name={currentProcess.status === "paused" ? "play-arrow" : "pause"}
                        size={16}
                        color="#fff"
                      />
                      <Text style={styles.craftingControlText}>
                        {currentProcess.status === "paused" ? "Resume" : "Pause"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {onCancelCrafting && (
                    <TouchableOpacity
                      style={[styles.craftingControlButton, styles.cancelButton]}
                      onPress={onCancelCrafting}
                    >
                      <MaterialIcons name="stop" size={16} color="#fff" />
                      <Text style={styles.craftingControlText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      )}

    </View>
  );
};

export default MachineCard;
