import React from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import { useNavigation } from "@react-navigation/native";
import ProgressBar from "../../components/ProgressBar";
import RESOURCE_CAP from "../../constants/ResourceCap";

const DeployedMachinesScreen = () => {
  const { placedMachines, ownedMachines, allResourceNodes, inventory } =
    useGame();
  const navigation = useNavigation();

  const allMachines = [
    ...placedMachines,
    ...ownedMachines.filter((m) => !placedMachines.some((p) => p.id === m.id)),
  ];

  // Helper to get node info
  const getNodeInfo = (machine) => {
    // Prefer assignedNodeId for miners/pumps
    const nodeId =
      machine.assignedNodeId || machine.nodeId || machine.nodeTargetId;
    if (!nodeId) return null;
    const node = allResourceNodes.find((n) => n.id === nodeId);
    return node ? node : null;
  };

  // Helper to get machine state
  const getMachineState = (machine) => {
    const node = getNodeInfo(machine);
    if (machine.type === "miner" || machine.type === "pump") {
      if (node) {
        if (node.depleted) return `Depleted: ${node.name}`;
        if (node.currentAmount !== undefined && node.currentAmount < 1000) {
          return `Extracting ${node.name}`;
        }
        if (node.currentAmount >= 1000) {
          return `Idle (Reached Cap)`;
        }
      }
      if (machine.assignedNodeId) {
        const assignedNode = allResourceNodes.find(
          (n) => n.id === machine.assignedNodeId
        );
        if (assignedNode) {
          return `Extracting ${assignedNode.name}`;
        }
      }
      return "Idle (Not placed)";
    }
    if (machine.currentRecipeId) {
      const recipe = items[machine.currentRecipeId];
      if (!recipe || !recipe.inputs) return "Invalid Recipe";
      return `Processing ${recipe.name}`;
    }
    return "Idle";
  };

  // Group machines by type for better separation
  const machinesByType = allMachines.reduce((acc, machine) => {
    const typeName = items[machine.type]?.name || machine.type;
    if (!acc[typeName]) acc[typeName] = [];
    acc[typeName].push(machine);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Machines Overview</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {Object.keys(machinesByType).length > 0 ? (
          Object.keys(machinesByType).map((typeName) => (
            <View key={typeName} style={styles.machineTypeSection}>
              <Text style={styles.groupTitle}>{typeName}s</Text>
              {machinesByType[typeName].map((machine) => {
                const node = getNodeInfo(machine);
                const recipe = machine.currentRecipeId
                  ? items[machine.currentRecipeId]
                  : null;
                let currentAmount = 0;
                let cap = RESOURCE_CAP;
                if (
                  machine.type === "miner" &&
                  node &&
                  items[node.type]?.output
                ) {
                  const outputResourceId = Object.keys(
                    items[node.type].output
                  )[0];
                  currentAmount =
                    (outputResourceId &&
                      inventory[outputResourceId]?.currentAmount) ||
                    0;
                  cap = RESOURCE_CAP;
                }
                return (
                  <TouchableOpacity
                    key={machine.id}
                    style={[
                      styles.machineCard,
                      {
                        borderColor: "#4CAF50",
                        borderWidth: 1,
                        marginBottom: 12,
                      },
                    ]}
                    onPress={() =>
                      navigation.navigate("MachineDetailsScreen", {
                        machine,
                        node,
                        recipe,
                      })
                    }
                  >
                    <View style={styles.machineInfo}>
                      <Text style={[styles.machineName, { color: "#4CAF50" }]}>
                        {items[machine.type]?.name || machine.type}
                      </Text>
                      <Text style={styles.machineStatus}>
                        {machine.type === "miner" &&
                        node &&
                        currentAmount >= cap
                          ? `Idle (Reached Cap)`
                          : getMachineState(machine)}
                      </Text>
                      {node && (
                        <View style={styles.nodeDetails}>
                          <Text style={styles.nodeName}>@ {node.name}</Text>
                          <Text style={styles.nodeId}>Node ID: {node.id}</Text>
                          {typeof node.currentAmount !== "undefined" && (
                            <Text style={styles.nodeAmount}>
                              Amount: {node.currentAmount} / {RESOURCE_CAP}
                            </Text>
                          )}
                        </View>
                      )}
                      {recipe && (
                        <Text style={styles.recipeName}>
                          Recipe: {recipe.name}
                        </Text>
                      )}
                      {machine.level && (
                        <Text style={styles.machineLevel}>
                          Level: {machine.level}
                        </Text>
                      )}
                      {(machine.type === "miner" || machine.type === "pump") &&
                        node && (
                          <ProgressBar
                            value={currentAmount}
                            max={RESOURCE_CAP}
                            label={"Node Progress"}
                            style={{ marginTop: 8 }}
                          />
                        )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        ) : (
          <Text style={styles.emptyStateText}>
            No machines deployed or owned yet.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeployedMachinesScreen;
