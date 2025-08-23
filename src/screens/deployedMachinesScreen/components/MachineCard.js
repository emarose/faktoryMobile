import React, { useMemo, useState, useRef } from "react";
import { Animated, Easing } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
// import { Picker } from "@react-native-picker/picker";
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
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const openNodeSelector = () => {
    setShowNodeSelector(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  };
  const closeNodeSelector = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.exp),
      useNativeDriver: true,
    }).start(() => setShowNodeSelector(false));
  };
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
          marginBottom: 8,
          paddingVertical: 8,
          paddingHorizontal: 8,
          borderRadius: 12,
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
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
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
            <View style={{ marginVertical: 10 }}>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#4CAF50",
                  backgroundColor: "#2c2c44",
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  marginBottom: 8,
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
                onPress={openNodeSelector}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name="select-marker"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {liveMachine.assignedNodeId
                    ? "Change resource node"
                    : "Assign resource node"}
                </Text>
              </TouchableOpacity>
              {!liveMachine.assignedNodeId &&
                discoveredNodeOptions.length === 0 && (
                  <Text
                    style={{ color: "#ff9800", fontSize: 13, marginTop: 4 }}
                  >
                    No discovered, non-depleted nodes available.
                  </Text>
                )}
              {/* Node selector panel/modal */}
              {showNodeSelector && (
                <Animated.View
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [300, -69],
                        }),
                      },
                    ],
                    backgroundColor: "#23243aff",
                    borderRadius: 18,
                    padding: 18,
                    zIndex: 100,
                    elevation: 20,
                    shadowColor: "#000",
                    shadowOpacity: 0.5,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 8 },
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 8,
                      gap: 8,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="select-group"
                      size={32}
                      color="#4CAF50"
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 18,
                        textAlign: "center",
                        letterSpacing: 1,
                      }}
                    >
                      Select a resource node
                    </Text>
                  </View>

                  {discoveredNodeOptions.length === 0 ? (
                    <Text
                      style={{
                        color: "#ff9800",
                        fontSize: 15,
                        textAlign: "center",
                        marginVertical: 12,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="emoticon-sad-outline"
                        size={18}
                        color="#ff9800"
                      />{" "}
                      No available nodes! Explore more to unlock.
                    </Text>
                  ) : (
                    discoveredNodeOptions.map((n) => (
                      <TouchableOpacity
                        key={n.id}
                        style={{
                          backgroundColor: "#2c2c44",
                          borderRadius: 10,
                          padding: 14,
                          marginVertical: 7,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderWidth: 1,
                          borderColor: "#4CAF50",
                        }}
                        activeOpacity={0.85}
                        onPress={() => {
                          handleAssignNode(n.id);
                          closeNodeSelector();
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <MaterialCommunityIcons
                            name="cube-outline"
                            size={20}
                            color="#4CAF50"
                          />
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 15,
                              fontWeight: "bold",
                            }}
                          >
                            {n.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                  <TouchableOpacity
                    style={{
                      marginTop: 18,
                      alignSelf: "center",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                    onPress={closeNodeSelector}
                  >
                    <MaterialCommunityIcons
                      name="close-circle-outline"
                      size={20}
                      color="#bbb"
                    />
                    <Text
                      style={{
                        color: "#bbb",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          )}
          {/* Node info and depletion/progress bar for any assigned node */}
          {node && (
            <View
              style={{
                borderWidth: 1,
                paddingVertical: 6,
                paddingHorizontal: 8,
                borderColor: "#444",
                borderRadius: 8,
                backgroundColor: "#1e1e2a",
              }}
            >
              <ProgressBar
                value={nodeDepletionAmount}
                max={nodeCapacity}
                label={"Node Depletion"}
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
              {isMiner && node && (
                <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: isIdle ? "#4CAF50" : "#ff9800",
                      paddingVertical: 7,
                      paddingHorizontal: 14,
                      borderRadius: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      shadowColor: isIdle ? "#4CAF50" : "#ff9800",
                      shadowOpacity: 0.15,
                      shadowRadius: 3,
                      shadowOffset: { width: 0, height: 1 },
                      elevation: 2,
                    }}
                    onPress={handlePauseResume}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons
                      name={isIdle ? "front-loader" : "pause"}
                      size={18}
                      color="#fff"
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      {isIdle ? "Resume mining" : "Pause Miner"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#23233a",
                      paddingVertical: 7,
                      paddingHorizontal: 14,
                      borderRadius: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#bbb",
                      shadowColor: "#23233a",
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      shadowOffset: { width: 0, height: 1 },
                      elevation: 1,
                    }}
                    onPress={() => {
                      setPlacedMachines((prevPlaced) =>
                        prevPlaced.map((m) =>
                          m.id === liveMachine.id
                            ? { ...m, isIdle: true, assignedNodeId: undefined }
                            : m
                        )
                      );
                    }}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons
                      name="link-off"
                      size={16}
                      color="#bbb"
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        color: "#bbb",
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      Detach Miner
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MachineCard;
