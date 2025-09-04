import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";

const AssignNodeButton = ({ hasAssignedNode, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.assignNodeButton}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <MaterialCommunityIcons
        name="select-marker"
        size={28}
        color="#fff"
        style={{ marginRight: 6 }}
      />
      <Text style={styles.assignNodeText}>
        {hasAssignedNode ? "Change resource node" : "Assign resource node"}
      </Text>
    </TouchableOpacity>
  );
};

export default AssignNodeButton;
