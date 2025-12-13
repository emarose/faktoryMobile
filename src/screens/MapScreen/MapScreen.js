import { useState, useEffect, useContext, useRef, startTransition } from "react";
import { View, ScrollView, Animated, ImageBackground } from "react-native";
import { useSharedValue, withTiming, runOnJS, Easing } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, CustomHeader } from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles";
import MapControls from "./components/MapControls/MapControls";
import MapGridControls from "./components/MapGridControls/MapGridControls";
import MapGrid from "./components/MapGrid";
import MiniToast from "../../components/MiniToast";
import { GameContext } from "../../contexts/GameContext";
import NodeBottomSheet from "./components/NodeBottomSheet";
import InventoryBottomSheet from "./components/InventoryBottomSheet";
import MapToast from "./components/MapToast/MapToast";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useMilestone } from "../../hooks/useMilestone";
import Colors from "../../constants/Colors";
import { TILE_SIZE } from "../../constants/Consts";

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
  // mini toast state: { nodeId, message, signal }
  const [miniToast, setMiniToast] = useState(null);

  // Bottom sheet state
  const [selectedNode, setSelectedNode] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isInventoryVisible, setIsInventoryVisible] = useState(false);
  const miniToastTimeoutRef = useRef(null);

  // Use Reanimated shared values for position (runs on UI thread for 60fps)
  const visualPlayerPosX = useSharedValue(playerMapPosition.x);
  const visualPlayerPosY = useSharedValue(playerMapPosition.y);
  // Keep a React state version for rendering tiles and non-animated logic
  const [visualPlayerPos, setVisualPlayerPos] = useState(playerMapPosition);
  const [moveLocked, setMoveLocked] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [visitedTiles, setVisitedTiles] = useState([]);
  const [targetTile, setTargetTile] = useState(null); // Highlighted destination tile

  useEffect(() => {
    // Only sync visualPlayerPos if not currently pathfinding (pathfinding manages visualPlayerPos directly)
    if (!isWalkingRef.current) {
      setVisualPlayerPos(playerMapPosition);
      visualPlayerPosX.value = playerMapPosition.x;
      visualPlayerPosY.value = playerMapPosition.y;
      setMoveLocked(false);
    }
  }, [playerMapPosition]);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Pathfinding state for click-to-walk
  const [walkPath, setWalkPath] = useState([]);
  const walkIntervalRef = useRef(null);
  const isWalkingRef = useRef(false);

  // Stop any ongoing pathfinding walk
  const stopWalking = () => {
    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
      walkIntervalRef.current = null;
    }
    isWalkingRef.current = false;
    setIsMoving(false);
    setWalkPath([]);
    setTargetTile(null);
  };

  // Handle clicking on empty tiles to walk there
  const handleEmptyTilePress = (targetX, targetY) => {
    // Stop any current walking (allows canceling and re-routing)
    if (isWalkingRef.current) {
      stopWalking();
    }

    // Check if target has a node
    const nodeAtTarget = allResourceNodes.find((n) => n.x === targetX && n.y === targetY);
    if (nodeAtTarget) {
      return; // Can't walk to occupied tile
    }

    // Calculate path using BFS
    const path = calculatePath(playerMapPosition.x, playerMapPosition.y, targetX, targetY);

    if (path.length === 0) {
      setTargetTile(null);
      return; // No path or already at target
    }

    // Set target tile for highlighting
    setTargetTile({ x: targetX, y: targetY });

    setWalkPath(path);
    isWalkingRef.current = true;
    setIsMoving(true);

    // Close bottom sheet when walking
    setIsBottomSheetVisible(false);
    setSelectedNode(null);

    // Walk along path step by step
    const walkNextStep = (pathIndex) => {
      if (pathIndex >= path.length) {
        stopWalking();
        return;
      }

      const nextStep = path[pathIndex];

      // Check collision at next step
      const nodeAtNext = allResourceNodes.find((n) => n.x === nextStep.x && n.y === nextStep.y);
      if (nodeAtNext) {
        // Stop walking if path is blocked
        setToastMessage("Path blocked");
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 1500);
        stopWalking();
        return;
      }

      // Update direction based on movement from current position
      const currentPos = pathIndex === 0 ? playerMapPosition : path[pathIndex - 1];
      const dx = nextStep.x - currentPos.x;
      const dy = nextStep.y - currentPos.y;
      let newDir;
      if (dy < 0) newDir = 'up';
      else if (dy > 0) newDir = 'down';
      else if (dx < 0) newDir = 'left';
      else if (dx > 0) newDir = 'right';
      setCurrentDirection(newDir);

      // Add the CURRENT tile (being left) to visited trail before moving
      setVisitedTiles(prev => {
        const newTiles = [...prev, { x: currentPos.x, y: currentPos.y }];
        return newTiles.slice(-10); // Keep only last 10 tiles
      });

      // Move to next step - Update shared values INSTANTLY (runs on UI thread)
      setMoveLocked(true);
      
      // Update shared values with animation - this happens immediately on UI thread
      visualPlayerPosX.value = withTiming(nextStep.x, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      });
      visualPlayerPosY.value = withTiming(nextStep.y, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      });
      
      // Update React state for tile rendering (non-critical, can be slightly delayed)
      startTransition(() => {
        setVisualPlayerPos(nextStep);
      });

      // Wait for animation, then update actual position and unlock
      setTimeout(() => {
        setPlayerMapPosition(nextStep);
        setMoveLocked(false);
        walkNextStep(pathIndex + 1);
      }, 240);
    };

    // Start walking from first step
    walkNextStep(0);
  };

  // BFS pathfinding: find shortest path avoiding obstacles
  const calculatePath = (startX, startY, endX, endY) => {
    // Already at destination
    if (startX === endX && startY === endY) {
      return [];
    }

    // BFS queue: each item is { x, y, path }
    const queue = [{ x: startX, y: startY, path: [] }];
    const visited = new Set();
    visited.add(`${startX},${startY}`);

    // 4-directional movement (up, down, left, right)
    const directions = [
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 },  // right
    ];

    while (queue.length > 0) {
      const current = queue.shift();

      // Try all 4 directions
      for (const dir of directions) {
        const nextX = current.x + dir.dx;
        const nextY = current.y + dir.dy;
        const key = `${nextX},${nextY}`;

        // Skip if already visited
        if (visited.has(key)) {
          continue;
        }

        // Check if this position has a node (obstacle)
        const nodeAtPos = allResourceNodes.find((n) => n.x === nextX && n.y === nextY);
        if (nodeAtPos) {
          continue; // Skip obstacles
        }

        // Build new path
        const newPath = [...current.path, { x: nextX, y: nextY }];

        // Check if we reached the destination
        if (nextX === endX && nextY === endY) {
          return newPath;
        }

        // Add to queue and mark as visited
        visited.add(key);
        queue.push({ x: nextX, y: nextY, path: newPath });
      }
    }

    // No path found
    return [];
  };

  const handleExploreDirection = (dir) => {
    if (moveLocked) return;

    // Stop any pathfinding walk
    stopWalking();

    // Set direction first for sprite animation
    setCurrentDirection(dir);

    let { x, y } = visualPlayerPos;
    if (dir === "up") y -= 1;
    if (dir === "down") y += 1;
    if (dir === "left") x -= 1;
    if (dir === "right") x += 1;
    // Prevent moving into tiles that contain any resource node
    const nodeAtTarget = allResourceNodes.find((n) => n.x === x && n.y === y);
    if (nodeAtTarget) {
      // block movement into node tile and show feedback
      const isDiscovered = discoveredNodes[nodeAtTarget.id];
      if (isDiscovered) {
        setToastMessage(`Can't walk through ${nodeAtTarget.name || nodeAtTarget.type}`);
      } else {
        setToastMessage("Something is blocking the way");
      }
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 1500);
      return;
    }
    setMoveLocked(true);
    setIsMoving(true);
    
    // Close bottom sheet when moving
    setIsBottomSheetVisible(false);
    setSelectedNode(null);

    // Add the CURRENT tile (being left) to visited trail (keep only last 10)
    setVisitedTiles(prev => {
      const newTiles = [...prev, { x: visualPlayerPos.x, y: visualPlayerPos.y }];
      return newTiles.slice(-10); // Keep only last 10 tiles
    });

    // Animate position on UI thread (instant, no React delay)
    visualPlayerPosX.value = withTiming(x, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
    });
    visualPlayerPosY.value = withTiming(y, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
    });
    
    // Update React state for tile rendering (non-critical)
    startTransition(() => {
      setVisualPlayerPos({ x, y });
    });

    // Update position after animation completes and clear isMoving
    setTimeout(() => {
      setPlayerMapPosition({ x, y });
      setIsMoving(false);
    }, 240);
  };

  // Handle discovery when player moves
  useEffect(() => {
    const tileRadius = Math.ceil(DISCOVERY_RADIUS_PX / TILE_SIZE);
    const radiusSquared = (tileRadius - 1) * (tileRadius - 1);

    const nodesInRange = allResourceNodes.filter((node) => {
      const dx = node.x - playerMapPosition.x;
      const dy = node.y - playerMapPosition.y;
      return dx * dx + dy * dy <= radiusSquared;
    });

    const newDiscoveries = {};
    nodesInRange.forEach((node) => {
      if (!discoveredNodes[node.id]) {
        newDiscoveries[node.id] = true;
      }
    });

    if (Object.keys(newDiscoveries).length > 0) {
      setDiscoveredNodes(prev => ({ ...prev, ...newDiscoveries }));
    }
  }, [playerMapPosition, allResourceNodes, discoveredNodes, setDiscoveredNodes]);

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
    setSelectedNode(node);
    setIsBottomSheetVisible(true);
  };

  // Called by NodeCard when user manually mines a node
  const handleManualMine = (nodeId) => {
    // set id to trigger MapGrid overlay; clear previous timeout if present
    setManualMineFeedback(nodeId);
    // bump signal so MapGrid restarts animation even if nodeId === previous
    setManualMineSignal((s) => s + 1);
    // show mini toast on the node tile
    showMiniToastOnNode(nodeId, "+1");
    if (manualMineTimeoutRef.current) {
      clearTimeout(manualMineTimeoutRef.current);
    }
    // keep feedback for 600ms then clear
    manualMineTimeoutRef.current = setTimeout(() => {
      setManualMineFeedback(null);
      manualMineTimeoutRef.current = null;
    }, 650);
  };

  // Show a small '+1' MiniToast on the given node's tile
  const showMiniToastOnNode = (nodeId, message = "+1") => {
    if (!nodeId) return;
    setMiniToast({ nodeId, message, signal: (miniToast?.signal || 0) + 1 });
    if (miniToastTimeoutRef.current) clearTimeout(miniToastTimeoutRef.current);
    miniToastTimeoutRef.current = setTimeout(() => {
      setMiniToast(null);
      miniToastTimeoutRef.current = null;
    }, 700);
  };

  // Update selected node with current amount when nodeAmounts change
  const updatedSelectedNode = selectedNode ? {
    ...selectedNode,
    currentAmount: nodeAmounts[selectedNode.id] ?? selectedNode.capacity ?? 1000
  } : null;

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <CustomHeader
        title="World Map"
        rightIcon="target"
        onRightIconPress={() => console.log("Map target pressed")}
      />

      <ImageBackground
        source={require("../../../assets/images/backgrounds/background.png")}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <MapToast
            visible={toastVisible}
            message={toastMessage}
            onHide={() => setToastVisible(false)}
          />

          {/* Map Controls FOR TEST ONLY */}
          {/*   <MapControls
            onRegenerateSeed={regenerateSeed}
            onSetTestSeed={setTestSeed}
          /> */}

          <LinearGradient
            colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.8)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.mapVisualContainer}
          >
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
                visualPlayerPosX={visualPlayerPosX}
                visualPlayerPosY={visualPlayerPosY}
                playerMapPosition={playerMapPosition}
                allResourceNodes={allResourceNodes}
                discoveredNodes={discoveredNodes}
                handleTilePress={handleTilePress}
                handleEmptyTilePress={handleEmptyTilePress}
                navigation={navigation}
                selectedNodeId={selectedNode?.id}
                placedMachines={placedMachines}
                currentDirection={currentDirection}
                isMoving={isMoving}
                manualMineFeedback={manualMineFeedback}
                manualMineSignal={manualMineSignal}
                miniToast={miniToast}
                nodeAmounts={nodeAmounts}
                visitedTiles={visitedTiles}
                targetTile={targetTile}
              />
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}
            >
              <Text style={{ fontSize: 12, color: Colors.textPrimary, marginTop: 8 }}>
                Position: ({visualPlayerPos.x}, {visualPlayerPos.y})
              </Text>
              <View style={{}}>
                <MapGridControls
                  MAP_DISPLAY_SIZE={TILE_SIZE * VIEW_SIZE}
                  exploreDirection={handleExploreDirection}
                  onDirectionChange={(dir) => setCurrentDirection(dir)}
                />
              </View>
            </View>
            <Text style={{ fontSize: 10, color: Colors.textMuted, marginTop: 8, alignSelf: "flex-end" }}>
              Tap an empty tile or use the controls to walk
            </Text>
          </LinearGradient>

          {/* Inventory Button */}
          <View style={{ alignItems: "center", marginTop: 16, marginBottom: 8 }}>
            <TouchableOpacity
              onPress={() => setIsInventoryVisible(true)}
              style={{ width: "90%", maxWidth: 300 }}
            >
              <LinearGradient
                colors={["#ff00cc", "#00ffff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 8,
                  padding: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    borderRadius: 6,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    gap: 8,
                  }}
                >
                  <MaterialCommunityIcons
                    name="bag-personal"
                    size={20}
                    color={Colors.accentGold}
                  />
                  <Text style={{ fontSize: 14, color: Colors.textPrimary, fontWeight: "500" }}>
                    Inventory
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </ImageBackground>

      <NodeBottomSheet
        isVisible={isBottomSheetVisible}
        node={updatedSelectedNode}
        inventory={inventory}
        placedMachines={placedMachines}
        playerPosition={playerMapPosition}
        onDepleteNode={handleDepleteNode}
        onManualMine={handleManualMine}
        placeMachine={placeMachine}
        onClose={() => {
          setIsBottomSheetVisible(false);
          setSelectedNode(null);
        }}
      />

      <InventoryBottomSheet
        isVisible={isInventoryVisible}
        inventory={inventory}
        onClose={() => setIsInventoryVisible(false)}
      />
    </SafeAreaView>
  );
}
