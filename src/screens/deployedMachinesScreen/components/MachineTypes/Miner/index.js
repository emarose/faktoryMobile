import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useGame } from "../../../../../contexts/GameContext";
import styles from "../../MachineCard/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Miner = ({ machine, onOpenModal }) => {
  const { placedMachines, allResourceNodes, discoveredNodes } = useGame();

  const liveMachine =
    placedMachines.find((m) => m.id === machine.id) || machine;

  const discoveredNodeOptions = allResourceNodes.filter(
    (n) =>
      discoveredNodes[n.id] &&
      (typeof n.currentAmount !== "number" || n.currentAmount > 0)
  );

  return (
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
  );
};

export default Miner;