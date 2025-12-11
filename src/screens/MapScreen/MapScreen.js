import { useState, useEffect, useContext, useRef } from "react";
import { View, ScrollView, Animated, ImageBackground } from "react-native";
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

  const [visualPlayerPos, setVisualPlayerPos] = useState(playerMapPosition);
  const [continuousPos, setContinuousPos] = useState({ x: playerMapPosition.x, y: playerMapPosition.y });
  const moveIntervalRef = useRef(null);
  const holdStartTimeRef = useRef(null);
  const [isMoving, setIsMoving] = useState(false);
  const [currentDirection, setCurrentDirection] = useState('down');
  const movingDirectionRef = useRef(null);

  useEffect(() => {
    // Sync positions when actual position changes
    setVisualPlayerPos(playerMapPosition);
    setContinuousPos({ x: playerMapPosition.x, y: playerMapPosition.y });
    setIsMoving(false);
  }, [playerMapPosition]);

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleHoldStart = (dir) => {
    // Record when button was pressed
    holdStartTimeRef.current = Date.now();
    
    // Set direction and start animation immediately
    setCurrentDirection(dir);
    setIsMoving(true);
    movingDirectionRef.current = dir;
    
    // Close bottom sheet when moving
    setIsBottomSheetVisible(false);
    setSelectedNode(null);
    
    // Delay before starting continuous movement (allows for tap detection)
    const holdDelay = 250; // ms to distinguish tap from hold
    const moveSpeed = 600; // ms per tile (slower, more deliberate movement)
    
    setTimeout(() => {
      // Only start continuous movement if still holding
      if (movingDirectionRef.current === dir) {
        moveIntervalRef.current = setInterval(() => {
          setContinuousPos((prevPos) => {
            const currentDir = movingDirectionRef.current;
            if (!currentDir) return prevPos;
            
            let { x, y } = prevPos;
            if (currentDir === "up") y -= 1;
            if (currentDir === "down") y += 1;
            if (currentDir === "left") x -= 1;
            if (currentDir === "right") x += 1;
            
            // Check collision
            const nodeAtTarget = allResourceNodes.find((n) => n.x === x && n.y === y);
            if (nodeAtTarget) {
              // Stop movement on collision
              handleHoldEnd();
              const isDiscovered = discoveredNodes[nodeAtTarget.id];
              if (isDiscovered) {
                setToastMessage(`Can't walk through ${nodeAtTarget.name || nodeAtTarget.type}`);
              } else {
                setToastMessage("Something is blocking the way");
              }
              setToastVisible(true);
              setTimeout(() => setToastVisible(false), 1500);
              return prevPos;
            }
            
            // Update visual position
            setVisualPlayerPos({ x, y });
            return { x, y };
          });
        }, moveSpeed);
      }
    }, holdDelay);
  };

  const handleHoldEnd = () => {
    const holdDuration = holdStartTimeRef.current ? Date.now() - holdStartTimeRef.current : 0;
    const wasTap = holdDuration < 250; // Quick tap
    
    // Stop continuous movement
    const lastDirection = movingDirectionRef.current;
    movingDirectionRef.current = null;
    setIsMoving(false);
    
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    
    // Handle tap vs hold differently
    if (wasTap && lastDirection) {
      // Single tap: move one tile
      setContinuousPos((prevPos) => {
        let { x, y } = prevPos;
        if (lastDirection === "up") y -= 1;
        if (lastDirection === "down") y += 1;
        if (lastDirection === "left") x -= 1;
        if (lastDirection === "right") x += 1;
        
        // Check collision
        const nodeAtTarget = allResourceNodes.find((n) => n.x === x && n.y === y);
        if (nodeAtTarget) {
          const isDiscovered = discoveredNodes[nodeAtTarget.id];
          if (isDiscovered) {
            setToastMessage(`Can't walk through ${nodeAtTarget.name || nodeAtTarget.type}`);
          } else {
            setToastMessage("Something is blocking the way");
          }
          setToastVisible(true);
          setTimeout(() => setToastVisible(false), 1500);
          return prevPos;
        }
        
        // Move one tile
        const newPos = { x, y };
        setVisualPlayerPos(newPos);
        setPlayerMapPosition(newPos);
        return newPos;
      });
    } else {
      // Hold release: snap to nearest tile
      setContinuousPos((prevPos) => {
        const snappedX = Math.round(prevPos.x);
        const snappedY = Math.round(prevPos.y);
        const snappedPos = { x: snappedX, y: snappedY };
        
        // Update visual and actual position
        setVisualPlayerPos(snappedPos);
        setPlayerMapPosition(snappedPos);
        
        return snappedPos;
      });
    }
    
    holdStartTimeRef.current = null;
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, []);

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
            colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.5)","rgba(0, 0, 0, 0.8)"]}
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
              playerMapPosition={playerMapPosition}
              allResourceNodes={allResourceNodes}
              discoveredNodes={discoveredNodes}
              handleTilePress={handleTilePress}
              navigation={navigation}
              selectedNodeId={selectedNode?.id}
              placedMachines={placedMachines}
              currentDirection={currentDirection}
              manualMineFeedback={manualMineFeedback}
              manualMineSignal={manualMineSignal}
              miniToast={miniToast}
              nodeAmounts={nodeAmounts}
              isMoving={isMoving}
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
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.3)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                alignSelf: "flex-start",
                flexDirection: "column",
                gap: 8,
                borderWidth: 1,
                borderColor: Colors.backgroundAccent,
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
            </LinearGradient>

            {/* Movement Controls - Posicionados en el área del PlayerInfo */}
            <View style={{ position: "relative", alignSelf: "flex-end" }}>
              <MapGridControls
                MAP_DISPLAY_SIZE={TILE_SIZE * VIEW_SIZE}
                onHoldStart={handleHoldStart}
                onHoldEnd={handleHoldEnd}
                onDirectionChange={(dir) => setCurrentDirection(dir)}
              />
            </View>
          </View>
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
