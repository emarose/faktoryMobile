import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGame } from "../../../../../contexts/GameContext";
import styles from "../../MachineCard/styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { items } from "../../../../../data/items";
import { getNodeTypeDefinition } from "../../../../../data/nodeTypes";
import Colors from "../../../../../constants/Colors";
import ProgressBar from "../../../../../components/ProgressBar";
import MinerControls from "./components/MinerControls";

const Miner = ({ machine, navigation }) => {
  const {
    placedMachines,
    allResourceNodes,
    discoveredNodes,
    nodeAmounts,
    pauseMiner,
    resumeMiner,
    detachMachine,
  } = useGame();

  const liveMachine =
    placedMachines.find((m) => m.id === machine.id) || machine;
  const isIdle = liveMachine.isIdle;

  const discoveredNodeOptions = allResourceNodes.filter(
    (n) =>
      discoveredNodes[n.id] &&
      (typeof n.currentAmount !== "number" || n.currentAmount > 0)
  );

  // Get assigned node info
  const assignedNode = liveMachine.assignedNodeId
    ? allResourceNodes.find((n) => n.id === liveMachine.assignedNodeId)
    : null;

  // Node depletion logic (moved from MachineCard)
  const nodeDepletionData = useMemo(() => {
    try {
      if (!assignedNode) return null;

      const assignedMachines = Array.isArray(placedMachines)
        ? placedMachines.filter(
            (m) =>
              m &&
              (m.type === "miner" || m.type === "oilExtractor") &&
              m.assignedNodeId === assignedNode.id
          )
        : [];

      const nodeCap = typeof assignedNode.capacity === "number" ? assignedNode.capacity : 1000;
      const currentAmount = nodeAmounts[assignedNode.id] ?? nodeCap;

      const minedAmount = nodeCap - currentAmount;
      const depletionProgress = nodeCap > 0 ? (minedAmount / nodeCap) * 100 : 0;

      const activeMachines = assignedMachines.filter((m) => !m.isIdle);
      const totalMiningRate = activeMachines.reduce((total, m) => {
        const efficiency = m.efficiency || 1;
        return total + efficiency;
      }, 0);

      const timeToDepletionMinutes =
        totalMiningRate > 0 ? Math.ceil(currentAmount / (totalMiningRate * 60)) : Infinity;

      return {
        progress: Math.min(depletionProgress, 100),
        currentAmount,
        maxAmount: nodeCap,
        assignedCount: assignedMachines.length,
        activeCount: activeMachines.length,
        maxAllowed: 4,
        combinedRate: totalMiningRate,
        timeToDepletion: timeToDepletionMinutes,
        isDepleted: currentAmount <= 0,
        isNearDepletion: depletionProgress > 80,
        canAddMore: assignedMachines.length < 4,
      };
    } catch (err) {
      console.error("Miner nodeDepletionData error:", err);
      return null;
    }
  }, [assignedNode, placedMachines, nodeAmounts]);

  const handlePauseResume = () => {
    if (isIdle) {
      resumeMiner(liveMachine.id, { user: true });
    } else {
      pauseMiner(liveMachine.id, { user: true });
    }
  };

  const handleDetachNode = () => {
    detachMachine(liveMachine.id);
  };

  return (
    <>
      <View>
        <TouchableOpacity
          style={styles.assignNodeButton}
          onPress={() =>
            navigation.navigate("NodeSelectorScreen", { machine: liveMachine })
          }
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name="select-marker"
            size={28}
            color={Colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.assignNodeText}>
            {liveMachine.assignedNodeId
              ? "Change resource node"
              : "Assign resource node"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Delegate node info and controls to MinerControls (avoids duplication) */}
      <MinerControls machine={liveMachine} navigation={navigation} />
    </>
  );
};

export default Miner;
