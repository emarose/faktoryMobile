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
        />
      );
    case "refinery":
      return (
        <MaterialCommunityIcons
          name="chemical-weapon"
          size={28}
          color="#ff4081"
        />
      );
    case "foundry":
      return (
        <MaterialCommunityIcons name="furnace" size={28} color="#ffb300" />
      );
    default:
      return <MaterialIcons name="build" size={28} color="#aaa" />;
  }
}

const MachineCard = ({ machine, node, onPress }) => {
  const isMiner = machine.type === "miner";
  const isIdle = machine.isIdle;
  const {
    allResourceNodes = [],
    discoveredNodes = {},
    setPlacedMachines,
    placedMachines,
  } = useGame();
  const liveMachine =
    placedMachines.find((m) => m.id === machine.id) || machine;
  const discoveredNodeOptions = useMemo(
    () =>
      allResourceNodes.filter(
        (n) =>
          discoveredNodes[n.id] &&
          (typeof n.currentAmount !== "number" || n.currentAmount > 0)
      ),
    [allResourceNodes, discoveredNodes]
  );

  const nodeCapacity =
    node && typeof node.capacity === "number" ? node.capacity : 1000;

  const nodeDepletionAmount =
    node && typeof node.nodeDepletionAmount !== "undefined"
      ? node.nodeDepletionAmount
      : node && typeof node.currentAmount !== "undefined"
      ? node.currentAmount
      : nodeCapacity;

  const handleAssignNode = (nodeId) => {
    const node = allResourceNodes.find((n) => n.id === nodeId);
    if (!node || !discoveredNodes[nodeId] || node.currentAmount <= 0) {
      return;
    }
    if (liveMachine.type === "miner") {
      setPlacedMachines((prevPlaced) =>
        prevPlaced.filter((m) => m.id !== liveMachine.id)
      );
      setTimeout(() => {
        setPlacedMachines((prevPlaced) => [
          ...prevPlaced,
          {
            ...liveMachine,
            assignedNodeId: nodeId,
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

  const handlePauseResume = () => {
    setPlacedMachines((prevPlaced) =>
      prevPlaced.map((m) =>
        m.id === liveMachine.id ? { ...m, isIdle: !m.isIdle } : m
      )
    );
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
        <View style={styles.machineInfo}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#2c2c44",
                  padding: 8,
                  borderRadius: 32,
                  borderWidth: 1,
                  borderColor: "#444455",
                }}
              >
                {getMachineIcon(machine.type)}
              </View>
              <Text style={[styles.machineName, { color: "#4CAF50" }]}>
                {machine.displayName || machine.name || machine.type}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onPress}
              style={{ padding: 8, alignSelf: "flex-start" }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="loupe" size={28} color="#bbb" />
            </TouchableOpacity>
          </View>
          {isMiner && (
            <View style={{ marginVertical: 12 }}>
              <Picker
                mode="dialog"
                selectedValue={liveMachine.assignedNodeId || null}
                style={{
                  height: 30,
                  width: "100%",
                  backgroundColor: "#2c2c44",
                  color: "#fff",
                  borderRadius: 16,
                  paddingHorizontal: 10,
                  fontSize: 16,
                }}
                dropdownIconColor="#fff"
                onValueChange={(itemValue) => handleAssignNode(itemValue)}
              >
                <Picker.Item label="Assign resource node" value={null} />
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
            <View style={{ marginTop: 32 }}>
              <ProgressBar
                value={nodeDepletionAmount}
                max={nodeCapacity}
                label={""}
                style={{ marginTop: 8, marginBottom: 8 }}
              />
              <Text style={styles.machineStatus}>
                {isIdle ? "Miner is on hold" : machine.statusText}
              </Text>

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
              onPress={handlePauseResume}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {isIdle ? "Resume mining" : "Stop Miner"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default MachineCard;
