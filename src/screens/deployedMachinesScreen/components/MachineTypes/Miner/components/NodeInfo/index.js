import React from "react";
import { View, Text } from "react-native";
import { useGame } from "../../../../../../../contexts/GameContext";
import { items } from "../../../../../../../data/items";
import styles from "./styles";

const NodeInfo = ({ assignedNodeId }) => {
  const { allResourceNodes, nodeAmounts } = useGame();

  if (!assignedNodeId) return null;

  const assignedNode = allResourceNodes.find((n) => n.id === assignedNodeId);
  
  if (!assignedNode) return null;

  const nodeDefinition = assignedNode.type ? items[assignedNode.type] : null;
  const nodeAmount = nodeAmounts[assignedNode.id] ?? assignedNode.capacity ?? 1000;

  return (
    <View style={styles.nodeInfoContainer}>
      <View style={styles.headerRow}>
        <View style={styles.selectedNodePill}>
          <Text style={styles.selectedNodePillText}>
            {nodeDefinition?.name || assignedNode.type || "Unknown"}
          </Text>
        </View>
        <Text style={styles.machineStatus}>Mining</Text>
      </View>
      
      <View style={styles.nodeStatsContainer}>
        <Text style={styles.nodeStatsText}>
          Available: {nodeAmount} / {assignedNode.capacity || 1000}
        </Text>
        <Text style={styles.nodeLocationText}>
          Location: ({assignedNode.x}, {assignedNode.y})
        </Text>
      </View>
    </View>
  );
};

export default NodeInfo;
