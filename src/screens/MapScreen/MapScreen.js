import React, { useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGame } from "../../contexts/GameContext";
import { useMapNodes } from "../../hooks/useMapNodes";
import { items } from "../../data/items";
import styles from "./styles";
import { useMapGrid } from "../../hooks/useMapGrid";
import { getNodeTypeDefinition, getNodeColor } from "../../data/nodeTypes";
import MapLegend from "./components/MapLegend";
import MapGrid from "./components/MapGrid";
import NodeCard from "./components/NodeCard";
const { width: screenWidth } = Dimensions.get("window");
const MapScreen = () => {
  const {
    inventory,
    placedMachines,
    mineResource,
    placeMachine,
  } = useGame();
  const { allResourceNodes } = useMapNodes();

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
    console.log("Manual mining ",nodeId);
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

  const {
    MAP_DISPLAY_SIZE,
    PLAYER_DISPLAY_X,
    PLAYER_DISPLAY_Y,
    currentPlayerGameX,
    currentPlayerGameY,
    getDisplayCoords,
    gridLines,
  } = useMapGrid({ screenWidth });

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContentWrapper}>
        <Text style={styles.title}>Resource Map</Text>
{/* TODO: only the nodes that are suitable for placement will be displayed
this includes nodes that are mineable or have machines assigned */}
        <MapLegend />
{/* TODO: Move map to its own components inside the MapScreen/components folder */}
        <View style={styles.mapVisualContainer}>
          <MapGrid
            displayableNodes={displayableNodes}
            placedMachines={placedMachines}
            getDisplayCoords={getDisplayCoords}
            gridLines={gridLines}
            MAP_DISPLAY_SIZE={MAP_DISPLAY_SIZE}
            PLAYER_DISPLAY_X={PLAYER_DISPLAY_X}
            PLAYER_DISPLAY_Y={PLAYER_DISPLAY_Y}
            currentPlayerGameX={currentPlayerGameX}
            currentPlayerGameY={currentPlayerGameY}
            getNodeColor={getNodeColor}
            styles={styles}
          />
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
            <NodeCard
              key={node.id}
              node={node}
              inventory={inventory}
              onPlaceMachine={handlePlaceMachine}
              placedMachines={placedMachines}
              onMineResource={handleMineResource}
              styles={styles}
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
