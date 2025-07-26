// screens/map/MapScreen.js
import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView, // Make the main content scrollable
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGame } from "../../contexts/GameContext";
import { items } from "../../data/items";
import styles from "./styles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// --- Node Color and Type Mapping (Moved for easier legend generation) ---
const NODE_TYPES_MAP = [
  { type: "ironOre_node", name: "Iron Ore", color: "#A0522D" },
  { type: "copperOre_node", name: "Copper Ore", color: "#B87333" },
  { type: "limestone_node", name: "Limestone", color: "#D3D3D3" },
  { type: "coal_node", name: "Coal", color: "#222222" },
  { type: "cateriumOre_node", name: "Caterium Ore", color: "#DAA520" },
  { type: "rawQuartz_node", name: "Raw Quartz", color: "#ADD8E6" },
  { type: "sulfur_node", name: "Sulfur", color: "#FFFF00" },
  { type: "crudeOil_node", name: "Crude Oil", color: "#4B0082" },
  { type: "bauxite_node", name: "Bauxite", color: "#CD5C5C" },
  { type: "uranium_node", name: "Uranium", color: "#00FF00" },
];

const getNodeColor = (nodeType) => {
  const found = NODE_TYPES_MAP.find((item) => item.type === nodeType);
  return found ? found.color : "#808080"; // Grey for unknown
};

// --- NodeDisplayForPlacement Component (no changes needed) ---
const NodeDisplayForPlacement = React.memo(
  ({ node, inventory, onPlaceMachine, placedMachines, onMineResource }) => {
    const { id: nodeId, name, x, y, type: nodeType } = node;
    const nodeDefinition = items[nodeType];

    if (!nodeDefinition) {
      console.warn(
        `Definition for node type ${nodeType} not found in items.js`
      );
      return null;
    }

    const { manualMineable, machineRequired, output } = nodeDefinition;

    const producedItemId = output ? Object.keys(output)[0] : null;
    const producedItemName = producedItemId
      ? items[producedItemId]?.name || producedItemId
      : "Unknown Resource";

    const assignedMachinesOnNode = placedMachines.filter(
      (m) => m.assignedNodeId === nodeId && m.type === machineRequired
    );
    const assignedMachineCount = assignedMachinesOnNode.length;

    const automatedProductionRate = assignedMachinesOnNode.reduce(
      (totalRate, machine) => {
        return (
          totalRate + (output[producedItemId] || 0) * (machine.efficiency || 1)
        );
      },
      0
    );

    const minerCountInInventory = inventory.miner?.currentAmount || 0;
    const oilExtractorCountInInventory =
      inventory.oilExtractor?.currentAmount || 0;

    const canPlaceMiner =
      minerCountInInventory > 0 &&
      machineRequired === "miner" &&
      assignedMachineCount === 0;
    const canPlaceOilExtractor =
      oilExtractorCountInInventory > 0 &&
      machineRequired === "oilExtractor" &&
      assignedMachineCount === 0;

    const showManualMineButton = manualMineable;

    return (
      <View style={styles.nodeCard}>
        <Text style={styles.nodeName}>{name}</Text>
        <Text style={styles.nodeDescription}>
          ({x}, {y}) - Produces: {producedItemName}
        </Text>

        {manualMineable && (
          <Text style={styles.nodeCapability}>Manually Mineable</Text>
        )}
        {machineRequired && (
          <Text style={styles.nodeCapability}>
            Automated Extraction: Requires{" "}
            <Text style={styles.requiredMachineText}>
              {items[machineRequired]?.name || machineRequired}
            </Text>
          </Text>
        )}

        {assignedMachineCount > 0 && (
          <View style={styles.assignedInfo}>
            <Text style={styles.assignedCount}>
              Machines Assigned: {assignedMachineCount}
            </Text>
            <Text style={styles.automatedRate}>
              Current Yield: +{automatedProductionRate.toFixed(1)}/s{" "}
              {producedItemName}
            </Text>
          </View>
        )}

        <View style={styles.placementActions}>
          {showManualMineButton && (
            <TouchableOpacity
              style={styles.mineButton}
              onPress={() => onMineResource(nodeId)}
            >
              <Text style={styles.mineButtonText}>Manual Mine</Text>
            </TouchableOpacity>
          )}

          {machineRequired === "miner" && canPlaceMiner && (
            <TouchableOpacity
              style={styles.placeButton}
              onPress={() => onPlaceMachine("miner", nodeId)}
            >
              <Text style={styles.placeButtonText}>
                Place Miner ({minerCountInInventory} available)
              </Text>
            </TouchableOpacity>
          )}
          {machineRequired === "oilExtractor" && canPlaceOilExtractor && (
            <TouchableOpacity
              style={styles.placeButton}
              onPress={() => onPlaceMachine("oilExtractor", nodeId)}
            >
              <Text style={styles.placeButtonText}>
                Place Oil Extractor ({oilExtractorCountInInventory} available)
              </Text>
            </TouchableOpacity>
          )}

          {machineRequired &&
            assignedMachineCount === 0 &&
            !canPlaceMiner &&
            !canPlaceOilExtractor && (
              <Text style={styles.noMachineText}>
                Need {items[machineRequired]?.name || machineRequired} to
                automate this node
              </Text>
            )}
          {machineRequired && assignedMachineCount > 0 && (
            <Text style={styles.alreadyAssignedText}>
              {items[machineRequired]?.name || machineRequired} already assigned
              to this node.
            </Text>
          )}
        </View>
      </View>
    );
  }
);

const MapScreen = () => {
  const {
    inventory,
    allResourceNodes,
    placedMachines,
    mineResource,
    placeMachine,
  } = useGame();

  const handlePlaceMachine = (machineType, nodeId) => {
    const success = placeMachine(machineType, nodeId);
    if (!success) {
      Alert.alert(
        "Placement Failed",
        "You might not have enough machines or this node isn't suitable, or it already has a machine."
      );
    } else {
      Alert.alert(
        "Machine Placed!",
        `${items[machineType]?.name || machineType} successfully placed.`
      );
    }
  };

  const handleMineResource = (nodeId) => {
    mineResource(nodeId);
    Alert.alert("Mined!", "You gathered some resources!");
  };

  const displayableNodes = useMemo(() => {
    return allResourceNodes.filter((node) => {
      const nodeDefinition = items[node.type];
      if (!nodeDefinition || !nodeDefinition.output) {
        return false;
      }

      if (nodeDefinition.manualMineable) {
        return true;
      }

      if (nodeDefinition.machineRequired) {
        const requiredMachineType = nodeDefinition.machineRequired;
        const machineInInventoryCount =
          inventory[requiredMachineType]?.currentAmount || 0;
        const isMachineAssigned = placedMachines.some(
          (m) => m.assignedNodeId === node.id && m.type === requiredMachineType
        );

        return machineInInventoryCount > 0 || isMachineAssigned;
      }

      return false;
    });
  }, [allResourceNodes, inventory, placedMachines]);

  // --- Map Grid and Coordinate Logic ---
  // Assuming player starts at 0,0. Define world to show relative to that.
  // We'll show a square area around (0,0).
  const HALF_WORLD_EXTENT = 300; // e.g., map from -300 to +300 on each axis

  const WORLD_MIN_X = -HALF_WORLD_EXTENT;
  const WORLD_MAX_X = HALF_WORLD_EXTENT;
  const WORLD_MIN_Y = -HALF_WORLD_EXTENT;
  const WORLD_MAX_Y = HALF_WORLD_EXTENT;

  const MAP_WIDTH_GAME_UNITS = WORLD_MAX_X - WORLD_MIN_X; // Total width in game units
  const MAP_HEIGHT_GAME_UNITS = WORLD_MAX_Y - WORLD_MIN_Y; // Total height in game units

  // Adjust map display size to be a bit smaller
  const MAP_DISPLAY_SIZE = screenWidth * 0.75; // e.g., 75% of screen width for a square map

  // Player's fixed position on the *display* (center of the map visual)
  const PLAYER_DISPLAY_X = MAP_DISPLAY_SIZE / 2;
  const PLAYER_DISPLAY_Y = MAP_DISPLAY_SIZE / 2;

  // Player's fixed game world position
  const currentPlayerGameX = 0; // Always 0,0 for starting point
  const currentPlayerGameY = 0;

  // Since player is at 0,0 and we want 0,0 to be centered, no offset is strictly needed
  // if mapping -HALF_WORLD_EXTENT to 0 and +HALF_WORLD_EXTENT to MAP_DISPLAY_SIZE
  // But for clarity, we can still use an offset concept where (0,0) is centered.
  const offsetX =
    PLAYER_DISPLAY_X -
    ((currentPlayerGameX - WORLD_MIN_X) / MAP_WIDTH_GAME_UNITS) *
      MAP_DISPLAY_SIZE;
  const offsetY =
    PLAYER_DISPLAY_Y -
    ((currentPlayerGameY - WORLD_MIN_Y) / MAP_HEIGHT_GAME_UNITS) *
      MAP_DISPLAY_SIZE;

  // Function to get display coordinates for a game world point
  const getDisplayCoords = (gameX, gameY) => {
    const scaledX =
      ((gameX - WORLD_MIN_X) / MAP_WIDTH_GAME_UNITS) * MAP_DISPLAY_SIZE;
    const scaledY =
      ((gameY - WORLD_MIN_Y) / MAP_HEIGHT_GAME_UNITS) * MAP_DISPLAY_SIZE;
    return {
      x: scaledX + offsetX,
      y: scaledY + offsetY,
    };
  };

  // Grid line density (e.g., every 50 units)
  const GRID_SPACING = 50; // Keep consistent grid spacing

  // Generate grid lines and axis labels
  const gridLines = useMemo(() => {
    const lines = [];

    // Vertical lines (X-axis)
    for (let x = WORLD_MIN_X; x <= WORLD_MAX_X; x += GRID_SPACING) {
      const { x: displayX } = getDisplayCoords(x, WORLD_MIN_Y);
      lines.push(
        <View
          key={`vx-${x}`}
          style={[
            styles.gridLine,
            { left: displayX, top: 0, bottom: 0, width: 1 },
          ]}
        />
      );
      if (x % (GRID_SPACING * 1) === 0) {
        // Label every 1 grid line for density
        lines.push(
          <Text
            key={`lx-${x}`}
            style={[styles.axisLabelX, { left: displayX + 2, bottom: 2 }]}
          >
            {x}
          </Text>
        );
      }
    }

    // Horizontal lines (Y-axis)
    for (let y = WORLD_MIN_Y; y <= WORLD_MAX_Y; y += GRID_SPACING) {
      const { y: displayY } = getDisplayCoords(WORLD_MIN_X, y);
      lines.push(
        <View
          key={`hy-${y}`}
          style={[
            styles.gridLine,
            { top: displayY, left: 0, right: 0, height: 1 },
          ]}
        />
      );
      if (y % (GRID_SPACING * 1) === 0) {
        // Label every 1 grid line for density
        lines.push(
          <Text
            key={`ly-${y}`}
            style={[styles.axisLabelY, { top: displayY + 2, left: 2 }]}
          >
            {y}
          </Text>
        );
      }
    }
    return lines;
  }, [
    MAP_DISPLAY_SIZE,
    WORLD_MIN_X,
    WORLD_MAX_X,
    WORLD_MIN_Y,
    WORLD_MAX_Y,
    GRID_SPACING,
    offsetX,
    offsetY,
  ]);

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContentWrapper}>
        <Text style={styles.title}>Resource Map</Text>

        <View style={styles.mapLegend}>
          <Text style={styles.mapLegendTitle}>Node Types</Text>
          <View style={styles.mapLegendItems}>
            {NODE_TYPES_MAP.map((nodeType) => (
              <View key={nodeType.type} style={styles.mapLegendItem}>
                <View
                  style={[
                    styles.mapLegendColorBox,
                    { backgroundColor: nodeType.color },
                  ]}
                />
                <Text style={styles.mapLegendText}>{nodeType.name}</Text>
              </View>
            ))}
            <View style={styles.mapLegendItem}>
              <Text style={styles.machineIconLegend}>⚙️</Text>
              <Text style={styles.mapLegendText}>Machine Assigned</Text>
            </View>
          </View>
        </View>

        <View style={styles.mapVisualContainer}>
          <View
            style={[
              styles.mapGrid,
              { width: MAP_DISPLAY_SIZE, height: MAP_DISPLAY_SIZE },
            ]}
          >
            {gridLines}
            <View
              style={[
                styles.playerPositionDot,
                { left: PLAYER_DISPLAY_X, top: PLAYER_DISPLAY_Y },
              ]}
            />
            <Text
              style={[
                styles.playerPositionLabel,
                { left: PLAYER_DISPLAY_X + 10, top: PLAYER_DISPLAY_Y - 5 },
              ]}
            >
              You ({currentPlayerGameX},{currentPlayerGameY})
            </Text>

            {displayableNodes.map((node) => {
              const { x: displayX, y: displayY } = getDisplayCoords(
                node.x,
                node.y
              );
              const nodeColor = getNodeColor(node.type);
              const isAssigned = placedMachines.some(
                (m) => m.assignedNodeId === node.id
              );

              return (
                <View
                  key={`map-node-${node.id}`}
                  style={[
                    styles.mapNodeDot,
                    {
                      left: displayX,
                      top: displayY,
                      backgroundColor: nodeColor,
                      borderColor: isAssigned ? "#00FF00" : nodeColor,
                      borderWidth: isAssigned ? 2 : 1,
                    },
                  ]}
                >
                  {isAssigned && <Text style={styles.machineIcon}>⚙️</Text>}
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.subtitle}>Available Mining Sites</Text>
        <View style={styles.inventorySummary}>
          <Text style={styles.inventoryStatus}>
            Miners Available: {inventory.miner?.currentAmount || 0}
          </Text>
          <Text style={styles.inventoryStatus}>
            Oil Extractors Available:{" "}
            {inventory.oilExtractor?.currentAmount || 0}
          </Text>
        </View>

        {displayableNodes.length > 0 ? (
          displayableNodes.map((node) => (
            <NodeDisplayForPlacement
              key={node.id}
              node={node}
              inventory={inventory}
              onPlaceMachine={handlePlaceMachine}
              placedMachines={placedMachines}
              onMineResource={handleMineResource}
            />
          ))
        ) : (
          <Text style={styles.noNodesText}>
            No active mining sites available. Build more machines or explore!
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MapScreen;
