
import React, { useEffect, useMemo } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./styles";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import { useNavigation } from "@react-navigation/native";
import ProgressBar from "../../components/ProgressBar";
import RESOURCE_CAP from "../../constants/ResourceCap";

const DeployedMachinesScreen = () => {
  const {
    placedMachines,
    ownedMachines,
    allResourceNodes = [],
    discoveredNodes = {},
    handleDepleteNode,
    inventory,
    nodeAmounts,
  } = useGame();
  const navigation = useNavigation();

  const allMachines = [
    ...placedMachines,
    ...ownedMachines.filter((m) => !placedMachines.some((p) => p.id === m.id)),
  ];

  // Helper to get node info (only discovered nodes, with up-to-date depletion)
  const getNodeInfo = (machine) => {
    const nodeId = machine.assignedNodeId || machine.nodeId || machine.nodeTargetId;
    if (!nodeId) return null;
    const baseNode = allResourceNodes.find((n) => n.id === nodeId && discoveredNodes[n.id]);
    if (!baseNode) return null;
    // Clone node and inject currentAmount from nodeAmounts
    const currentAmount = typeof nodeAmounts?.[nodeId] === 'number'
      ? nodeAmounts[nodeId]
      : (typeof baseNode.currentAmount === 'number' ? baseNode.currentAmount : (baseNode.capacity || 50));
    return { ...baseNode, currentAmount };
  };

  // Helper to get machine state (depletion aware)
  const getMachineState = (machine) => {
    const node = getNodeInfo(machine);
    if (machine.type === "miner" || machine.type === "pump") {
      if (node) {
        if (typeof node.currentAmount === "number" && node.currentAmount <= 0) return `Depleted: ${node.name}`;
        if (typeof node.currentAmount === "number" && node.currentAmount < (node.capacity || 50)) {
          return `Extracting ${node.name}`;
        }
        if (typeof node.currentAmount === "number" && node.currentAmount >= (node.capacity || 50)) {
          return `Idle (Reached Cap)`;
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
  useEffect(() => {
    console.log("allMachines:", allMachines);
    console.log(
      "🚀 ~ DeployedMachinesScreen ~ placedMachines:",
      placedMachines
    );
    console.log(
      "🚀 ~ DeployedMachinesScreen ~ allResourceNodes:",
      allResourceNodes
    );
    console.log("🚀 ~ DeployedMachinesScreen ~ ownedMachines:", ownedMachines);
  }, []);
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
                // Use node depletion/capacity for progress bar
                let currentAmount = node && typeof node.currentAmount === "number" ? node.currentAmount : 0;
                let cap = node && typeof node.capacity === "number" ? node.capacity : 50;
                // For consistency, show amountProducedPerTick = 1 for miners
                const amountProducedPerTick = machine.type === "miner" ? 1 : null;
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
                    {/* No logs in render to avoid infinite renders */}
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
                      {machine.type === "miner" && node && (
                        <ProgressBar
                          value={currentAmount}
                          max={cap}
                          label={"Node Depletion"}
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
