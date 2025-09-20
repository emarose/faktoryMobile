import { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  InteractionManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, CustomHeader } from "../../components";
import { getNodeColor } from "../../data/nodeTypes";
import styles from "./styles";
import MapControls from "./components/MapControls/MapControls";
import MapGridControls from "./components/MapGridControls/MapGridControls";
import MapGrid from "./components/MapGrid";
import PlayerInfo from "./components/PlayerInfo";
import DiscoveryRadius from "./components/DiscoveryRadius";
import useWorldMapExploration from "../../hooks/useWorldMapExploration";
import { useMachines } from "../../hooks/useMachines";
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
const MAP_SIZE = CHUNK_SIZE;

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
  const { currentMilestone, progress, nextMilestone } = useMilestone();

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
  const { mineableNodes, placeMachine, placedMachines } = useMachines(
    inventory,
    removeResources,
    allResourceNodes
  );

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

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <CustomHeader 
        title="World Map"
        rightIcon="target"
        onRightIconPress={() => console.log("Map target pressed")}
      />
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
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
          />

          {/* Discovery Radius */}
          <DiscoveryRadius
            tileSize={TILE_SIZE}
            visualPlayerPos={visualPlayerPos}
            discoveryRadiusPx={DISCOVERY_RADIUS_PX}
            chunkSize={CHUNK_SIZE}
          />
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
          <PlayerInfo
            visualPlayerPos={visualPlayerPos}
       /*      currentMilestone={currentMilestone}
            nextMilestone={nextMilestone} */
          />
        </View>

        {/* Movement Controls */}
        <MapGridControls
          MAP_DISPLAY_SIZE={TILE_SIZE * VIEW_SIZE}
          exploreDirection={handleExploreDirection}
          onMove={() => setIsManualPin(false)}
        />
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
          placeMachine={placeMachine}
          isExpanded={pinnedNodeId === item.id}
        />
      ))}
      <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
