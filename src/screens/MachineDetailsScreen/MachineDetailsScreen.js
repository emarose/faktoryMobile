import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import { Picker } from '@react-native-picker/picker';

const MachineDetailsScreen = ({ route }) => {
  const { machine, node, recipe } = route.params;
  const { allResourceNodes, setPlacedMachines, placedMachines } = useGame();
  const [selectedNodeId, setSelectedNodeId] = useState(machine.assignedNodeId || null);

  // Find the latest machine data from context
  const liveMachine = placedMachines.find(m => m.id === machine.id) || machine;
  const assignedNode = liveMachine.assignedNodeId
    ? allResourceNodes.find(n => n.id === liveMachine.assignedNodeId)
    : null;

  const handleAssignNode = (nodeId) => {
    // If this is a miner, use placeMachine logic to ensure correct setup
    if (liveMachine.type === "miner") {
      // Remove the old miner and place a new one on the selected node
      setPlacedMachines((prevPlaced) => prevPlaced.filter(m => m.id !== liveMachine.id));
      // Use the same id for continuity, or generate a new one if needed
      setTimeout(() => {
        // Use the same id and efficiency if possible
        setPlacedMachines((prevPlaced) => [
          ...prevPlaced,
          {
            id: liveMachine.id,
            type: "miner",
            assignedNodeId: nodeId,
            efficiency: liveMachine.efficiency || 1,
          },
        ]);
      }, 0);
    } else {
      // For other machines, just update the assignedNodeId
      setPlacedMachines((prevPlaced) =>
        prevPlaced.map((m) =>
          m.id === machine.id ? { ...m, assignedNodeId: nodeId } : m
        )
      );
    }
    setSelectedNodeId(nodeId);
    console.log(`Assigned node ${nodeId} to machine ${machine.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.detailsContent}>
        <Text style={styles.detailsTitle}>{liveMachine.type}</Text>
        <Text style={styles.detailsText}><Text style={{ fontWeight: 'bold' }}>ID:</Text> {liveMachine.id}</Text>
        <Text style={styles.detailsText}><Text style={{ fontWeight: 'bold' }}>Type:</Text> {liveMachine.type}</Text>
        {liveMachine.type === "miner" || liveMachine.type === "pump" ? (
          <View>
            <Text style={styles.detailsText}>Assign to Node:</Text>
            <Picker
              selectedValue={selectedNodeId}
              style={{ height: 50, width: '100%', backgroundColor: '#23233a', color: '#fff', marginBottom: 10 }}
              onValueChange={(itemValue) => handleAssignNode(itemValue)}
            >
              <Picker.Item label="Select a node..." value={null} />
              {allResourceNodes.map((node) => (
                <Picker.Item key={node.id} label={node.name} value={node.id} />
              ))}
            </Picker>
            {assignedNode && (
              <Text style={[styles.detailsText, { color: '#4CAF50', fontWeight: 'bold' }]}>Miner assigned to: {assignedNode.name}</Text>
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MachineDetailsScreen;
