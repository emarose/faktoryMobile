// MapScreen/components/MapGrid.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const MapGrid = ({
  displayableNodes,
  placedMachines,
  getDisplayCoords,
  gridLines,
  MAP_DISPLAY_SIZE,
  PLAYER_DISPLAY_X,
  PLAYER_DISPLAY_Y,
  currentPlayerGameX,
  currentPlayerGameY,
  getNodeColor,
  styles,
  lastDirection,
  mapOffset,
  exploreDirection,
}) => {

  return (
    <View
      style={[
        styles.mapGrid,
        { width: MAP_DISPLAY_SIZE, height: MAP_DISPLAY_SIZE },
      ]}
    >
      {/* Render grid lines and axis labels from gridLines array */}
      {gridLines.map((line, idx) => {
        if (line.type === "vertical") {
          return (
            <React.Fragment key={`vx-${line.label}` + idx}>
              <View
                style={[
                  styles.gridLine,
                  { left: line.x, top: 0, bottom: 0, width: 1 },
                ]}
              />
              <Text
                style={[styles.axisLabelX, { left: line.x + 2, bottom: 2 }]}
              >
                {line.label}
              </Text>
            </React.Fragment>
          );
        } else if (line.type === "horizontal") {
          return (
            <React.Fragment key={`hy-${line.label}` + idx}>
              <View
                style={[
                  styles.gridLine,
                  { top: line.y, left: 0, right: 0, height: 1 },
                ]}
              />
              <Text
                style={[styles.axisLabelY, { top: line.y + 2, left: 2 }]}
              >
                {line.label}
              </Text>
            </React.Fragment>
          );
        }
        return null;
      })}
      {/* Player current position */}
      <View
        style={[
          styles.playerPositionDot,
          { left: PLAYER_DISPLAY_X, top: PLAYER_DISPLAY_Y },
        ]}
      />
      <Text
        style={[
          styles.playerPositionLabel,
          { left: PLAYER_DISPLAY_X + 10, top: PLAYER_DISPLAY_Y - 5 },
        ]}
      >
        You ({currentPlayerGameX},{currentPlayerGameY})
      </Text>
      {/* Touchable carets for movement directions on outer edges */}
      {/* Up */}
      <View style={{ position: "absolute", left: MAP_DISPLAY_SIZE / 2 - 20, top: 5, zIndex: 10 }}>
        <TouchableOpacity
          style={{ backgroundColor: lastDirection === "up" ? "#27ae60" : "#3498db", padding: 10, borderRadius: 16 }}
          onPress={() => exploreDirection && exploreDirection("up")}
        >
          <Text style={{ color: "white", fontSize: 22 }}>↑</Text>
        </TouchableOpacity>
      </View>
      {/* Down */}
      <View style={{ position: "absolute", left: MAP_DISPLAY_SIZE / 2 - 20, top: MAP_DISPLAY_SIZE - 45, zIndex: 10 }}>
        <TouchableOpacity
          style={{ backgroundColor: lastDirection === "down" ? "#27ae60" : "#3498db", padding: 10, borderRadius: 16 }}
          onPress={() => exploreDirection && exploreDirection("down")}
        >
          <Text style={{ color: "white", fontSize: 22 }}>↓</Text>
        </TouchableOpacity>
      </View>
      {/* Left */}
      <View style={{ position: "absolute", left: 5, top: MAP_DISPLAY_SIZE / 2 - 20, zIndex: 10 }}>
        <TouchableOpacity
          style={{ backgroundColor: lastDirection === "left" ? "#27ae60" : "#3498db", padding: 10, borderRadius: 16 }}
          onPress={() => exploreDirection && exploreDirection("left")}
        >
          <Text style={{ color: "white", fontSize: 22 }}>←</Text>
        </TouchableOpacity>
      </View>
      {/* Right */}
      <View style={{ position: "absolute", left: MAP_DISPLAY_SIZE - 45, top: MAP_DISPLAY_SIZE / 2 - 20, zIndex: 10 }}>
        <TouchableOpacity
          style={{ backgroundColor: lastDirection === "right" ? "#27ae60" : "#3498db", padding: 10, borderRadius: 16 }}
          onPress={() => exploreDirection && exploreDirection("right")}
        >
          <Text style={{ color: "white", fontSize: 22 }}>→</Text>
        </TouchableOpacity>
      </View>
      {/* Visual movement radius around player */}
      <View
        style={[
          styles.movementRadiusCircle,
          {
            left: PLAYER_DISPLAY_X - 75,
            top: PLAYER_DISPLAY_Y - 75,
            width: 150,
            height: 150,
            borderRadius: 75,
            position: "absolute",
            borderWidth: 2,
            borderColor: "#27ae60",
            opacity: 0.2,
            backgroundColor: "#27ae60",
          },
        ]}
      />
      {/* Render discovered nodes */}
      {displayableNodes.map((node) => {
        const { x: displayX, y: displayY } = getDisplayCoords(node.x, node.y);
        const nodeColor = getNodeColor(node.type);
        const isAssigned = placedMachines.some(
          (m) => m.assignedNodeId === node.id
        );
        return (
          <View
            key={`map-node-${node.id}`}
            style={[
              styles.mapNodeDot,
              {
                left: displayX,
                top: displayY,
                backgroundColor: nodeColor,
                borderColor: isAssigned ? "#00FF00" : nodeColor,
                borderWidth: isAssigned ? 2 : 1,
              },
            ]}
          >
            {/* Node type label */}
            <Text style={{ fontSize: 10, color: "#333", position: "absolute", top: 18, left: 0, width: 40, textAlign: "center" }}>{node.type}</Text>
            {isAssigned && <Text style={styles.machineIcon}>⚙️</Text>}
          </View>
        );
      })}
    </View>
  );
};

export default MapGrid;
