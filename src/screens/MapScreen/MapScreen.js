import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import styles from "./styles";
import { NODE_TYPES_MAP, getNodeColor } from "../../data/nodeTypes";
import MapGridControls from "./components/MapGridControls/MapGridControls";
import { useMapNodes } from "../../hooks/useMapNodes";
import useWorldMapExploration from "../../hooks/useWorldMapExploration";

const TILE_SIZE = 30;
const CHUNK_SIZE = 11; // 11x11 grid
const VIEW_SIZE = CHUNK_SIZE;

const PLAYER_COLOR = "#FF0000";

function generateChunk(cx, cy, resourceNodes) {
  const tiles = [];
  for (let y = 0; y < CHUNK_SIZE; y++) {
    tiles[y] = [];
    for (let x = 0; x < CHUNK_SIZE; x++) {
      // Calculate global coordinates for this tile
      const gx = cx * CHUNK_SIZE + x;
      const gy = cy * CHUNK_SIZE + y;
      // Find a resource node at this position
      const node = resourceNodes.find((n) => n.x === gx && n.y === gy);
      if (node) {
        tiles[y][x] = { type: node.type, node };
      } else {
        tiles[y][x] = { type: null };
      }
    }
  }
  return { cx, cy, tiles };
}

const MapScreen = () => {
  // Center player on grid (5,5 for 0-based 11x11)
  const center = Math.floor(CHUNK_SIZE / 2);
  const [player, setPlayer] = useState({ x: center, y: center });
  const [chunks, setChunks] = useState({});
  const { allResourceNodes } = useMapNodes();
  const {
    discoveredNodes,
    playerMapPosition,
    exploreArea,
    getDiscoveredNodes,
    exploreDirection,
    lastDirection,
  } = useWorldMapExploration(allResourceNodes);

  useEffect(() => {
    // On mount, set exploration logic to center if at 0,0
    if (playerMapPosition.x === 0 && playerMapPosition.y === 0) {
      exploreArea(center, center);
      setPlayer({ x: center, y: center });
    } else {
      setPlayer({ x: playerMapPosition.x, y: playerMapPosition.y });
    }
    const cx = Math.floor(playerMapPosition.x / CHUNK_SIZE);
    const cy = Math.floor(playerMapPosition.y / CHUNK_SIZE);
    const key = `${cx},${cy}`;
    if (!chunks[key]) {
      setChunks((prev) => ({ ...prev, [key]: generateChunk(cx, cy, allResourceNodes) }));
    }
    // Only discover nodes after first movement
    if (playerMapPosition.x !== 0 || playerMapPosition.y !== 0) {
      exploreArea(playerMapPosition.x, playerMapPosition.y);
    }
  }, [playerMapPosition.x, playerMapPosition.y, allResourceNodes]);

  const movePlayer = (dx, dy) => {
    const nx = player.x + dx;
    const ny = player.y + dy;
    exploreArea(nx, ny);
  };

  const DISCOVERY_RADIUS = 47;

  const renderTiles = () => {
    const tiles = [];
    const cx = Math.floor(player.x / CHUNK_SIZE);
    const cy = Math.floor(player.y / CHUNK_SIZE);
    const chunkKey = `${cx},${cy}`;
    const chunk = chunks[chunkKey];
    if (!chunk) return tiles;
    for (let y = 0; y < CHUNK_SIZE; y++) {
      const rowTiles = [];
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const gx = cx * CHUNK_SIZE + x;
        const gy = cy * CHUNK_SIZE + y;
        const isPlayer = gx === player.x && gy === player.y;
        let color = isPlayer ? PLAYER_COLOR : "#222";
        const tileNode = chunk.tiles[y][x]?.node;
        // Only show discovered nodes (once discovered, always visible)
        let showNode = false;
        if (tileNode && discoveredNodes[tileNode.id]) {
          color = isPlayer ? PLAYER_COLOR : getNodeColor(tileNode.type);
          showNode = true;
        }
        rowTiles.push(
          <View
            key={`${gx}-${gy}`}
            style={{
              width: TILE_SIZE,
              height: TILE_SIZE,
              backgroundColor: color,
              borderWidth: 1,
              borderColor: "#999",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Show node name if present and discovered */}
            {showNode && (
              <Text style={{ fontSize: 8, color: "#fff", textAlign: "center" }}>
                {tileNode.name}
              </Text>
            )}
          </View>
        );
      }
      tiles.push(
        <View key={`row-${y}`} style={{ flexDirection: "row" }}>
          {rowTiles}
        </View>
      );
    }
    return tiles;
  };

  return (
    <View style={styles.fullScreenContainer}>
      <Text style={styles.title}>Resource Map</Text>
      <View style={styles.mapVisualContainer}>
        <View style={{ position: "relative", width: TILE_SIZE * VIEW_SIZE, height: TILE_SIZE * VIEW_SIZE, alignSelf: "center" }}>
          <View style={[styles.grid, { flexDirection: "column", width: TILE_SIZE * VIEW_SIZE, height: TILE_SIZE * VIEW_SIZE }]}>
            {renderTiles()}
          </View>
          {/* Discovery radius visual */}
          <View
            style={{
              position: "absolute",
              left: player.x % CHUNK_SIZE * TILE_SIZE + TILE_SIZE / 2 - DISCOVERY_RADIUS,
              top: player.y % CHUNK_SIZE * TILE_SIZE + TILE_SIZE / 2 - DISCOVERY_RADIUS,
              width: DISCOVERY_RADIUS * 2,
              height: DISCOVERY_RADIUS * 2,
              borderRadius: DISCOVERY_RADIUS,
              borderWidth: 2,
              borderColor: "#27ae60",
              opacity: 0.2,
              backgroundColor: "#27ae60",
              zIndex: 2,
            }}
          />
          <View style={{ position: "absolute", left: 0, top: 0, width: TILE_SIZE * VIEW_SIZE, height: TILE_SIZE * VIEW_SIZE, justifyContent: "center", alignItems: "center" }}>
            <MapGridControls
              MAP_DISPLAY_SIZE={TILE_SIZE * VIEW_SIZE}
              exploreDirection={(dir) => {
                if (dir === "up") movePlayer(0, -1);
                else if (dir === "down") movePlayer(0, 1);
                else if (dir === "left") movePlayer(-1, 0);
                else if (dir === "right") movePlayer(1, 0);
              }}
            />
          </View>
        </View>
      </View>
      <Text style={styles.info}>Player: ({player.x}, {player.y})</Text>
      <Text style={styles.info}>Discovered Nodes: {Object.keys(discoveredNodes).length}</Text>
    </View>
  );
};

export default MapScreen;
