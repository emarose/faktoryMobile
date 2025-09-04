import React from "react";
import { View, Text } from "react-native";
import { useGame } from "../../../../../../../contexts/GameContext";
import ProgressBar from "../../../../../../../components/ProgressBar";
import styles from "./styles";

const NodeDepletionBar = ({ assignedNodeId }) => {
  const { allResourceNodes, nodeAmounts } = useGame();

  if (!assignedNodeId) return null;

  const assignedNode = allResourceNodes.find((n) => n.id === assignedNodeId);
  
  if (!assignedNode) return null;

  const nodeCapacity = assignedNode.capacity || 1000;
  const nodeAmount = nodeAmounts[assignedNode.id] ?? nodeCapacity;
  const depletionPercentage = ((nodeCapacity - nodeAmount) / nodeCapacity) * 100;

  return (
    <View style={styles.depletionSection}>
      <ProgressBar
        value={depletionPercentage}
        max={100}
        label="Node Depletion"
        color="#FF6B6B"
        backgroundColor="#2a2a3e"
      />
      {nodeAmount <= 0 && (
        <Text style={styles.nodeDepletedText}>
          ¡Node Depleted!
        </Text>
      )}
    </View>
  );
};

export default NodeDepletionBar;
