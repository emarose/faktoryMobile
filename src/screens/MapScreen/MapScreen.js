import { Text, View, ScrollView, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGame } from "../../contexts/GameContext";
import { items } from "../../data/items";
import styles from "./styles";
import { useMapGrid } from "../../hooks/useMapGrid";
import { getNodeColor } from "../../data/nodeTypes";
import useWorldMapExploration from "../../hooks/useWorldMapExploration";
import React, { useState } from "react";
import MapGrid from "./components/MapGrid/MapGrid";
import NodeCard from "./components/NodeCard/NodeCard";
const { width: screenWidth } = Dimensions.get("window");

const MapScreen = () => {
  const { inventory, placedMachines, mineResource, placeMachine } = useGame();
  const { resourceNodes, setResourceNodes } = useGame();

  // Exploration logic
  const {
    discoveredNodes,
    playerMapPosition,
    exploreArea,
    getDiscoveredNodes,
    exploreDirection,
    lastDirection,
  } = useWorldMapExploration(resourceNodes);

  // Track map offset for chunked map rendering
  const CHUNK_SIZE = 300;
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    // Calcula la nueva esquina superior izquierda del chunk.
    // Usa `Math.trunc()` para manejar correctamente los valores negativos.
    const newOffsetX =
      Math.trunc(playerMapPosition.x / CHUNK_SIZE) * CHUNK_SIZE;
    const newOffsetY =
      Math.trunc(playerMapPosition.y / CHUNK_SIZE) * CHUNK_SIZE;

    // Si el nuevo offset es diferente al actual, actualízalo.
    if (newOffsetX !== mapOffset.x || newOffsetY !== mapOffset.y) {
      setMapOffset({ x: newOffsetX, y: newOffsetY });
    }
  }, [
    playerMapPosition.x,
    playerMapPosition.y,
    mapOffset.x,
    mapOffset.y,
    CHUNK_SIZE,
  ]);
  const handlePlaceMachine = (machineType, nodeId) => {
    const nodeIdx = resourceNodes.findIndex((n) => n.id === nodeId);
    if (nodeIdx === -1) return;
    const node = resourceNodes[nodeIdx];
    // Simulate miner extraction: decrease node currentAmount by 1 (or more if needed)
    if (node.currentAmount < node.capacity) {
      const updatedNodes = [...resourceNodes];
      updatedNodes[nodeIdx] = {
        ...node,
        currentAmount: Math.min(node.currentAmount + 1, node.capacity),
      };
      setResourceNodes(updatedNodes);
    }
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
    const nodeIdx = resourceNodes.findIndex((n) => n.id === nodeId);
    if (nodeIdx === -1) return;
    const node = resourceNodes[nodeIdx];
    // Manual mining: decrease node currentAmount by 1
    if (node.currentAmount < node.capacity) {
      const updatedNodes = [...resourceNodes];
      updatedNodes[nodeIdx] = {
        ...node,
        currentAmount: Math.min(node.currentAmount + 1, node.capacity),
      };
      setResourceNodes(updatedNodes);
    }
    mineResource(nodeId);
    console.log("Manual mining ", nodeId);
  };

  // Only show discovered nodes within the current chunk
  const displayableNodes = React.useMemo(() => {
    return resourceNodes.filter((node) => {
      if (!discoveredNodes[node.id]) return false;
      // Only render nodes within the current chunk
      if (
        node.x < mapOffset.x ||
        node.x >= mapOffset.x + CHUNK_SIZE ||
        node.y < mapOffset.y ||
        node.y >= mapOffset.y + CHUNK_SIZE
      ) {
        return false;
      }
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
  }, [resourceNodes, inventory, placedMachines, discoveredNodes, mapOffset.x, mapOffset.y]);

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

        {/*  <MapLegend /> */}
        <View style={styles.mapVisualContainer}>
          <View style={{ position: "relative" }}>
            <MapGrid
              displayableNodes={displayableNodes.map((node) => ({
                ...node,
                chunkX: node.x - mapOffset.x,
                chunkY: node.y - mapOffset.y,
              }))}
              placedMachines={placedMachines}
              getDisplayCoords={getDisplayCoords}
              gridLines={gridLines}
              MAP_DISPLAY_SIZE={MAP_DISPLAY_SIZE}
              PLAYER_DISPLAY_X={getDisplayCoords(playerMapPosition.x - mapOffset.x, playerMapPosition.y - mapOffset.y).x}
              PLAYER_DISPLAY_Y={getDisplayCoords(playerMapPosition.x - mapOffset.x, playerMapPosition.y - mapOffset.y).y}
              currentPlayerGameX={playerMapPosition.x}
              currentPlayerGameY={playerMapPosition.y}
              getNodeColor={getNodeColor}
              styles={styles}
              lastDirection={lastDirection}
              mapOffset={mapOffset}
              exploreDirection={exploreDirection}
            />
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
