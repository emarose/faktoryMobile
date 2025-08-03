import React, { useState } from "react";
import MapGridControls from "../MapGridControls/MapGridControls";
import { View, Text, TouchableOpacity } from "react-native";
import NodeDetailsModal from "../NodeDetailsModal/NodeDetailsModal";

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
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // Example handlers (should be replaced with real logic)
  const handleExtract = () => {
    // Implement extraction logic here
    setModalVisible(false);
  };
  const handlePlaceMachine = () => {
    // Implement place machine logic here
    setModalVisible(false);
  };
  const handleNodePress = (node) => {
    setSelectedNode(node);
    setModalVisible(true);
  };

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
          // Add chunk offset to axis label
          const worldLabel = line.label + (mapOffset?.x || 0);
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
                {worldLabel}
              </Text>
            </React.Fragment>
          );
        } else if (line.type === "horizontal") {
          // Flip Y axis for label and line, add chunk offset
          const flippedY = MAP_DISPLAY_SIZE - line.y;
          const worldLabel = line.label + (mapOffset?.y || 0);
          return (
            <React.Fragment key={`hy-${line.label}` + idx}>
              <View
                style={[
                  styles.gridLine,
                  { top: flippedY, left: 0, right: 0, height: 1 },
                ]}
              />
              <Text style={[styles.axisLabelY, { top: flippedY + 2, left: 2 }]}> 
                {worldLabel}
              </Text>
            </React.Fragment>
          );
        }
        return null;
      })}
      {/* Player current position (dot and label use flipped Y) */}
      <View
        style={[
          styles.playerPositionDot,
          { left: PLAYER_DISPLAY_X, top: MAP_DISPLAY_SIZE - PLAYER_DISPLAY_Y },
        ]}
      />
      <Text
        style={[
          styles.playerPositionLabel,
          { left: PLAYER_DISPLAY_X + 10, top: MAP_DISPLAY_SIZE - PLAYER_DISPLAY_Y - 5 },
        ]}
      >
        You {currentPlayerGameX}, {currentPlayerGameY}
      </Text>
      {/* Directional controls */}
      <MapGridControls
        MAP_DISPLAY_SIZE={MAP_DISPLAY_SIZE}
        exploreDirection={exploreDirection}
      />
      {/* Visual movement radius around player */}
      <View
        style={[
          styles.movementRadiusCircle,
          {
            left: PLAYER_DISPLAY_X - 75,
            top: MAP_DISPLAY_SIZE - PLAYER_DISPLAY_Y - 75,
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
        let { x: displayX, y: displayY } = getDisplayCoords(node.x, node.y);
        // Flip Y axis so origin is bottom-left
        displayY = MAP_DISPLAY_SIZE - displayY;
        const nodeColor = getNodeColor(node.type);
        const isAssigned = placedMachines.some(
          (m) => m.assignedNodeId === node.id
        );
        return (
          <TouchableOpacity
            key={`map-node-${node.id}`}
            style={[
              styles.mapNodeDot,
              {
                left: displayX,
                top: displayY,
                backgroundColor: nodeColor,
                borderColor: isAssigned ? "#00FF00" : nodeColor,
                borderWidth: isAssigned ? 2 : 1,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={() => handleNodePress(node)}
          >
            <Text
              style={{
                fontSize: 10,
                color: "#fff",
                position: "absolute",
                top: 18,
                left: 0,
                width: 40,
                textAlign: "center",
              }}
            >
              {node.name}
            </Text>
            {isAssigned && <Text style={styles.machineIcon}>⚙️</Text>}
          </TouchableOpacity>
        );
      })}

      {/* Node details modal */}
      <NodeDetailsModal
        visible={modalVisible}
        node={selectedNode}
        onClose={() => setModalVisible(false)}
        onExtract={handleExtract}
        onPlaceMachine={handlePlaceMachine}
        isAssigned={
          selectedNode &&
          placedMachines.some((m) => m.assignedNodeId === selectedNode.id)
        }
        styles={styles}
      />
    </View>
  );
};

export default MapGrid;
