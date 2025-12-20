import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ProgressBar from "../../../../../components/ProgressBar";
import Colors from "../../../../../constants/Colors";

const NodeSelector = ({
  discoveredNodeOptions,
  selectedNodeId,
  handleAssignNode,
  assignedNode,
}) => {
  if (discoveredNodeOptions.length === 0) {
    return (
      <Text style={[styles.detailsText, { color: "#ff9800", marginTop: 16 }]}>
        You must explore the world map and discover a non-depleted node before
        you can assign this machine.
      </Text>
    );
  }

  return (
    <View>
      <Text style={styles.detailsText}>Assign to Node:</Text>
      <Picker
        selectedValue={selectedNodeId}
        style={{
          height: 50,
          width: "100%",
          backgroundColor: "#23233a",
          color: "#fff",
          marginBottom: 10,
        }}
        onValueChange={(itemValue) => handleAssignNode(itemValue)}
      >
        <Picker.Item label="Select a node..." value={null} />
        {discoveredNodeOptions.map((node) => (
          <Picker.Item key={node.id} label={node.name} value={node.id} />
        ))}
      </Picker>
      {assignedNode && (
        <>
          <Text
            style={[
              styles.detailsText,
              { color: "#4CAF50", fontWeight: "bold" },
            ]}
          >
            Miner assigned to: {assignedNode.name}
          </Text>
          {/* Show depletion progress */}
          {typeof assignedNode.currentAmount === "number" && (
            <ProgressBar
              value={assignedNode.currentAmount}
              max={
                typeof assignedNode.capacity === "number"
                  ? assignedNode.capacity
                  : 1000
              }
              style={{ marginTop: 8, marginBottom: 8 }}
            />
          )}
          {typeof assignedNode.currentAmount === "number" &&
            assignedNode.currentAmount <= 0 && (
              <Text
                style={{
                  color: Colors.textDanger,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Node Depleted
              </Text>
            )}
        </>
      )}
    </View>
  );
};

export default NodeSelector;
