import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGame } from "../../../../../contexts/GameContext";
import styles from "../../MachineCard/styles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ProgressBar from "../../../../../components/ProgressBar";
import { items } from "../../../../../data/items";

const Miner = ({ machine, onOpenModal }) => {
  const { placedMachines, setPlacedMachines, allResourceNodes, discoveredNodes, nodeAmounts } = useGame();

  const liveMachine = placedMachines.find((m) => m.id === machine.id) || machine;

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
    setPlacedMachines((prevPlaced) =>
      prevPlaced.map((m) =>
        m.id === liveMachine.id ? { ...m, isIdle: !m.isIdle } : m
      )
    );
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
          onPress={onOpenModal}
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

    </>
  );
};

export default Miner;