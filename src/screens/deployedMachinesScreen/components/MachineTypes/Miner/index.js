import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGame } from "../../../../../contexts/GameContext";
import styles from "../../MachineCard/styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ProgressBar from "../../../../../components/ProgressBar";
import { items } from "../../../../../data/items";
import { getNodeTypeDefinition } from "../../../../../data/nodeTypes";

const Miner = ({ machine, navigation }) => {
  const { 
    placedMachines, 
    setPlacedMachines, 
    allResourceNodes, 
    discoveredNodes, 
    nodeAmounts,
    pauseMiner,
    resumeMiner
  } = useGame();

  const liveMachine = placedMachines.find((m) => m.id === machine.id) || machine;
  const isIdle = liveMachine.isIdle;

  const discoveredNodeOptions = allResourceNodes.filter(
    (n) =>
      discoveredNodes[n.id] &&
      (typeof n.currentAmount !== "number" || n.currentAmount > 0)
  );

  // Get assigned node info
  const assignedNode = liveMachine.assignedNodeId
    ? allResourceNodes.find(n => n.id === liveMachine.assignedNodeId)
    : null;

  const nodeDefinition = assignedNode?.type ? items[assignedNode.type] : null;
  const nodeAmount = assignedNode ? (nodeAmounts[assignedNode.id] ?? assignedNode.capacity ?? 1000) : 0;
  const nodeCapacity = assignedNode?.capacity || 1000;
  const depletionPercentage = assignedNode ? ((nodeCapacity - nodeAmount) / nodeCapacity) * 100 : 0;

  const handlePauseResume = () => {
    if (isIdle) {
      resumeMiner(liveMachine.id);
    } else {
      pauseMiner(liveMachine.id);
    }
  };

  const handleDetachNode = () => {
    setPlacedMachines((prevPlaced) =>
      prevPlaced.map((m) =>
        m.id === liveMachine.id ? { ...m, assignedNodeId: undefined, isIdle: true } : m
      )
    );
  };

  return (
    <>
      <View style={styles.marginVertical10}>
        <TouchableOpacity
          style={styles.assignNodeButton}
          onPress={() => navigation.navigate('NodeSelectorScreen', { machine: liveMachine })}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name="select-marker"
            size={28}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.assignNodeText}>
            {liveMachine.assignedNodeId
              ? "Change resource node"
              : "Assign resource node"}
          </Text>
        </TouchableOpacity>

        {!liveMachine.assignedNodeId && discoveredNodeOptions.length === 0 && (
          <Text style={styles.noNodesText}>
            No discovered, non-depleted nodes available.
          </Text>
        )}
      </View>

      {/* Node Information and Controls */}
      {assignedNode && (
        <View style={styles.extraInfoContainer}>
          <View style={styles.headerRow}>
            {(() => {
              const nodeTypeDef = getNodeTypeDefinition(assignedNode.type);
              const pillColor = nodeTypeDef ? nodeTypeDef.color : '#333';
              return (
                <View style={[styles.selectedNodePill, { backgroundColor: pillColor }]}> 
                  <Text style={styles.selectedNodePillText}>{assignedNode.name}</Text>
                </View>
              );
            })()}
            <Text style={styles.machineStatus}>
              {isIdle ? "Miner is on hold" : liveMachine.statusText}
            </Text>
          </View>

          {/* Progress Bar and Depletion Message */}
          <View style={styles.depletionSection}>
            <ProgressBar
              value={nodeAmount}
              max={nodeCapacity}
              label={"Node Resources"}
              color={nodeAmount > 0 ? "#4CAF50" : "#FF6B6B"}
            />
            {nodeAmount <= 0 && (
              <Text style={styles.nodeDepletedText}>Node Depleted</Text>
            )}
          </View>

          {/* Miner Controls (Buttons) */}
          <View style={styles.controlButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.pauseResumeButton,
                isIdle
                  ? styles.pauseResumeIdle
                  : styles.pauseResumeActive,
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
              <Text style={styles.pauseResumeText}>
                {isIdle ? "Resume Mining" : "Pause Miner"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detachButton}
              onPress={handleDetachNode}
              activeOpacity={0.85}
            >
              <MaterialIcons
                name="link-off"
                size={16}
                color="#bbb"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.detachText}>Detach Miner</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default Miner;