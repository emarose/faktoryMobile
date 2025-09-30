import React, { useState, useMemo, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "../../../../components";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import ProgressBar from "../../../../components/ProgressBar";

import styles from "./styles";

import { useGame } from "../../../../contexts/GameContext";
import { useMachineColors } from "../../../../hooks";
import Colors from "../../../../constants/Colors";

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

const MachineCard = ({
  machine,
  node,
  children,
  onPress,
  navigation,
  onPauseResume,
  onCancelCrafting,
}) => {
  const gameContext = useGame();
  const {
    setPlacedMachines,
    placedMachines = [],
    craftingQueue = [],
    allResourceNodes = [],
    nodeAmounts = {},
  } = gameContext || {};
  const { getMachineColor, getMachineColorWithOpacity } = useMachineColors();

  // Get machine color
  const machineColor = getMachineColor(machine.type);
  const machineColorBackground = getMachineColorWithOpacity(machine.type, 0.1);

  // For crafting machines - check for active crafting processes
  const machineProcesses = useMemo(() => {
    if (machine.type === "miner" || machine.type === "oilExtractor") return [];
    return craftingQueue.filter(
      (proc) =>
        proc.machineId === machine.id &&
        (proc.status === "pending" || proc.status === "paused")
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

    const getSafeStartedAt = (proc) => {
      if (proc.startedAt) return proc.startedAt;
      // If startedAt missing, derive it from endsAt - processingTime
      if (proc.endsAt && proc.processingTime) {
        return proc.endsAt - proc.processingTime * 1000;
      }
      return Date.now();
    };

    const updateProgress = () => {
      const now = Date.now();
      const startedAt = getSafeStartedAt(currentProcess);
      const elapsed = (now - startedAt) / 1000;
      const totalTime = currentProcess.processingTime || 1;
      const currentProgress = Math.min(Math.max(elapsed, 0), totalTime);
      setProgress(currentProgress);
    };

    // Update immediately
    updateProgress();

    // Set up interval to update progress
    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
    // Key effect to specific process attributes so it restarts on resume/pause
  }, [currentProcess?.id, currentProcess?.status, currentProcess?.startedAt, machine.type]);

  const openNodeSelector = () => {
    navigation.navigate("NodeSelectorScreen", { machine });
  };

  const openSmelterScreen = () => {
    navigation.navigate("SmelterScreen", { machine });
  };

  const openConstructorScreen = () => {
    navigation.navigate("ConstructorScreen", {
      machine: machine,
      recipe: machine.currentRecipeId ? { id: machine.currentRecipeId } : null,
    });
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

  return (
    <View
      style={[
        styles.machineCard,
        {
          borderColor: machineColor,
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
                {getMachineIcon(machine.type, Colors.textPrimary)}
              </View>
              <Text style={[styles.machineName, { color: machineColor }]}>
                {machine.displayName}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Render children components (specific machine type content) */}
      {childrenWithProps}
      {/* Esta logica sirve para todas las maquians que no sean smelter asique si sirve para constructor y demás, puede servir a nivel layout */}
      {/* Crafting Progress (non-miner machines) */}
      {isProcessing &&
        currentProcess &&
        machine.type !== "miner" &&
        machine.type !== "oilExtractor" && (
          <View style={styles.extraInfoContainer}>
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

              <View style={styles.depletionSection}>
                <ProgressBar
                  value={progress}
                  max={currentProcess.processingTime}
                  label={`Crafting Progress`}
                  color={
                    currentProcess.status === "paused" ? "#ff9800" : "#4CAF50"
                  }
                />

                <View style={styles.craftingControlsContainer}>
                  {onPauseResume && (
                    <TouchableOpacity
                      style={[
                        styles.craftingControlButton,
                        currentProcess.status === "paused"
                          ? styles.resumeButton
                          : styles.pauseButton,
                      ]}
                      onPress={onPauseResume}
                    >
                      <MaterialIcons
                        name={
                          currentProcess.status === "paused"
                            ? "play-arrow"
                            : "pause"
                        }
                        size={16}
                        color="#fff"
                      />
                      <Text style={styles.craftingControlText}>
                        {currentProcess.status === "paused"
                          ? "Resume"
                          : "Pause"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {onCancelCrafting && (
                    <TouchableOpacity
                      style={[
                        styles.craftingControlButton,
                        styles.cancelButton,
                      ]}
                      onPress={onCancelCrafting}
                    >
                      <MaterialIcons name="stop" size={16} color="#fff" />
                      <Text style={styles.craftingControlText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        )}
    </View>
  );
};

export default MachineCard;
