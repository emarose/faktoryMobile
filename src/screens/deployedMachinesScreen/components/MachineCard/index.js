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

const MachineCard = ({ machine, node, children, onPress, navigation }) => {
  const { setPlacedMachines, placedMachines, craftingQueue } = useGame();
  const { getMachineColor, getMachineColorWithOpacity } = useMachineColors();

  // Get machine color
  const machineColor = getMachineColor(machine.type);
  const machineColorBackground = getMachineColorWithOpacity(machine.type, 0.1);

  const openNodeSelector = () => {
    navigation.navigate('NodeSelectorScreen', { machine });
  };

  const openSmelterScreen = () => {
    navigation.navigate('SmelterScreen', { machine });
  };

  const openConstructorScreen = () => {
    if (navigation) {
      navigation.navigate('ConstructorScreen', { 
        machine: machine,
        recipe: machine.currentRecipeId ? { id: machine.currentRecipeId } : null
      });
    }
  };



  const handleSelectRecipe = (recipeId) => {
    setPlacedMachines((prev) =>
      prev.map((m) =>
        m.id === machine.id ? { ...m, currentRecipeId: recipeId } : m
      )
    );
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

  const liveMachine =
    placedMachines.find((m) => m.id === machine.id) || machine;

  // Check for active crafting processes for this machine
  const machineProcesses = useMemo(() => {
    return craftingQueue.filter(
      (proc) => proc.machineId === machine.id && proc.status === "pending"
    );
  }, [craftingQueue, machine.id]);

  const isProcessing = machineProcesses.length > 0;
  const currentProcess = machineProcesses[0]; // Get the current running process

  // Calculate progress for current process
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
  }, [currentProcess]);

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

      {/* Crafting Progress Section */}
      {isProcessing && currentProcess && (
        <View style={styles.extraInfoContainer}>
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

          {/* Progress Bar */}
          <View style={styles.depletionSection}>
            <ProgressBar
              value={progress}
              max={currentProcess.processingTime}
              label={`Crafting Progress`}
              color="#4CAF50"
            />
          </View>
        </View>
      )}

    </View>
  );
};

export default MachineCard;
