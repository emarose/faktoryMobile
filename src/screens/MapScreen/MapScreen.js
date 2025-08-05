// MapScreen.js

import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import { getNodeColor } from "../../data/nodeTypes";
import styles from "./styles";
import MapGridControls from "./components/MapGridControls/MapGridControls";
import { useMapNodes } from "../../hooks/useMapNodes";
import useWorldMapExploration from "../../hooks/useWorldMapExploration";
import { useMachines } from "../../hooks/useMachines";
import { useProduction } from "../../hooks/useProduction";
import { GameContext } from "../../contexts/GameContext";
import NodeCard from "./components/NodeCard/NodeCard";
import PlayerInfoCard from "./components/PlayerInfoCard/PlayerInfoCard";
import MapToast from "./components/MapToast/MapToast";

const TILE_SIZE = 30;
const CHUNK_SIZE = 11;
const VIEW_SIZE = CHUNK_SIZE;
const DISCOVERY_RADIUS_PX = 47;
const PLAYER_COLOR = "#FF0000";

function generateChunk(cx, cy, resourceNodes) {
  const tiles = [];
  for (let y = 0; y < CHUNK_SIZE; y++) {
    tiles[y] = [];
    for (let x = 0; x < CHUNK_SIZE; x++) {
      const gx = cx * CHUNK_SIZE + x;
      const gy = cy * CHUNK_SIZE + y;
      const node = resourceNodes.find((n) => n.x === gx && n.y === gy);
      tiles[y][x] = { node: node || null };
    }
  }
  return { cx, cy, tiles };
}

export default function MapScreen({ navigation }) {
  const { allResourceNodes } = useMapNodes();
  const {
    discoveredNodes,
    setDiscoveredNodes,
    playerMapPosition,
    setPlayerMapPosition,
    toastShownNodeIds,
    setToastShownNodeIds,
    inventory,
    addResource,
    removeResources,
  } = useContext(GameContext);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { exploreDirection } = useWorldMapExploration(
    allResourceNodes,
    DISCOVERY_RADIUS_PX,
    discoveredNodes,
    setDiscoveredNodes,
    playerMapPosition,
    setPlayerMapPosition
  );

  useEffect(() => {
    const newlyDiscovered = Object.keys(discoveredNodes).filter(
      (id) => !toastShownNodeIds.has(id)
    );
    if (newlyDiscovered.length > 0) {
      const nodeId = newlyDiscovered[0];
      const node = allResourceNodes.find((n) => n.id === nodeId);
      if (node) {
        let displayName = node.name || node.type;
        if (!displayName.toLowerCase().includes("node")) {
          displayName += " Node";
        }
        setToastMessage(
          `Found new node: ${displayName} at (${node.x}, ${node.y})`
        );
        setToastVisible(true);
        setToastShownNodeIds((prev) => new Set(prev).add(nodeId));
        setTimeout(() => setToastVisible(false), 2500);
      }
    }
  }, [
    discoveredNodes,
    allResourceNodes,
    toastShownNodeIds,
    setToastShownNodeIds,
  ]);

  // Machines and mining logic
  const {
    mineableNodes,
    placeMachine,
    placedMachines,
    setPlacedMachines,
  } = useMachines(inventory, removeResources, allResourceNodes);

  useProduction(
    addResource,
    removeResources,
    placedMachines,
    mineableNodes
  );

  const [chunks, setChunks] = useState({});
  useEffect(() => {
    const cx = Math.floor(playerMapPosition.x / CHUNK_SIZE);
    const cy = Math.floor(playerMapPosition.y / CHUNK_SIZE);
    const key = `${cx},${cy}`;
    setChunks((prev) =>
      prev[key]
        ? prev
        : { ...prev, [key]: generateChunk(cx, cy, allResourceNodes) }
    );
  }, [playerMapPosition, allResourceNodes]);

  // Track node depletion amounts in local state
  const [nodeAmounts, setNodeAmounts] = useState(() => {
    const amounts = {};
    allResourceNodes.forEach(node => {
      amounts[node.id] = typeof node.currentAmount === "number" ? node.currentAmount : node.capacity || 50;
    });
    return amounts;
  });

  // Update nodeAmounts if new nodes are added
  useEffect(() => {
    setNodeAmounts(prev => {
      const updated = { ...prev };
      allResourceNodes.forEach(node => {
        if (typeof updated[node.id] !== "number") {
          updated[node.id] = typeof node.currentAmount === "number" ? node.currentAmount : node.capacity || 50;
        }
      });
      return updated;
    });
  }, [allResourceNodes]);

  // Node depletion callback for manual mining
  const handleDepleteNode = (nodeId, newAmount) => {
    setNodeAmounts(prev => ({ ...prev, [nodeId]: Math.max(0, newAmount) }));
    // Optionally, add resource to inventory when manually mining
    const node = allResourceNodes.find(n => n.id === nodeId);
    const nodeDefinition = node && node.type ? require('../../data/items').items[node.type] : null;
    if (nodeDefinition && nodeDefinition.output) {
      const resourceId = Object.keys(nodeDefinition.output)[0];
      addResource(resourceId, 1, nodeId);
    }
  };

  const [pinnedNodeId, setPinnedNodeId] = useState(null);
  // Merge nodeAmounts into displayableNodes for correct ProgressBar
  let displayableNodes = mineableNodes
    .filter((node) => discoveredNodes[node.id])
    .map((node) => ({ ...node, currentAmount: nodeAmounts[node.id] }));
  displayableNodes = displayableNodes.sort((a, b) => {
    if (pinnedNodeId) {
      if (a.id === pinnedNodeId) return -1;
      if (b.id === pinnedNodeId) return 1;
    }
    const distA = Math.max(
      Math.abs(playerMapPosition.x - a.x),
      Math.abs(playerMapPosition.y - a.y)
    );
    const distB = Math.max(
      Math.abs(playerMapPosition.x - b.x),
      Math.abs(playerMapPosition.y - b.y)
    );
    return distA - distB;
  });

  const renderTiles = () => {
    const rows = [];
    const px = playerMapPosition.x;
    const py = playerMapPosition.y;
    const cx = Math.floor(px / CHUNK_SIZE);
    const cy = Math.floor(py / CHUNK_SIZE);
    const chunk = chunks[`${cx},${cy}`];
    if (!chunk) return rows;

    for (let y = 0; y < CHUNK_SIZE; y++) {
      const cols = [];
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const gx = cx * CHUNK_SIZE + x;
        const gy = cy * CHUNK_SIZE + y;
        const tile = chunk.tiles[y][x];
        const isPlayer = gx === px && gy === py;
        let color = isPlayer ? PLAYER_COLOR : "#222";

        const discovered = tile.node && discoveredNodes[tile.node.id];
        if (discovered) {
          color = getNodeColor(tile.node.type);
        }

        if (tile.node && discovered) {
          cols.push(
            <Pressable
              key={`${gx}-${gy}`}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: "#555",
              }}
              onPress={() => setPinnedNodeId(tile.node.id)}
            />
          );
        } else {
          cols.push(
            <View
              key={`${gx}-${gy}`}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: "#555",
              }}
            />
          );
        }
      }
      rows.push(
        <View key={`row-${y}`} style={{ flexDirection: "row" }}>
          {cols}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={styles.fullScreenContainer}>
      <MapToast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
      <Text style={styles.title}>Resource Map</Text>

      <View style={styles.mapVisualContainer}>
        <View
          style={{
            position: "relative",
            width: TILE_SIZE * VIEW_SIZE,
            height: TILE_SIZE * VIEW_SIZE,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              width: TILE_SIZE * VIEW_SIZE,
              height: TILE_SIZE * VIEW_SIZE,
            }}
          >
            {renderTiles()}
          </View>

          {/* Radio de descubrimiento */}
          <View
            style={{
              position: "absolute",
              left:
                (((playerMapPosition.x % CHUNK_SIZE) + CHUNK_SIZE) %
                  CHUNK_SIZE) *
                  TILE_SIZE +
                TILE_SIZE / 2 -
                DISCOVERY_RADIUS_PX,
              top:
                (((playerMapPosition.y % CHUNK_SIZE) + CHUNK_SIZE) %
                  CHUNK_SIZE) *
                  TILE_SIZE +
                TILE_SIZE / 2 -
                DISCOVERY_RADIUS_PX,
              width: DISCOVERY_RADIUS_PX * 2,
              height: DISCOVERY_RADIUS_PX * 2,
              borderRadius: DISCOVERY_RADIUS_PX,
              borderWidth: 2,
              borderColor: "#27ae60",
              opacity: 0.2,
              backgroundColor: "#27ae60",
              zIndex: 2,
            }}
          />

          {/* Controles */}
          <View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: TILE_SIZE * VIEW_SIZE,
              height: TILE_SIZE * VIEW_SIZE,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MapGridControls
              MAP_DISPLAY_SIZE={TILE_SIZE * VIEW_SIZE}
              exploreDirection={exploreDirection}
            />
          </View>
        </View>
      </View>

      <PlayerInfoCard
        playerPosition={playerMapPosition}
        discoveredCount={displayableNodes.length}
      />

      {/* Lista de NodeCard debajo del mapa */}
      <FlatList
        data={displayableNodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NodeCard
            node={item}
            inventory={inventory}
            placedMachines={placedMachines}
            styles={styles}
            playerPosition={playerMapPosition}
            discoveryRadius={DISCOVERY_RADIUS_PX}
            onDepleteNode={handleDepleteNode}
            placeMachine={placeMachine}
          />
        )}
        style={styles.nodeList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
