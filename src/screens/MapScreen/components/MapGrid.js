import React, { useState } from "react";
import MapGridControls from "./MapGridControls";
import { View, Text, TouchableOpacity } from "react-native";
import NodeDetailsModal from "./NodeDetailsModal";

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
              <Text style={[styles.axisLabelY, { top: line.y + 2, left: 2 }]}>
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
      {/* Show all discovered nodes, not just those within radius */}
      {Object.keys(discoveredNodes).filter((id) => discoveredNodes[id]).map((nodeId) => {
        const node = displayableNodes.find((n) => n.id === nodeId);
        if (!node) return null;
        const { x: displayX, y: displayY } = getDisplayCoords(node.x, node.y);
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
        return (
          <TouchableOpacity
            key={`map-node-${node.id}`}
            style={[
              styles.mapNodeDot,
              {
                left: getDisplayCoords(node.x, node.y).x,
                top: getDisplayCoords(node.x, node.y).y,
                backgroundColor: getNodeColor(node.type),
                borderColor: placedMachines.some((m) => m.assignedNodeId === node.id) ? "#00FF00" : getNodeColor(node.type),
                borderWidth: placedMachines.some((m) => m.assignedNodeId === node.id) ? 2 : 1,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
            onPress={() => handleNodePress(node)}
          >
            <Text style={{ fontSize: 10, color: "#fff", position: "absolute", top: 18, left: 0, width: 40, textAlign: "center" }}>{node.name}</Text>
            {placedMachines.some((m) => m.assignedNodeId === node.id) && <Text style={styles.machineIcon}>⚙️</Text>}
          </TouchableOpacity>
        );
          placedMachines.some((m) => m.assignedNodeId === selectedNode.id)
        }
        styles={styles}
      />
    </View>
  );
};

export default MapGrid;
