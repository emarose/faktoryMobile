import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import MiniToast from "../../../../components/MiniToast";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../../../constants/Colors";
import { IconContainer } from "../../../../components";

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
}) => {
  // Animated value for a quick color pulse overlay on the tile.
  // We animate the overlay's opacity in a short sequence to create a pulse effect.
  const pulseOpacity = useRef(new Animated.Value(0)).current;

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
                backgroundColor: color,
                borderWidth: 1,
                borderColor: Colors.borderLight,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                //zIndex: 200,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: [
                    { translateX: -12 },
                    { translateY: -12 },
                    { scaleX: currentDirection === "left" ? -1 : 1 },
                  ],
                }}
              >
                <MaterialCommunityIcons
                  name="run"
                  size={24}
                  color={Colors.accentGold}
                />
              </View>
            </View>
          );
        } else if (node && discovered) {
          
          // Check if this node has a placed machine
          const hasMiner = placedMachines.some((m) => {
            return (m.type === "miner" || m.type === "oilExtractor") && m.assignedNodeId === node.id;
          });
          cols.push(
            <TouchableOpacity
              key={`${gx}-${gy}`}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: color,
                borderWidth: selectedNodeId === node.id ? 2 : 1,
                borderColor: selectedNodeId === node.id 
                  ? Colors.accentGold 
                  : Colors.borderLight,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 100,
              }}
              onPress={() => handleTilePress(node)}
            >
              {/* Display the GameAssets icon for the node when no miner is placed */}
              {!hasMiner && (
                <IconContainer
                  iconId={node.type}
                  size={24}
                  iconSize={24}
                  style={{ backgroundColor: 'transparent', borderWidth: 0 }}
                />
              )}
              {/* Show miner icon when a miner is placed */}
              {hasMiner && (
                <IconContainer
                  iconId="miner"
                  size={24}
                  iconSize={20}
                  style={{ backgroundColor: 'transparent', borderWidth: 0 }}
                />
              )}
              {/* Manual mine pulse overlay (full tile color change) */}
              {manualMineFeedback === node.id && (
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: "absolute",

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
                backgroundColor: color,
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
