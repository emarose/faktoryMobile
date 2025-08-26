import React, { useMemo, useState, useRef, useEffect } from "react";
import { Animated, Easing, View, Text, TouchableOpacity, TextInput, FlatList, ScrollView } from "react-native";
// import { Picker } from "@react-native-picker/picker";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "../styles";
import ProgressBar from "../../../components/ProgressBar";
import { useGame } from "../../../contexts/GameContext";

// helper: resource icon mapping (returns MaterialCommunityIcons name)
function getResourceIcon(resourceType) {
  if (!resourceType) return 'cube-outline';
  const t = resourceType.toLowerCase();
  if (t.includes('iron')) return 'circle-slice-8';
  if (t.includes('copper')) return 'hexagon-multiple';
  if (t.includes('coal')) return 'fire';
  if (t.includes('oil')) return 'oil';
  if (t.includes('limestone')) return 'square-outline';
  if (t.includes('uranium')) return 'radioactive';
  return 'cube-outline';
}

function getResourceColor(resourceType) {
  if (!resourceType) return '#4CAF50';
  const t = resourceType.toLowerCase();
  if (t.includes('iron')) return '#8B4513';
  if (t.includes('copper')) return '#CD7F32';
  if (t.includes('coal')) return '#2F2F2F';
  if (t.includes('oil')) return '#6a4c93';
  if (t.includes('limestone')) return '#bfbfbf';
  if (t.includes('uranium')) return '#00c853';
  return '#4CAF50';
}

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

  // UI state for improved selector
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Group discovered nodes by resource type
  const groupedNodes = useMemo(() => {
    const grouped = {};
    discoveredNodeOptions.forEach(n => {
      const type = n.type || 'Unknown';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(n);
    });
    // sort each group by percentage remaining desc
    Object.keys(grouped).forEach(k => {
      grouped[k].sort((a,b) => ((b.currentAmount||0)/(b.capacity||1)) - ((a.currentAmount||0)/(a.capacity||1)));
    });
    return grouped;
  }, [discoveredNodeOptions]);

  // ensure a default selected type
  useEffect(() => {
    if (!selectedResourceType) {
      const keys = Object.keys(groupedNodes);
      if (keys.length) setSelectedResourceType(keys[0]);
    }
  }, [groupedNodes, selectedResourceType]);

  const filteredNodes = useMemo(() => {
    if (!selectedResourceType) return [];
    const nodes = groupedNodes[selectedResourceType] || [];
    if (!searchQuery.trim()) return nodes;
    const q = searchQuery.toLowerCase();
    return nodes.filter(n => (n.name||'').toLowerCase().includes(q) || `${n.x},${n.y}`.includes(q));
  }, [groupedNodes, selectedResourceType, searchQuery]);

  // small distance helper (used in list)
  const calculateDistance = (pos1, pos2) => {
    if (!pos1 || !pos2) return 0;
    const dx = (pos1.x||0) - (pos2.x||0);
    const dy = (pos1.y||0) - (pos2.y||0);
    return Math.round(Math.sqrt(dx*dx + dy*dy));
  };

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
              <MaterialIcons name="loupe" size={32} color="#bbb" />
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
              {/* Improved Node selector panel/modal */}
              {showNodeSelector && (
                <Animated.View
                  style={[
                    {
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      transform: [
                        { translateY: slideAnim.interpolate({ inputRange: [0,1], outputRange: [300, 0] }) }
                      ],
                    },
                    styles.nodeSelectorModal
                  ]}
                >
                  <View style={styles.modalHeader}>
                    <MaterialCommunityIcons name="select-group" size={22} color="#4CAF50" />
                    <Text style={styles.modalTitle}>Select resource node</Text>
                    <TouchableOpacity onPress={closeNodeSelector} style={styles.closeButton}>
                      <MaterialCommunityIcons name="close" size={20} color="#bbb" />
                    </TouchableOpacity>
                  </View>

                  {/* search */}
                  <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={18} color="#bbb" />
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search node name or coords"
                      placeholderTextColor="#9a9a9a"
                      style={styles.searchInput}
                    />
                  </View>

                  {/* resource type tabs */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                    {Object.entries(groupedNodes).map(([type, nodes]) => (
                      <TouchableOpacity
                        key={type}
                        style={[styles.resourceTab, selectedResourceType === type && styles.activeTab]}
                        onPress={() => { setSelectedResourceType(type); setSearchQuery(''); }}
                      >
                        <MaterialCommunityIcons name={getResourceIcon(type)} size={16} color={selectedResourceType === type ? '#fff' : '#bbb'} />
                        <Text style={[styles.tabText, selectedResourceType === type && styles.activeTabText]}>{type} ({nodes.length})</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* list for selected type */}
                  <FlatList
                    data={filteredNodes}
                    keyExtractor={item => item.id}
                    style={{ maxHeight: 320 }}
                    renderItem={({ item: n }) => (
                      <TouchableOpacity
                        style={styles.nodeItem}
                        onPress={() => { handleAssignNode(n.id); closeNodeSelector(); }}
                        activeOpacity={0.85}
                      >
                        <View style={styles.nodeIconContainer}>
                          <MaterialCommunityIcons name={getResourceIcon(n.type)} size={20} color={getResourceColor(n.type)} />
                        </View>
                        <View style={styles.nodeInfo}>
                          <Text style={styles.nodeName}>{n.name}</Text>
                          <Text style={styles.nodeLocation}>({n.x},{n.y}) • {calculateDistance({x:0,y:0}, n)}m</Text>
                          <ProgressBar value={n.currentAmount} max={n.capacity} style={styles.nodeProgress} />
                        </View>
                        <View style={styles.nodeStats}>
                          <Text style={styles.nodeCapacity}>{Math.round((n.currentAmount||0)/(n.capacity||1)*100)}%</Text>
                          <MaterialCommunityIcons name="chevron-right" size={18} color="#4CAF50" />
                        </View>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                      <Text style={styles.emptyText}>{searchQuery ? `No nodes for "${searchQuery}"` : `No ${selectedResourceType || 'nodes'} available`}</Text>
                    )}
                  />
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
