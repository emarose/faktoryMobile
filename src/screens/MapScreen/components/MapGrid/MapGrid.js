import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getNodeColor } from "../../../../data/nodeTypes";
import Colors from "../../../../constants/Colors";

const MapGrid = ({
  chunkSize,
  tileSize,
  visualPlayerPos,
  allResourceNodes,
  discoveredNodes,
  handleTilePress,
  navigation,
  pinnedNodeId,
  placedMachines,
  currentDirection,
  manualMineFeedback,
  manualMineSignal
}) => {
  // Animated values for the mining ripple (match NodeCard pickaxe animation)
  const rippleScale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  // Re-run animation when either the nodeId or the signal changes. This
  // allows rapid repeated mines on the same node to retrigger the ripple.
  useEffect(() => {
    if (!manualMineFeedback) return;
    rippleScale.setValue(0.9);
    rippleOpacity.setValue(0.5);
    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 1.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 300,
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
        let color = Colors.background;
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
                width: tileSize,
                height: tileSize,
                backgroundColor: color,
                borderWidth: 1,
                borderColor: Colors.borderLight,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 200,
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
          const hasMiner = placedMachines.some(
            (m) =>
              (m.type === "miner" || m.type === "oilExtractor") &&
              m.assignedNodeId === node.id
          );
          cols.push(
            <TouchableOpacity
              key={`${gx}-${gy}`}
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: color,
                borderWidth: pinnedNodeId !== node.id ? 1 : 2,
                borderColor:
                  pinnedNodeId !== node.id
                    ? Colors.borderLight
                    : Colors.accentGold,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 100,
              }}
              onPress={() => handleTilePress(node)}
            >
              {hasMiner && (
                <MaterialCommunityIcons
                  name="robot-industrial"
                  size={20}
                  color={
                    node.id.includes("coal_node")
                      ? Colors.accentGold
                      : Colors.background
                  }
                />
              )}
              {/* Manual mine ripple overlay */}
              {manualMineFeedback === node.id && (
                <Animated.View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    width: 56,
                    height: 56,
                    left: (tileSize - 56) / 2,
                    top: (tileSize - 56) / 2,
                    borderRadius: 28,
                    backgroundColor: Colors.accentGold,
                    opacity: rippleOpacity,
                    transform: [{ scale: rippleScale }],
                    zIndex: 999,
                    elevation: 10,
                  }}
                />
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
