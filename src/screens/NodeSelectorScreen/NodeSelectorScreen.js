import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, CustomHeader } from "../../components";
import { useGame } from "../../contexts/GameContext";
import { items } from "../../data/items";
import Colors from "../../constants/Colors";
import styles from "./styles";

const NodeSelectorScreen = ({ route, navigation }) => {
  // Get machine from route params
  const machine = route?.params?.machine || null;

  const {
    allResourceNodes,
    discoveredNodes,
    nodeAmounts,
    setPlacedMachines,
    playerMapPosition, 
    placedMachines,
    ownedMachines,
    updateOwnedMachine
  } = useGame();

  const [selectedResourceType, setSelectedResourceType] = useState(null);

  // Filter discovered and available nodes
  const discoveredNodeOptions = useMemo(() => 
    allResourceNodes.filter(
      (n) =>
        discoveredNodes[n.id] &&
        (typeof n.currentAmount !== "number" || n.currentAmount > 0)
    ), [allResourceNodes, discoveredNodes]
  );

  // Group nodes by type
  const groupedNodes = useMemo(() => 
    discoveredNodeOptions.reduce((acc, node) => {
      const type = node.type || 'unknown';
      if (!acc[type]) acc[type] = [];
      acc[type].push(node);
      return acc;
    }, {}), [discoveredNodeOptions]
  );

  const resourceTypes = Object.keys(groupedNodes);

  // Get the nodes to display (filtered by selected type)
  const nodesToDisplay = selectedResourceType
    ? groupedNodes[selectedResourceType] || []
    : discoveredNodeOptions;

  const handleSelectNode = useCallback((node) => {
    console.log(`Assigning node ${node.id} to machine ${machine.id}`);
    
    // Si la máquina ya está en placedMachines, actualizar su nodo
    const existingMachine = placedMachines.find(m => m.id === machine.id);
    if (existingMachine) {
      setPlacedMachines((prevPlaced) =>
        prevPlaced.map((m) =>
          m.id === machine.id
            ? { ...m, assignedNodeId: node.id, isIdle: false }
            : m
        )
      );
    } else {
      // Si no está en placedMachines, moverla de ownedMachines a placedMachines
      const machineToPlace = {
        ...machine,
        assignedNodeId: node.id,
        isIdle: false
      };
      
      // Agregar a placedMachines
      setPlacedMachines((prevPlaced) => [...prevPlaced, machineToPlace]);
      
      // Marcar como colocada en ownedMachines para evitar duplicados
      if (updateOwnedMachine) {
        updateOwnedMachine(machine.id, { isPlaced: true });
      }
    }
    
    // Navigate back
    navigation.goBack();
  }, [machine, placedMachines, setPlacedMachines, updateOwnedMachine, navigation]);

  const calculateDistance = useCallback((node) => {
    if (!playerMapPosition || !node) return 0;
    const dx = node.x - playerMapPosition.x;
    const dy = node.y - playerMapPosition.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, [playerMapPosition]);

  const getResourceIcon = (type) => {
    const iconMap = {
      ironOre_node: "cube-outline",
      copperOre_node: "circle-outline",
      coal_node: "fire",
      limestone_node: "shape-outline",
      quartz_node: "diamond-stone",
      crudeOil_node: "oil",
      cateriumOre_node: "lightning-bolt",
    };
    return iconMap[type] || "help-circle-outline";
  };

  const getResourceColor = (type) => {
    const colorMap = {
      ironOre_node: "#8B7355",
      copperOre_node: "#B87333",
      coal_node: "#2C2C2C",
      limestone_node: "#F5F5DC",
      quartz_node: "#E6E6FA",
      crudeOil_node: "#1C1C1C",
      cateriumOre_node: "#FFD700",
    };
    return colorMap[type] || "#666";
  };

  const resourceTypeLabels = {
    ironOre_node: "Iron Ore",
    copperOre_node: "Copper Ore",
    coal_node: "Coal",
    limestone_node: "Limestone",
    quartz_node: "Quartz Crystal",
    crudeOil_node: "Crude Oil",
    cateriumOre_node: "Caterium Ore",
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader 
        title="Select Resource Node"
        showBackButton={true}
        rightIcon="crosshairs-gps"
        onRightIconPress={() => console.log("Node selector tools pressed")}
      />
      <View style={styles.container}>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Resource Type Filter */}
          {resourceTypes.length > 1 && (
            <View style={styles.industrialPanel}>
              <View style={styles.panelHeader}>
                <Text style={styles.panelTitle}>Filter by Resource</Text>
              </View>
              <View style={styles.panelContent}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterContainer}
                >
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      !selectedResourceType && styles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedResourceType(null)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      !selectedResourceType && styles.filterButtonTextActive,
                    ]}>
                      All Resources
                    </Text>
                  </TouchableOpacity>

                  {resourceTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterButton,
                        selectedResourceType === type && styles.filterButtonActive,
                      ]}
                      onPress={() => setSelectedResourceType(type)}
                    >
                      <MaterialCommunityIcons
                        name={getResourceIcon(type)}
                        size={16}
                        color={selectedResourceType === type ? Colors.textPrimary : Colors.textSecondary}
                        style={{ marginRight: 8 }}
                      />
                      <Text style={[
                        styles.filterButtonText,
                        selectedResourceType === type && styles.filterButtonTextActive,
                      ]}>
                        {resourceTypeLabels[type] || type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {/* Node List */}
          <View style={styles.industrialPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>
                Available Nodes ({nodesToDisplay.length})
              </Text>
            </View>
            <View style={styles.panelContent}>
              {nodesToDisplay.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="map-marker-off"
                    size={48}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.noNodesText}>
                    No available nodes found for this resource type.
                  </Text>
                  <Text style={styles.noNodesSubtext}>
                    Explore the map to discover more resource nodes.
                  </Text>
                </View>
              ) : (
                nodesToDisplay.map((node) => {
                  const nodeDefinition = node.type ? items[node.type] : null;
                  const nodeAmount = nodeAmounts[node.id] ?? node.capacity ?? 1000;
                  const isAvailable = nodeAmount > 0;
                  const distance = calculateDistance(node);

                  return (
                    <TouchableOpacity
                      key={node.id}
                      style={[
                        styles.nodeItem,
                        !isAvailable && styles.nodeItemDisabled,
                      ]}
                      onPress={() => isAvailable && handleSelectNode(node)}
                      disabled={!isAvailable}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.nodeIconContainer,
                        { backgroundColor: getResourceColor(node.type) }
                      ]}>
                        <MaterialCommunityIcons
                          name={getResourceIcon(node.type)}
                          size={24}
                          color={Colors.textPrimary}
                        />
                      </View>

                      <View style={styles.nodeInfo}>
                        <Text style={styles.nodeName}>
                          {nodeDefinition?.name || node.type || "Unknown Resource"}
                        </Text>
                        <Text style={styles.nodeLocation}>
                          Location: ({node.x}, {node.y}) • Distance: {distance.toFixed(1)}
                        </Text>
                        <View style={styles.nodeStats}>
                          <Text style={[
                            styles.nodeAmount,
                            !isAvailable && styles.nodeAmountDepleted
                          ]}>
                            Available: {nodeAmount} / {node.capacity || 1000}
                          </Text>
                          <View style={[
                            styles.availabilityIndicator,
                            { backgroundColor: isAvailable ? Colors.success : Colors.error }
                          ]} />
                        </View>
                      </View>

                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={isAvailable ? Colors.textAccent : Colors.textSecondary}
                      />
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>

          {/* Machine Info Panel */}
          {machine && (
            <View style={styles.industrialPanel}>
              <View style={styles.panelHeader}>
                <Text style={styles.panelTitle}>Machine Information</Text>
              </View>
              <View style={styles.panelContent}>
                <View style={styles.machineInfoCard}>
                  <View style={styles.machineIcon}>
                    <MaterialCommunityIcons
                      name="pickaxe"
                      size={28}
                      color={Colors.textAccent}
                    />
                  </View>
                  <View style={styles.machineDetails}>
                    <Text style={styles.machineTitle}>
                      {items[machine.type]?.name || machine.type}
                    </Text>
                    <Text style={styles.machineSubtitle}>
                      ID: {machine.id}
                    </Text>
                    <Text style={styles.machineStatus}>
                      Status: {machine.assignedNodeId ? "Deployed" : "Unassigned"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default React.memo(NodeSelectorScreen);