import { useState, useEffect, useContext, useRef } from "react";
import { View, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, CustomHeader } from "../../components";
import styles from "./styles";
import MapControls from "./components/MapControls/MapControls";
import MapGridControls from "./components/MapGridControls/MapGridControls";
import MapGrid from "./components/MapGrid";
import DiscoveryRadius from "./components/DiscoveryRadius";
import useWorldMapExploration from "../../hooks/useWorldMapExploration";
// import { useMachines } from "../../hooks/useMachines";
import { GameContext } from "../../contexts/GameContext";
import NodeCard from "./components/NodeCard/NodeCard";
import MapToast from "./components/MapToast/MapToast";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useMilestone } from "../../hooks/useMilestone";
import Colors from "../../constants/Colors";

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
    placedMachines,
    placeMachine,
    mineableNodes,
  } = useContext(GameContext);

  // manual mine feedback: stores last manually mined node id to show ripple on grid
  const [manualMineFeedback, setManualMineFeedback] = useState(null);
  const manualMineTimeoutRef = useRef(null);
  // signal counter to force re-triggering the ripple even for same nodeId
  const [manualMineSignal, setManualMineSignal] = useState(0);

  const [visualPlayerPos, setVisualPlayerPos] = useState(playerMapPosition);
  const [moveLocked, setMoveLocked] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(null);

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
    // Prevent moving into tiles that contain any resource node
    const nodeAtTarget = allResourceNodes.find((n) => n.x === x && n.y === y);
    if (nodeAtTarget) {
      // block movement into node tile
      return;
    }
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
  const pinnedNodeId =
    isManualPinActive && manualPinnedNodeId
      ? manualPinnedNodeId
      : closestNodeId;

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

  const handleTilePress = (node) => {
    setManualPinnedNodeId(node.id);
    setIsManualPinActive(true);
  };

  // Called by NodeCard when user manually mines a node
  const handleManualMine = (nodeId) => {
    // set id to trigger MapGrid overlay; clear previous timeout if present
    setManualMineFeedback(nodeId);
    // bump signal so MapGrid restarts animation even if nodeId === previous
    setManualMineSignal((s) => s + 1);
    if (manualMineTimeoutRef.current) {
      clearTimeout(manualMineTimeoutRef.current);
    }
    // keep feedback for 600ms then clear
    manualMineTimeoutRef.current = setTimeout(() => {
      setManualMineFeedback(null);
      manualMineTimeoutRef.current = null;
    }, 650);
  };

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <CustomHeader
        title="World Map"
        rightIcon="target"
        onRightIconPress={() => console.log("Map target pressed")}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <MapToast
          visible={toastVisible}
          message={toastMessage}
          onHide={() => setToastVisible(false)}
        />

        {/* Map Controls */}
        <MapControls
          onRegenerateSeed={regenerateSeed}
          onSetTestSeed={setTestSeed}
        />

        <View style={styles.mapVisualContainer}>
          <View
            style={{
              position: "relative",
              width: TILE_SIZE * VIEW_SIZE,
              height: TILE_SIZE * VIEW_SIZE,
              alignSelf: "center",
            }}
          >
            {/* Map Grid */}
            <MapGrid
              chunkSize={CHUNK_SIZE}
              tileSize={TILE_SIZE}
              visualPlayerPos={visualPlayerPos}
              allResourceNodes={allResourceNodes}
              discoveredNodes={discoveredNodes}
              handleTilePress={handleTilePress}
              navigation={navigation}
              pinnedNodeId={pinnedNodeId}
              placedMachines={placedMachines}
              currentDirection={currentDirection}
                manualMineFeedback={manualMineFeedback}
                manualMineSignal={manualMineSignal}
            />

            {/* Discovery Radius */}
            {/*  <DiscoveryRadius
              tileSize={TILE_SIZE}
              visualPlayerPos={visualPlayerPos}
              discoveryRadiusPx={DISCOVERY_RADIUS_PX}
              chunkSize={CHUNK_SIZE}
            /> */}
          </View>

          <View
            style={{
              flexDirection: "row",
              width: TILE_SIZE * VIEW_SIZE,
              minHeight: 90,
              marginTop: 16,
              marginBottom: 16,
              alignSelf: "center",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            {/* Player Info */}
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "column",
                gap: 8,
                borderWidth: 1,
                borderColor: Colors.border,
                borderRadius: 8,
                padding: 8,
                marginTop: 16,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <MaterialIcons
                  name="my-location"
                  size={18}
                  color={Colors.accentGold}
                  style={{ opacity: 0.85 }}
                />
                <Text style={{ fontSize: 12, color: Colors.textPrimary }}>
                  Position: ({visualPlayerPos.x}, {visualPlayerPos.y})
                </Text>
              </View>
            </View>

            {/* Movement Controls - Posicionados en el área del PlayerInfo */}
            <View style={{ position: "relative", alignSelf: "flex-end" }}>
              <MapGridControls
                MAP_DISPLAY_SIZE={TILE_SIZE * VIEW_SIZE}
                exploreDirection={handleExploreDirection}
                onMove={() => setIsManualPin(false)}
                onDirectionChange={(dir) => setCurrentDirection(dir)}
              />
            </View>
          </View>
        </View>

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
            onManualMine={handleManualMine}
            placeMachine={placeMachine}
            isExpanded={pinnedNodeId === item.id}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
