import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "../styles";
import ProgressBar from "../../../components/ProgressBar";
import { useGame } from "../../../contexts/GameContext";

function getMachineIcon(type) {
  switch (type) {
    case "miner":
      return (
        <MaterialCommunityIcons
          name="robot-industrial"
          size={28}
          color="#4CAF50"
          style={{ marginRight: 8 }}
        />
      );
    case "refinery":
      return (
        <MaterialCommunityIcons
          name="chemical-weapon"
          size={28}
          color="#ff4081"
          style={{ marginRight: 8 }}
        />
      );
    case "foundry":
      return (
        <MaterialCommunityIcons
          name="furnace"
          size={28}
          color="#ffb300"
          style={{ marginRight: 8 }}
        />
      );
    default:
      return (
        <MaterialIcons
          name="build"
          size={28}
          color="#aaa"
          style={{ marginRight: 8 }}
        />
      );
  }
}

const MachineCard = ({
  machine,
  node,
  recipe,
  onPress,
  onPauseResume,
  resourceCap,
}) => {
  const isMiner = machine.type === "miner";
  const isIdle = machine.isIdle;
  // Siempre obtener el estado más reciente del machine desde el contexto
  const {
    allResourceNodes = [],
    discoveredNodes = {},
    setPlacedMachines,
    placedMachines,
  } = useGame();
  // Find all discovered and non-depleted nodes
  const liveMachine = placedMachines.find(m => m.id === machine.id) || machine;
  const discoveredNodeOptions = useMemo(
    () =>
      allResourceNodes.filter(
        (n) =>
          discoveredNodes[n.id] &&
          (typeof n.currentAmount !== "number" || n.currentAmount > 0)
      ),
    [allResourceNodes, discoveredNodes]
  );

  // Usa SIEMPRE el prop node para la progressBar y datos dinámicos
  const nodeCapacity = node && typeof node.capacity === "number" ? node.capacity : 1000;
  const nodeDepletionAmount =
    node && typeof node.nodeDepletionAmount !== "undefined"
      ? node.nodeDepletionAmount
      : node && typeof node.currentAmount !== "undefined"
      ? node.currentAmount
      : nodeCapacity;

  // Lógica de asignación igual a MachineDetailsScreen
  const handleAssignNode = (nodeId) => {
    const node = allResourceNodes.find((n) => n.id === nodeId);
    if (!node || !discoveredNodes[nodeId] || node.currentAmount <= 0) {
      return;
    }
    if (liveMachine.type === "miner") {
      setPlacedMachines((prevPlaced) => prevPlaced.filter(m => m.id !== liveMachine.id));
      setTimeout(() => {
        setPlacedMachines((prevPlaced) => [
          ...prevPlaced,
          {
            ...liveMachine,
            assignedNodeId: nodeId,
            // Mantén otros props relevantes
          },
        ]);
      }, 0);
    } else {
      setPlacedMachines((prevPlaced) =>
        prevPlaced.map((m) =>
          m.id === machine.id ? { ...m, assignedNodeId: nodeId } : m
        )
      );
    }
  };

  return (
    <View
      style={[
        styles.machineCard,
        {
          marginBottom: 12,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {getMachineIcon(machine.type)}
        <View style={styles.machineInfo}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={[styles.machineName, { color: "#4CAF50" }]}>
              {machine.displayName || machine.name || machine.type}
            </Text>
            <TouchableOpacity
              onPress={onPress}
              style={{ padding: 8, alignSelf: "flex-start" }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="loupe" size={26} color="#bbb" />
            </TouchableOpacity>
          </View>
          <Text style={styles.machineStatus}>{machine.statusText}</Text>
          {isMiner && (
            <View style={{ marginTop: 6, marginBottom: 6 }}>
              <Text style={{ color: "#fff", fontSize: 14, marginBottom: 2 }}>
                Assign to Node:
              </Text>
              <Picker
                selectedValue={liveMachine.assignedNodeId || null}
                style={{
                  height: 40,
                  width: "100%",
                  backgroundColor: "#23233a",
                  color: "#fff",
                  marginBottom: 4,
                }}
                onValueChange={(itemValue) => handleAssignNode(itemValue)}
              >
                <Picker.Item label="Select a node..." value={null} />
                {discoveredNodeOptions.map((n) => (
                  <Picker.Item key={n.id} label={n.name} value={n.id} />
                ))}
              </Picker>
              {discoveredNodeOptions.length === 0 && (
                <Text style={{ color: "#ff9800", fontSize: 13, marginTop: 4 }}>
                  No discovered, non-depleted nodes available.
                </Text>
              )}
            </View>
          )}
          {/* Node info and depletion/progress bar for any assigned node */}
          {node && (
            <View style={styles.nodeDetails}>
              <Text style={styles.nodeName}>@ {node.name}</Text>
              <Text style={styles.nodeId}>Node ID: {node.id}</Text>
              <Text style={styles.nodeAmount}>
                Amount: {nodeDepletionAmount} / {nodeCapacity}
              </Text>
              <ProgressBar
                value={nodeDepletionAmount}
                max={nodeCapacity}
                label={"Node Depletion"}
                style={{ marginTop: 8, marginBottom: 8 }}
              />
              {nodeDepletionAmount <= 0 && (
                <Text
                  style={{
                    color: "#c00",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: 8,
                  }}
                >
                  Node Depleted
                </Text>
              )}
            </View>
          )}

          {/*   {recipe && (
            <Text style={styles.recipeName}>Recipe: {recipe.name}</Text>
          )}
          {machine.level && (
            <Text style={styles.machineLevel}>Level: {machine.level}</Text>
          )} */}

          {isMiner && node && (
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: isIdle ? "#007bff" : "#d9534f",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 5,
                alignSelf: "flex-start",
              }}
              onPress={onPauseResume}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {isIdle ? "Reanudar" : "Detener"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default MachineCard;
