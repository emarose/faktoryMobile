import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from "react-native";
import { getNodeColor } from "../../data/nodeTypes";
import styles from "./styles";
import MapGridControls from "./components/MapGridControls/MapGridControls";
import useWorldMapExploration from "../../hooks/useWorldMapExploration";
import { useMachines } from "../../hooks/useMachines";
import { GameContext } from "../../contexts/GameContext";
import NodeCard from "./components/NodeCard/NodeCard";
import MapToast from "./components/MapToast/MapToast";
import { MaterialIcons } from "@expo/vector-icons";

const TILE_SIZE = 30;
const CHUNK_SIZE = 11;
const VIEW_SIZE = CHUNK_SIZE;
const DISCOVERY_RADIUS_PX = 47;

export default function MapScreen({ navigation }) {
  const { allResourceNodes, regenerateSeed, setTestSeed } =
    useContext(GameContext);
  const {
    discoveredNodes,
    setDiscoveredNodes,
    playerMapPosition,
    setPlayerMapPosition,
    toastShownNodeIds,
    setToastShownNodeIds,
    inventory,
    removeResources,
    nodeAmounts,
    handleDepleteNode,
  } = useContext(GameContext);

  const [visualPlayerPos, setVisualPlayerPos] = useState(playerMapPosition);
  const [moveLocked, setMoveLocked] = useState(false);

  useEffect(() => {
    setVisualPlayerPos(playerMapPosition);
    setMoveLocked(false);
  }, [playerMapPosition]);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [manualPinnedNodeId, setManualPinnedNodeId] = useState(null);
  const [isManualPinActive, setIsManualPinActive] = useState(false);

  const handleExploreDirection = (dir) => {
    if (moveLocked) return;
    let { x, y } = visualPlayerPos;
    if (dir === "up") y -= 1;
    if (dir === "down") y += 1;
    if (dir === "left") x -= 1;
    if (dir === "right") x += 1;
    setVisualPlayerPos({ x, y });
    setMoveLocked(true);
    setIsManualPinActive(false);
    setManualPinnedNodeId(null);
    setTimeout(() => setPlayerMapPosition({ x, y }), 0);
  };

  const { exploreDirection } = useWorldMapExploration(
    allResourceNodes,
    DISCOVERY_RADIUS_PX,
    discoveredNodes,
    setDiscoveredNodes,
    visualPlayerPos,
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

  // Compute closest node for auto-pin
  let closestNodeId = null;
  let minDist = Infinity;
  mineableNodes.forEach((node) => {
    if (discoveredNodes[node.id]) {
      const dx = (playerMapPosition.x - node.x) * TILE_SIZE;
      const dy = (playerMapPosition.y - node.y) * TILE_SIZE;
      const euclideanDist = Math.sqrt(dx * dx + dy * dy);
      if (euclideanDist <= DISCOVERY_RADIUS_PX && euclideanDist < minDist) {
        closestNodeId = node.id;
        minDist = euclideanDist;
      }
    }
  });
  // Nodo actualmente "pinned" (manual o auto)
  const pinnedNodeId = isManualPinActive && manualPinnedNodeId ? manualPinnedNodeId : closestNodeId;

  // Merge nodeAmounts into displayableNodes for correct ProgressBar
  let displayableNodes = mineableNodes
    .filter((node) => discoveredNodes[node.id])
    .map((node) => {
      const cap = typeof node.capacity === "number" ? node.capacity : 1000;
      const amt = nodeAmounts[node.id];
      return {
        ...node,
        currentAmount: typeof amt === "number" && amt >= 0 ? amt : cap,
      };
    });

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

  // Render tiles proceduralmente usando allResourceNodes y la posición visual del jugador
  const renderTiles = () => {
    const rows = [];
    const px = visualPlayerPos.x;
    const py = visualPlayerPos.y;
    const cx = Math.floor(px / CHUNK_SIZE);
    const cy = Math.floor(py / CHUNK_SIZE);
    // Para cada tile visible en la grilla
    for (let y = 0; y < CHUNK_SIZE; y++) {
      const cols = [];
      for (let x = 0; x < CHUNK_SIZE; x++) {
        const gx = cx * CHUNK_SIZE + x;
        const gy = cy * CHUNK_SIZE + y;
        const node = allResourceNodes.find((n) => n.x === gx && n.y === gy);
        const isPlayer = gx === px && gy === py;
        let color = "#222";
        let discovered = false;
        if (node && discoveredNodes[node.id]) {
          color = getNodeColor(node.type);
          discovered = true;
        }
        if (isPlayer) {
          cols.push(
            <View
              key={`${gx}-${gy}`}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: "#555",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 200,
              }}
            >
              <MaterialIcons
                name="my-location"
                size={24}
                color="#FFD700"
                style={{ opacity: 0.85 }}
              />
            </View>
          );
        } else if (node && discovered) {
          cols.push(
            <Pressable
              key={`${gx}-${gy}`}
              style={{
                width: TILE_SIZE,
                height: TILE_SIZE,
                backgroundColor: color,
                borderWidth: pinnedNodeId !== node.id ? 1 : 2,
                borderColor: pinnedNodeId !== node.id ? "#555" : "#FFD700",
                zIndex: 100,
              }}
              onPress={() => {
                setManualPinnedNodeId(node.id);
                setIsManualPinActive(true);
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
    <ScrollView
      style={styles.fullScreenContainer}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <MapToast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
      {/* Row of icon-buttons (placeholder) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 8,
        }}
      >
        {/* Botón momentáneo para regenerar el seed del mundo */}
        <TouchableOpacity
          style={{
            marginHorizontal: 8,
            backgroundColor: "#23233a",
            borderRadius: 16,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderWidth: 2,
            borderColor: "#FFD700",
          }}
          onPress={regenerateSeed}
        >
          <Text style={{ color: "#FFD700", fontWeight: "bold" }}>
            Cambiar Seed Mundo
          </Text>
        </TouchableOpacity>
        {/* Botón para activar el seed de test */}
        <TouchableOpacity
          style={{
            marginHorizontal: 8,
            backgroundColor: "#23233a",
            borderRadius: 16,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderWidth: 2,
            borderColor: "#00BFFF",
          }}
          onPress={setTestSeed}
        >
          <Text style={{ color: "#00BFFF", fontWeight: "bold" }}>
            Seed Test
          </Text>
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
                (((visualPlayerPos.x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE) *
                  TILE_SIZE +
                TILE_SIZE / 2 -
                DISCOVERY_RADIUS_PX,
              top:
                (((visualPlayerPos.y % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE) *
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
              exploreDirection={handleExploreDirection}
              onMove={() => setIsManualPin(false)}
            />
          </View>
        </View>

        <View
          style={{
            zIndex: 300,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
            alignSelf: "flex-end",
          }}
        >
          <MaterialIcons
            name="my-location"
            size={18}
            color="#FFD700"
            style={{ opacity: 0.85, marginRight: 4 }}
          />
          <Text style={{ fontSize: 13, color: "#e0e0e0", fontWeight: "bold" }}>
            ({visualPlayerPos.x}, {visualPlayerPos.y})
          </Text>
        </View>
      </View>

      {/* Lista de NodeCard debajo del mapa */}
      {/* Estado para controlar la card expandida */}

      {displayableNodes.map((item) => (
        <NodeCard
          key={item.id}
          node={item}
          nodeDepletionAmount={item.currentAmount}
          inventory={inventory}
          placedMachines={placedMachines}
          styles={styles}
          playerPosition={playerMapPosition}
          onDepleteNode={handleDepleteNode}
          placeMachine={placeMachine}
          isExpanded={pinnedNodeId === item.id}
        />
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
