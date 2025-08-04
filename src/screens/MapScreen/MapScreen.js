// MapScreen.js

import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { getNodeColor } from "../../data/nodeTypes";
import styles from "./styles";
import MapGridControls from "./components/MapGridControls/MapGridControls";
import { useMapNodes } from "../../hooks/useMapNodes";
import useWorldMapExploration from "../../hooks/useWorldMapExploration";
import { GameContext } from "../../contexts/GameContext";
import NodeCard from "./components/NodeCard/NodeCard";

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
    playerMapPosition,
    discoveredNodes,
    exploreDirection,
  } = useWorldMapExploration(allResourceNodes, DISCOVERY_RADIUS_PX);

  // Si tu contexto incluye inventario y máquinas:
  const { inventory, placedMachines } = useContext(GameContext);

  const [chunks, setChunks] = useState({});

  // Generar o recuperar el chunk actual
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

  // Nodos ya descubiertos
  const displayableNodes = allResourceNodes.filter(
    (node) => discoveredNodes[node.id]
  );

  // Callbacks para NodeCard
  const onMineResource = (nodeId) => {
    console.log("Mining resource on node", nodeId);
    // TODO: lógica de minería
  };

  const onPlaceMachine = (machineType, nodeId) => {
    console.log("Placing machine", machineType, "on node", nodeId);
    // TODO: lógica de colocación de máquinas
  };

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

          {/* Radio de descubrimiento */}
          <View
            style={{
              position: "absolute",
              left:
                ((playerMapPosition.x % CHUNK_SIZE + CHUNK_SIZE) %
                  CHUNK_SIZE) *
                  TILE_SIZE +
                TILE_SIZE / 2 -
                DISCOVERY_RADIUS_PX,
              top:
                ((playerMapPosition.y % CHUNK_SIZE + CHUNK_SIZE) %
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

      <Text style={styles.info}>
        Player: ({playerMapPosition.x}, {playerMapPosition.y})
      </Text>
      <Text style={styles.info}>
        Nodos descubiertos: {displayableNodes.length}
      </Text>

      {/* Lista de NodeCard debajo del mapa */}
      <Text style={styles.sectionTitle}>Detalles de nodos descubiertos</Text>
      <FlatList
        data={displayableNodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NodeCard
            node={item}
            inventory={inventory}
            placedMachines={placedMachines}
            onMineResource={onMineResource}
            onPlaceMachine={onPlaceMachine}
            styles={styles}
            playerPosition={playerMapPosition}
            discoveryRadius={DISCOVERY_RADIUS_PX}
          />
        )}
        style={styles.nodeList}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}