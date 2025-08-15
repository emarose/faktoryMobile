
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
  Dimensions,
  ScrollView,
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
import { MaterialIcons } from "@expo/vector-icons";

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
    nodeAmounts,
    setNodeAmounts,
    handleDepleteNode
  } = useContext(GameContext);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [pinnedNodeId, setPinnedNodeId] = useState(null);
  const [isManualPin, setIsManualPin] = useState(false);

  const { exploreDirection } = useWorldMapExploration(
    allResourceNodes,
    DISCOVERY_RADIUS_PX,
    discoveredNodes,
    setDiscoveredNodes,
    playerMapPosition,
    setPlayerMapPosition,
    () => handleManualPin
  );
  const handleManualPin = () => {
    setIsManualPin(false);
  };
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
  const { mineableNodes, placeMachine, placedMachines, setPlacedMachines } =
    useMachines(inventory, removeResources, allResourceNodes);

  useProduction(addResource, removeResources, placedMachines, mineableNodes, nodeAmounts, handleDepleteNode);

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



  useEffect(() => {
    if (isManualPin) return;

    let closestNodeId = null;
    let minDist = Infinity;
    // Only auto-pin nodes strictly inside the discovery area (circle)
    mineableNodes.forEach((node) => {
      if (discoveredNodes[node.id]) {
        const dx = (playerMapPosition.x - node.x) * TILE_SIZE;
        const dy = (playerMapPosition.y - node.y) * TILE_SIZE;
        const euclideanDist = Math.sqrt(dx * dx + dy * dy);
        // Only consider nodes strictly inside the discovery area
        if (euclideanDist <= DISCOVERY_RADIUS_PX && euclideanDist < minDist) {
          closestNodeId = node.id;
          minDist = euclideanDist;
        }
      }
    });

    // If a node just entered the discovery area, auto-pin it
    if (closestNodeId && pinnedNodeId !== closestNodeId) {
      setPinnedNodeId(closestNodeId);
      setIsManualPin(false); // New pin is automatic
    } else if (!closestNodeId && pinnedNodeId && !isManualPin) {
      // If no nodes are close and the current pin is not manual, remove it
      setPinnedNodeId(null);
    }
  }, [
    playerMapPosition,
    mineableNodes,
    discoveredNodes,
    pinnedNodeId,
    isManualPin,
  ]);

  // Merge nodeAmounts into displayableNodes for correct ProgressBar
  let displayableNodes = mineableNodes
    .filter((node) => discoveredNodes[node.id])
    .map((node) => ({
      ...node,
      currentAmount: typeof nodeAmounts[node.id] === 'number'
        ? nodeAmounts[node.id]
        : (typeof node.currentAmount === 'number' ? node.currentAmount : node.capacity || 50)
    }));

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
        let color = "#222";
        const discovered = tile.node && discoveredNodes[tile.node.id];
        if (discovered) {
          color = getNodeColor(tile.node.type);
        }

        // Player tile: center MaterialIcons my-location, same background as others
        if (isPlayer) {
          cols.push(
            <View
              key={`${gx}-${gy}`}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: '#555',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 200,
              }}
            >
              <MaterialIcons name="my-location" size={22} color="#FFD700" style={{ opacity: 0.85 }} />
            </View>
          );
        } else if (tile.node && discovered) {
          cols.push(
            <Pressable
              key={`${gx}-${gy}`}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: pinnedNodeId !== tile.node.id ? "#555" : "#27ae60",
                zIndex: 100,
              }}
              onPress={() => {
                setPinnedNodeId(tile.node.id);
                setIsManualPin(true);
              }}
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
    <ScrollView style={styles.fullScreenContainer} contentContainerStyle={{ flexGrow: 1 }}>
      <MapToast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
      {/* Row of icon-buttons (placeholder) */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 8 }}>
        <TouchableOpacity style={{ marginHorizontal: 8, backgroundColor: '#23233a', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 16, borderWidth: 2, borderColor: '#FFD700' }} onPress={() => { }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>Botón 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginHorizontal: 8, backgroundColor: '#23233a', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 16, borderWidth: 2, borderColor: '#FFD700' }} onPress={() => { }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>Botón 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginHorizontal: 8, backgroundColor: '#23233a', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 16, borderWidth: 2, borderColor: '#FFD700' }} onPress={() => { }}>
          <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>Botón 3</Text>
        </TouchableOpacity>
      </View>
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
              opacity: 0.15,
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
              onMove={() => setIsManualPin(false)}
            />
          </View>
        </View>


        <View style={{
          zIndex: 300, flexDirection: 'row', alignItems: 'center', marginTop: 8, alignSelf: "flex-end"
        }}>
          <MaterialIcons name="my-location" size={18} color="#FFD700" style={{ opacity: 0.85, marginRight: 4 }} />
          <Text style={{ fontSize: 13, color: '#e0e0e0', fontWeight: 'bold' }}>({playerMapPosition.x}, {playerMapPosition.y})</Text>
        </View>
      </View>

      {/* Lista de NodeCard debajo del mapa */}
      {displayableNodes.map((item) => (
        <NodeCard
          key={item.id}
          node={item}
          nodeDepletionAmount={item.currentAmount}
          inventory={inventory}
          placedMachines={placedMachines}
          styles={styles}
          playerPosition={playerMapPosition}

          placeMachine={placeMachine}
        />
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
