import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "./styles";
import Colors from "../../constants/Colors";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import { getNodeColor, getNodeTypeDefinition } from "../../data/nodeTypes";
import { Text, CustomHeader } from "../../components";
import { GameAssets } from "../../components/AppLoader";

const ExtractorScreen = ({ route, navigation }) => {
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

  // Filter discovered oil nodes only
  const discoveredNodeOptions = useMemo(
    () =>
      allResourceNodes.filter(
        (n) =>
          discoveredNodes[n.id] &&
          (typeof n.currentAmount !== "number" || n.currentAmount > 0) &&
          n.type === "crudeOil_node" // Only show crude oil nodes
      ),
    [allResourceNodes, discoveredNodes]
  );

  // Handle selecting a node
  const handleSelectNode = useCallback(
    (node) => {
      // If the machine is already in placedMachines, update its node
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
        // If it's not in placedMachines, move it from ownedMachines to placedMachines
        const machineToPlace = {
          ...machine,
          assignedNodeId: node.id,
          isIdle: false,
        };

        // Add to placedMachines
        setPlacedMachines((prevPlaced) => [...prevPlaced, machineToPlace]);

        // Mark as placed in ownedMachines to avoid duplicates
        if (updateOwnedMachine) {
          updateOwnedMachine(machine.id, { isPlaced: true });
        }
      }

      // Navigate back
      navigation.goBack();
    },
    [machine, placedMachines, setPlacedMachines, updateOwnedMachine, navigation]
  );

  // Calculate distance from player to node
  const calculateDistance = useCallback(
    (node) => {
      if (!playerMapPosition || !node) return 0;
      const dx = node.x - playerMapPosition.x;
      const dy = node.y - playerMapPosition.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    [playerMapPosition]
  );

  // Helper functions for node display
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
      'crudeOil_node': 'Crude Oil',
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
      'crudeOil_node': 'crudeOil',
    };
    
    if (iconMappings[type] && GameAssets.icons[iconMappings[type]]) {
      return GameAssets.icons[iconMappings[type]];
    }
    
    // Use default icon as fallback
    return GameAssets.icons.default;
  };

 

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('../../../assets/images/backgrounds/miner.jpeg')}
        style={styles.backgroundImage}
      />
      <CustomHeader
        onBackPress={"DeployedMachinesScreen"}
        title="Select Oil Node"
        showBackButton={true}
        rightIcon="oil"
        borderColor="#ff9800"
        onRightIconPress={() => console.log("Extractor tools pressed")}
      />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Node List */}
          <View style={styles.industrialPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>
                Available Oil Nodes ({discoveredNodeOptions.length})
              </Text>
            </View>
            <View style={styles.panelContent}>
              {discoveredNodeOptions.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="map-marker-off"
                    size={48}
                    color={Colors.textSecondary}
                  />
                  <Text style={styles.noNodesText}>
                    No oil nodes found.
                  </Text>
                  <Text style={styles.noNodesSubtext}>
                    Explore the map to discover oil resource nodes.
                  </Text>
                </View>
              ) : (
                discoveredNodeOptions.map((node) => {
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
                      </View>

                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={
                          isAvailable
                            ? "#ff9800"
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
                        name="oil"
                        size={28}
                        color="#ff9800"
                      />
                    )}
                  </View>
                  <View style={styles.machineDetails}>
                    <Text style={styles.machineTitle}>
                      {items[machine.type]?.name || "Extractor"}
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

export default React.memo(ExtractorScreen);
