import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { getNodeColor } from "../../data/nodeTypes";
import MapGridControls from "./components/MapGridControls/MapGridControls";
import { useMapNodes } from "../../hooks/useMapNodes";
import useWorldMapExploration from "../../hooks/useWorldMapExploration";

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
      const node = resourceNodes.find(n => n.x === gx && n.y === gy);
      tiles[y][x] = { node: node || null };
    }
  }
  return { cx, cy, tiles };
}

export default function MapScreen() {
  // Desestructuramos el objeto que viene del hook
  const { allResourceNodes, NODE_TYPES_MAP } = useMapNodes();

  const {
    playerMapPosition,
    discoveredNodes,
    exploreDirection,
  } = useWorldMapExploration(allResourceNodes, DISCOVERY_RADIUS_PX);

  const [chunks, setChunks] = useState({});

  // Cargar el chunk actual bajo demanda
  useEffect(() => {
    const cx = Math.floor(playerMapPosition.x / CHUNK_SIZE);
    const cy = Math.floor(playerMapPosition.y / CHUNK_SIZE);
    const key = `${cx},${cy}`;
    setChunks(prev => {
      if (prev[key]) return prev;
      return {
        ...prev,
        [key]: generateChunk(cx, cy, allResourceNodes),
      };
    });
  }, [playerMapPosition, allResourceNodes]);

  // Filtramos únicamente los nodos descubiertos
  const displayableNodes = allResourceNodes.filter(
    node => discoveredNodes[node.id]
  );

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
        const isPlayer = gx === px && gy === py;
        let color = isPlayer ? PLAYER_COLOR : "#222";

        const tileNode = chunk.tiles[y][x].node;
        const discovered = displayableNodes.find(n => n.id === tileNode?.id);
        if (discovered) {
          color = getNodeColor(discovered.type);
        }

        cols.push(
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
            {discovered && (
              <Text style={{ fontSize: 8, color: "#fff", textAlign: "center" }}>
                {discovered.name}
              </Text>
            )}
          </View>
        );
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
          <View
            style={{
              position: "absolute",
              left:
                ((playerMapPosition.x % CHUNK_SIZE) + CHUNK_SIZE) %
                  CHUNK_SIZE *
                  TILE_SIZE +
                TILE_SIZE / 2 -
                DISCOVERY_RADIUS_PX,
              top:
                ((playerMapPosition.y % CHUNK_SIZE) + CHUNK_SIZE) %
                  CHUNK_SIZE *
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
      <Text style={styles.info}>
        Player: ({playerMapPosition.x}, {playerMapPosition.y})
      </Text>
      <Text style={styles.info}>
        Discovered Nodes: {displayableNodes.length}
      </Text>
    </View>
  );
}