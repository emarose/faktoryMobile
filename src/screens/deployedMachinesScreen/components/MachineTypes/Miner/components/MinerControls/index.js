import React, { useMemo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useGame } from "../../../../../../../contexts/GameContext";
import styles from "../../../../../styles";
import Colors from "../../../../../../../constants/Colors";
import { getNodeTypeDefinition } from "../../../../../../../data/nodeTypes";
import ProgressBar from "../../../../../../../components/ProgressBar";

const MinerControls = ({ machine, navigation }) => {
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

  const assignedNode = liveMachine.assignedNodeId
    ? allResourceNodes.find((n) => n.id === liveMachine.assignedNodeId)
    : null;

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

  if (!assignedNode) return null;

  return (
    <View style={styles.extraInfoContainer}>
      <View style={styles.headerRow}>
        {(() => {
          const nodeTypeDef = getNodeTypeDefinition(assignedNode.type);
          const pillColor = nodeTypeDef ? nodeTypeDef.color : Colors.fallback;
          return (
            <View style={[styles.selectedNodePill, { backgroundColor: pillColor }]}>
              <Text style={styles.selectedNodePillText}>{assignedNode.name}</Text>
            </View>
          );
        })()}
        <Text style={styles.machineStatus}>{isIdle ? "Miner is on hold" : liveMachine.statusText}</Text>
      </View>

      {nodeDepletionData && (
        <View style={{ marginTop: 10 }}>
          <View style={styles.headerRow}>
            <Text style={styles.machineStatus}>
              {nodeDepletionData.assignedCount}/{nodeDepletionData.assignedCount} assigned
              {nodeDepletionData.canAddMore ? ` (max ${nodeDepletionData.maxAllowed})` : " (full)"}
            </Text>
          </View>

          <View style={styles.depletionSection}>
            <ProgressBar
              value={nodeDepletionData.currentAmount}
              max={nodeDepletionData.maxAmount}
              label={""}
              color={
                nodeDepletionData.isDepleted
                  ? "#ff6b6b"
                  : nodeDepletionData.isNearDepletion
                  ? "#ff9800"
                  : "#4CAF50"
              }
            />
            {nodeDepletionData.timeToDepletion !== Infinity && !nodeDepletionData.isDepleted && (
              <Text style={styles.depletionTime}>
                ~{nodeDepletionData.timeToDepletion} min to depletion at current rate
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.controlButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.pauseResumeButton,
            isIdle ? styles.pauseResumeIdle : styles.pauseResumeActive,
          ]}
          onPress={handlePauseResume}
          activeOpacity={0.85}
        >
          <MaterialIcons
            name={isIdle ? "play-arrow" : "pause"}
            size={18}
            color="#fff"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.pauseResumeText}>{isIdle ? "Resume Mining" : "Pause Miner"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.detachButton} onPress={handleDetachNode} activeOpacity={0.85}>
          <MaterialCommunityIcons name="link-off" size={16} color={Colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.detachText}>Detach Miner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MinerControls;
