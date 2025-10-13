import React, { useState, useMemo, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, ImageBackground, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, CustomHeader } from "../../components";
import { useGame } from "../../contexts/GameContext";
import { items } from "../../data/items";
import { getNodeColor, getNodeTypeDefinition } from "../../data/nodeTypes";
import Colors from "../../constants/Colors";
import styles from "./styles";
import { GameAssets } from "../../components/AppLoader";

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
    updateOwnedMachine,
  } = useGame();

  const [selectedResourceType, setSelectedResourceType] = useState(null);

  // Filter discovered and available nodes
  const discoveredNodeOptions = useMemo(
    () =>
      allResourceNodes.filter(
        (n) =>
          discoveredNodes[n.id] &&
          (typeof n.currentAmount !== "number" || n.currentAmount > 0)
      ),
    [allResourceNodes, discoveredNodes]
  );

  // Group nodes by type
  const groupedNodes = useMemo(
    () =>
      discoveredNodeOptions.reduce((acc, node) => {
        const type = node.type || "unknown";
        if (!acc[type]) acc[type] = [];
        acc[type].push(node);
        return acc;
      }, {}),
    [discoveredNodeOptions]
  );

  const resourceTypes = Object.keys(groupedNodes);

  // Get the nodes to display (filtered by selected type)
  const nodesToDisplay = selectedResourceType
    ? groupedNodes[selectedResourceType] || []
    : discoveredNodeOptions;

  const handleSelectNode = useCallback(
    (node) => {
      // Si la máquina ya está en placedMachines, actualizar su nodo
      const existingMachine = placedMachines.find((m) => m.id === machine.id);
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
          isIdle: false,
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
    },
    [machine, placedMachines, setPlacedMachines, updateOwnedMachine, navigation]
  );

  const calculateDistance = useCallback(
    (node) => {
      if (!playerMapPosition || !node) return 0;
      const dx = node.x - playerMapPosition.x;
      const dy = node.y - playerMapPosition.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    [playerMapPosition]
  );

  const getResourceIcon = (type) => {
    const iconMap = {
      ironOre_node: "cube-outline",
      copperOre_node: "circle-outline",
      coal_node: "fire",
      limestone_node: "shape-outline",
      rawQuartz_node: "diamond-stone",
      crudeOil_node: "oil",
      cateriumOre_node: "lightning-bolt",
      sulfur_node: "flask-outline",
      bauxite_node: "layers-outline",
      uranium_node: "radioactive",
    };
    return iconMap[type] || "help-circle-outline";
  };

  const getResourceTypeLabel = (type) => {
    // Use node definition if available
    const nodeDefinition = getNodeTypeDefinition(type);
    if (nodeDefinition && nodeDefinition.name) {
      return nodeDefinition.name.replace(' Node', '');
    }
    
    // Otherwise use a formatted version of the type name
    const resourceNameMap = {
      'ironOre_node': 'Iron Ore',
      'copperOre_node': 'Copper Ore',
      'coal_node': 'Coal',
      'limestone_node': 'Limestone',
      'cateriumOre_node': 'Caterium Ore',
      'rawQuartz_node': 'Raw Quartz',
      'sulfur_node': 'Sulfur',
      'bauxite_node': 'Bauxite',
      'uranium_node': 'Uranium'
    };
    
    return resourceNameMap[type] || type.replace('_node', '').replace(/([A-Z])/g, ' $1').trim();
  };
  
  const getNodeAssetIcon = (type) => {
    // First check if we have the exact node type icon
    if (GameAssets.icons[type]) {
      return GameAssets.icons[type];
    }
    
    // Next try with the node suffix if not already present
    if (!type.includes('_node') && GameAssets.icons[`${type}_node`]) {
      return GameAssets.icons[`${type}_node`];
    }
    
    // If we don't have the exact node icon, try to get a related resource icon
    const resourceType = type.replace('_node', '');
    if (GameAssets.icons[resourceType]) {
      return GameAssets.icons[resourceType];
    }
    
    // Try common mappings
    const iconMappings = {
      'coal_node': 'coal',
      'cateriumOre_node': 'cateriumOre',
      'ironOre_node': 'ironOre',
      'copperOre_node': 'copperOre',
      'limestone_node': 'limestone',
      'rawQuartz_node': 'rawQuartz'
    };
    
    if (iconMappings[type] && GameAssets.icons[iconMappings[type]]) {
      return GameAssets.icons[iconMappings[type]];
    }
    
    // Use default icon as fallback
    return GameAssets.icons.default;
  };
  
  const getFilterResourceIcon = (type) => {
    // For filter buttons, we always want the resource icon (not the node icon)
    // First try to get the base resource by removing _node suffix
    if (type.includes('_node')) {
      const baseResource = type.replace('_node', '');
      if (GameAssets.icons[baseResource]) {
        return GameAssets.icons[baseResource];
      }
    }
    
    // If we don't have a matching resource icon, use common mappings
    const filterIconMappings = {
      'ironOre_node': 'ironOre',
      'copperOre_node': 'copperOre',
      'coal_node': 'coal',
      'limestone_node': 'limestone',
      'cateriumOre_node': 'cateriumOre',
      'rawQuartz_node': 'rawQuartz',
      'sulfur_node': 'sulfur',
      'bauxite_node': 'bauxite',
      'uranium_node': 'uranium'
    };
    
    if (filterIconMappings[type] && GameAssets.icons[filterIconMappings[type]]) {
      return GameAssets.icons[filterIconMappings[type]];
    }
    
    // If no mapping is found, try to use the original type or fall back to default
    return GameAssets.icons[type] || GameAssets.icons.default;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('../../../assets/images/backgrounds/miner.jpeg')}
        style={styles.backgroundImage}
      />
      <CustomHeader
        onBackPress={"DeployedMachinesScreen"}
        title="Select Resource Node"
        showBackButton={true}
        //rightIcon="crosshairs-gps"
        //onRightIconPress={() => console.log("Node selector tools pressed")}
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
                    <Text
                      style={[
                        styles.filterButtonText,
                        !selectedResourceType && styles.filterButtonTextActive,
                      ]}
                    >
                      All Resources
                    </Text>
                  </TouchableOpacity>

                  {resourceTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterButton,
                        selectedResourceType === type &&
                          styles.filterButtonActive,
                      ]}
                      onPress={() => setSelectedResourceType(type)}
                    >
                      {GameAssets.icons[type.replace('_node', '')] || GameAssets.icons[type] ? (
                        <Image 
                          source={getFilterResourceIcon(type)}
                          style={[
                            styles.filterResourceIcon, 
                            { opacity: selectedResourceType === type ? 1 : 0.7 }
                          ]}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name={getResourceIcon(type)}
                          size={16}
                          color={
                            selectedResourceType === type
                              ? Colors.textPrimary
                              : Colors.textSecondary
                          }
                          style={{ marginRight: 8 }}
                        />
                      )}
                      <Text
                        style={[
                          styles.filterButtonText,
                          selectedResourceType === type &&
                            styles.filterButtonTextActive,
                        ]}
                      >
                        {getResourceTypeLabel(type)}
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
                  const nodeAmount =
                    nodeAmounts[node.id] ?? node.capacity ?? 1000;
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
                      <View
                        style={[
                          styles.nodeIconContainer,
                          { backgroundColor: "rgba(255, 255, 255, 0.1)"},
                        ]}
                      >
                        {GameAssets.icons[node.type] ? (
                          <Image 
                            source={getNodeAssetIcon(node.type)}
                            style={styles.resourceIcon}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            name={getResourceIcon(node.type)}
                            size={24}
                            color={Colors.textPrimary}
                          />
                        )}
                      </View>

                      <View style={styles.nodeInfo}>
                        <Text style={styles.nodeName}>
                          {nodeDefinition?.name ||
                            node.type ||
                            "Unknown Resource"}
                        </Text>
                        <View style={styles.nodeLocation}>
                          <MaterialCommunityIcons
                            name="map-marker"
                            size={14}
                            color="#b8c7d1"
                            style={styles.locationIcon}
                          />
                          <Text style={{ color: "#b8c7d1", fontSize: 12 }}>
                            ({node.x.toFixed(0)}, {node.y.toFixed(0)})
                          </Text>
                          
                       
                        </View>
                        <View style={styles.nodeStats}>
                          <View style={styles.nodeAmountContainer}>
                            <MaterialCommunityIcons
                              name="database"
                              size={14}
                              color={isAvailable ? "#2196F3" : Colors.textDanger}
                              style={styles.statIcon}
                            />
                            <Text
                              style={[
                                styles.nodeAmount,
                                !isAvailable && styles.nodeAmountDepleted,
                              ]}
                            >
                              {nodeAmount} / {node.capacity || 1000}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.availabilityIndicator,
                              {
                                backgroundColor: isAvailable
                                  ? Colors.success
                                  : Colors.error,
                              },
                            ]}
                          />
                        </View>
                        {nodeDefinition?.output && Object.keys(nodeDefinition.output).length > 0 && (
                          <View style={styles.outputContainer}>
                            <View style={styles.outputLabelContainer}>
                              <MaterialCommunityIcons
                                name="factory"
                                size={12}
                                color="#b8c7d1"
                              />
                              <Text style={styles.outputLabel}>Produces</Text>
                            </View>
                            {Object.entries(nodeDefinition.output).map(([resourceId, amount]) => {
                              const resourceIcon = GameAssets.icons[resourceId];
                              const resourceName = items[resourceId]?.name || resourceId;
                              return (
                                <View key={resourceId} style={styles.outputItemContainer}>
                                  {resourceIcon && (
                                    <Image 
                                      source={resourceIcon} 
                                      style={styles.outputIcon} 
                                    />
                                  )}
                                  <Text style={styles.outputName}>
                                    {amount}x {resourceName}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </View>

                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={
                          isAvailable
                            ? Colors.miner
                            : Colors.textSecondary
                        }
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
                    {GameAssets.icons[machine.type] ? (
                      <Image 
                        source={GameAssets.icons[machine.type]}
                        style={styles.resourceIcon}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="pickaxe"
                        size={28}
                        color={Colors.miner}
                      />
                    )}
                  </View>
                  <View style={styles.machineDetails}>
                    <Text style={styles.machineTitle}>
                      {items[machine.type]?.name || machine.type}
                    </Text>
                    <Text style={styles.machineSubtitle}>ID: {machine.id}</Text>
                    <Text style={styles.machineStatus}>
                      Status:{" "}
                      {machine.assignedNodeId ? "Deployed" : "Unassigned"}
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
