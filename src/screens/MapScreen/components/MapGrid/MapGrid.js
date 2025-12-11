import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import MiniToast from "../../../../components/MiniToast";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../../../constants/Colors";
import { IconContainer } from "../../../../components";
import PlayerSprite from "./PlayerSprite";

const MapGrid = ({
  chunkSize,
  tileSize,
  visualPlayerPos,
  allResourceNodes,
  discoveredNodes,
  handleTilePress,
  navigation,
  selectedNodeId,
  placedMachines,
  currentDirection,
  manualMineFeedback,
  manualMineSignal,
  miniToast,
  playerMapPosition, // Add this to track actual position
  nodeAmounts,
  isMoving, // Add isMoving state
}) => {
  // Animated value for a quick color pulse overlay on the tile.
  // We animate the overlay's opacity in a short sequence to create a pulse effect.
  const pulseOpacity = useRef(new Animated.Value(0)).current;

  // Reanimated shared values for smooth player sliding
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const prevVisualPos = useRef(visualPlayerPos);

  // Animate player movement when visualPlayerPos changes
  // This runs synchronously - no delays
  useEffect(() => {
    const prev = prevVisualPos.current;
    const curr = visualPlayerPos;

    // Calculate the difference in grid positions
    const deltaX = curr.x - prev.x;
    const deltaY = curr.y - prev.y;

    if (deltaX !== 0 || deltaY !== 0) {
      // INSTANT start: Set initial offset immediately (no delay)
      offsetX.value = -deltaX * tileSize;
      offsetY.value = -deltaY * tileSize;

      // Then animate to center (0, 0) - this starts immediately
      offsetX.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });
      offsetY.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });
      
      prevVisualPos.current = visualPlayerPos;
    }
  }, [visualPlayerPos, tileSize, offsetX, offsetY]);

  // Re-run animation when either the nodeId or the signal changes. This
  // allows rapid repeated mines on the same node to retrigger the pulse.
  useEffect(() => {
    if (!manualMineFeedback) return;
    // reset
    pulseOpacity.setValue(0.0);
    Animated.sequence([
      Animated.timing(pulseOpacity, {
        toValue: 0.7,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(pulseOpacity, {
        toValue: 0.25,
        duration: 90,
        useNativeDriver: true,
      }),

      Animated.timing(pulseOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [manualMineFeedback, manualMineSignal]);

  // Animated style for player sliding
  const playerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
      ],
    };
  });

  const renderTiles = () => {
    const rows = [];
    const px = visualPlayerPos.x;
    const py = visualPlayerPos.y;
    const cx = Math.floor(px / chunkSize);
    const cy = Math.floor(py / chunkSize);
    // Para cada tile visible en la grilla
    for (let y = 0; y < chunkSize; y++) {
      const cols = [];
      for (let x = 0; x < chunkSize; x++) {
        const gx = cx * chunkSize + x;
        const gy = cy * chunkSize + y;
        const node = allResourceNodes.find((n) => n.x === gx && n.y === gy);

        const isPlayer = gx === px && gy === py;
        // Always use the background color for tiles regardless of node type
        let color = Colors.background;
        let discovered = false;

        if (node && discoveredNodes[node.id]) {
          // No longer setting color based on node type
          discovered = true;
        }

        if (isPlayer) {
          cols.push(
            <View
              key={`${gx}-${gy}`}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: Colors.borderLight,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "visible",
                //zIndex: 200,
              }}
            >
              <Reanimated.View style={[playerAnimatedStyle, { width: tileSize, height: tileSize }]}>
                <PlayerSprite 
                  direction={currentDirection || 'down'} 
                  size={tileSize} 
                  isMoving={isMoving}
                />
              </Reanimated.View>
            </View>
          );
        } else if (node && discovered) {
          // Check if this node has a placed machine
          const hasMiner = placedMachines.some((m) => {
            return (
              (m.type === "miner" || m.type === "oilExtractor") &&
              m.assignedNodeId === node.id
            );
          });
          // Check if node is depleted
          const nodeAmount = nodeAmounts?.[node.id] ?? node.capacity ?? 1000;
          const isDepleted = nodeAmount <= 0;
          
          cols.push(
            <TouchableOpacity
              key={`${gx}-${gy}`}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderWidth: selectedNodeId === node.id ? 2 : 1,
                borderColor: isDepleted
                  ? "#ff0000"
                  : selectedNodeId === node.id
                    ? Colors.accentGold
                    : Colors.borderLight,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 100,
                opacity: isDepleted ? 0.3 : 1,
              }}
              onPress={() => handleTilePress(node)}
            >
              {/* Display the GameAssets icon for the node when no miner is placed */}
              {!hasMiner && (
                <IconContainer
                  iconId={node.type}
                  size={24}
                  iconSize={24}
                  style={{ backgroundColor: "transparent", borderWidth: 0 }}
                />
              )}
              {/* Show miner icon when a miner is placed */}
              {hasMiner && (
                <IconContainer
                  iconId="miner"
                  size={24}
                  iconSize={20}
                  style={{ backgroundColor: "transparent", borderWidth: 0 }}
                />
              )}
              {/* Vertical progress bar for nodes with placed machines */}
              {hasMiner && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -tileSize -2,
                    width: 6,
                    height: tileSize * 2,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: Colors.borderLight,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      height: `${Math.max(0, Math.min(100, (nodeAmount / (node.capacity || 1000)) * 100))}%`,
                      backgroundColor: isDepleted ? "#ff0000" : Colors.accentGold,
                    }}
                  />
                </View>
              )}
              {/* Manual mine pulse overlay (full tile color change) */}
              {manualMineFeedback === node.id && (
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    backgroundColor: "rgba(0,0,0,0.5)",

                    right: 0 - 2,
                    top: 0 - 2,
                    width: tileSize,
                    height: tileSize,
                    backgroundColor: Colors.accentGold,
                    opacity: pulseOpacity,
                    zIndex: 999,
                    elevation: 10,
                  }}
                />
              )}
              {/* mini toast in top-right of tile */}
              {miniToast && miniToast.nodeId === node.id && (
                <View
                  key={`mt-${miniToast.signal}`}
                  style={{
                    position: "absolute",
                    right: 4,
                    top: 4,
                    zIndex: 1000,
                  }}
                >
                  <MiniToast visible={true} message={miniToast.message} />
                </View>
              )}
            </TouchableOpacity>
          );
        } else {
          cols.push(
            <View
              key={`${gx}-${gy}`}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderWidth: 1,
                borderColor: Colors.borderLight,
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
    <View
      style={{
        flexDirection: "column",
        width: tileSize * chunkSize,
        height: tileSize * chunkSize,
      }}
    >
      {renderTiles()}
    </View>
  );
};

export default React.memo(MapGrid);
