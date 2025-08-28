import React, { useMemo, useState, useRef, useEffect } from "react";
import { Animated, Easing, View, Text, TouchableOpacity } from "react-native";
// import { Picker } from "@react-native-picker/picker";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "./styles";
import ProgressBar from "../../../../components/ProgressBar";
import NodeSelectorModal from "./components/NodeSelectorModal";
import { useGame } from "../../../../contexts/GameContext";

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
  style={styles.machineCard}
    >
  <View style={styles.rowAlignCenter}>
        <View style={styles.machineInfo}>
          <View style={styles.rowSpaceBetween}>
            <View style={styles.rowAlignCenterGap}>
              <View style={styles.machineIconContainer}>
                {getMachineIcon(machine.type)}
              </View>
              <Text style={[styles.machineName, { color: "#4CAF50" }]}>
                {machine.displayName || machine.name || machine.type}
              </Text>
            </View>
            <TouchableOpacity onPress={onPress} style={styles.loupeButton} activeOpacity={0.7}>
              <MaterialIcons name="loupe" size={32} color="#bbb" />
            </TouchableOpacity>
          </View>
          {isMiner && (
            <View style={styles.marginVertical10}>
              <TouchableOpacity
                style={styles.assignNodeButton}
                onPress={openNodeSelector}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name="select-marker"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.assignNodeText}>
                  {liveMachine.assignedNodeId
                    ? "Change resource node"
                    : "Assign resource node"}
                </Text>
              </TouchableOpacity>
              {!liveMachine.assignedNodeId &&
                discoveredNodeOptions.length === 0 && (
                  <Text style={styles.noNodesText}>
                    No discovered, non-depleted nodes available.
                  </Text>
                )}
              
            </View>
          )}
          {showNodeSelector && (
            <NodeSelectorModal
              visible={showNodeSelector}
              slideAnim={slideAnim}
              onClose={closeNodeSelector}
              groupedNodes={groupedNodes}
              selectedResourceType={selectedResourceType}
              setSelectedResourceType={setSelectedResourceType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredNodes={filteredNodes}
              handleAssignNode={handleAssignNode}
              getResourceIcon={getResourceIcon}
              getResourceColor={getResourceColor}
              calculateDistance={calculateDistance}
            />
          )}
          {/* Node info and depletion/progress bar for any assigned node */}
          {node && (
            <View style={styles.nodeInfoContainer}>
              <ProgressBar
                value={nodeDepletionAmount}
                max={nodeCapacity}
                label={"Node Depletion"}
              />
              <Text style={styles.machineStatus}>
                {isIdle ? "Miner is on hold" : machine.statusText}
              </Text>
              {nodeDepletionAmount <= 0 && (
                <Text style={styles.nodeDepletedText}>
                  Node Depleted
                </Text>
              )}
              {isMiner && node && (
                <View style={styles.rowGap8MarginTop8}>
                  <TouchableOpacity
                    style={[styles.pauseResumeButton, isIdle ? styles.pauseResumeIdle : styles.pauseResumeActive]}
                    onPress={handlePauseResume}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons
                      name={isIdle ? "front-loader" : "pause"}
                      size={18}
                      color="#fff"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.pauseResumeText}>
                      {isIdle ? "Resume mining" : "Pause Miner"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.detachButton}
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
                    <Text style={styles.detachText}>
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
