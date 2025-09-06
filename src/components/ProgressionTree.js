import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { items } from "../data/items";
import Svg, { Line, Defs, Marker, Path } from "react-native-svg";

// Helper to build tech tree nodes and edges
function buildTechTree() {
  // Show all items except nodes (ending with _node)
  const itemIds = Object.keys(items).filter(
    (id) =>
      !id.endsWith("_node") &&
      [
        "rawMaterial",
        "intermediateProduct",
        "finalProduct",
        "machine",
      ].includes(items[id].type)
  );

  // Nodes: all items and machines
  const nodes = itemIds.map((id) => ({
    id,
    name: items[id].name,
    type: items[id].type,
  }));

  // Edges: connect inputs to outputs for each recipe
  const edges = [];
  itemIds.forEach((id) => {
    const item = items[id];
    // If this item has inputs, connect each input to this item
    if (item.inputs) {
      Object.keys(item.inputs).forEach((inputId) => {
        if (items[inputId]) {
          edges.push({ from: inputId, to: id, type: "input" });
        }
      });
    }
    // If this item is a machine, connect its build cost
    if (item.type === "machine" && item.inputs) {
      Object.keys(item.inputs).forEach((inputId) => {
        if (items[inputId]) {
          edges.push({ from: inputId, to: id, type: "buildCost" });
        }
      });
    }
  });

  return { nodes, edges };
}

const NODE_WIDTH = 120;
const NODE_HEIGHT = 60;
const NODE_MARGIN_X = 60;
const NODE_MARGIN_Y = 60;

// Left-to-right layout: group by type, spread vertically
function layoutTechTree(nodes) {
  // Group nodes by type
  const typeOrder = [
    "rawMaterial",
    "intermediateProduct",
    "finalProduct",
    "machine",
  ];
  const layers = typeOrder.map((type) => nodes.filter((n) => n.type === type));
  // Position nodes in columns, spread vertically
  layers.forEach((layer, layerIdx) => {
    layer.forEach((n, i) => {
      n.x = NODE_MARGIN_X + layerIdx * (NODE_WIDTH + NODE_MARGIN_X);
      n.y = NODE_MARGIN_Y + i * (NODE_HEIGHT + NODE_MARGIN_Y);
    });
  });
  return layers.flat();
}

const ProgressionTree = () => {
  const { nodes, edges } = buildTechTree();
  const laidOutNodes = layoutTechTree(nodes);
  const [selectedMachineId, setSelectedMachineId] = useState(null);

  // Map node id to position
  const nodePos = {};
  laidOutNodes.forEach((n) => {
    nodePos[n.id] = { x: n.x, y: n.y };
  });

  // Calculate SVG canvas size
  const width =
    Math.max(...laidOutNodes.map((n) => n.x)) + NODE_WIDTH + NODE_MARGIN_X;
  const height =
    Math.max(...laidOutNodes.map((n) => n.y)) + NODE_HEIGHT + NODE_MARGIN_Y;

  // Filter edges if a machine is selected
  let visibleEdges = edges;
  if (selectedMachineId) {
    visibleEdges = edges.filter(
      (edge) => edge.from === selectedMachineId || edge.to === selectedMachineId
    );
  }

  return (
    <ScrollView horizontal style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ width, height }}>
          {/* SVG lines/arrows for edges */}
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <Defs>
              <Marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <Path d="M 0 0 L 10 5 L 0 10 z" fill="#0077cc" />
              </Marker>
            </Defs>
            {visibleEdges.map((edge, idx) => {
              const from = nodePos[edge.from];
              const to = nodePos[edge.to];
              if (!from || !to) return null;
              // Draw line from right of 'from' to left of 'to'
              const startX = from.x + NODE_WIDTH;
              const startY = from.y + NODE_HEIGHT / 2;
              const endX = to.x;
              const endY = to.y + NODE_HEIGHT / 2;
              return (
                <Line
                  key={idx}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#0077cc"
                  strokeWidth={1}
                  markerEnd="url(#arrow)"
                />
              );
            })}
          </Svg>
          {/* Render nodes */}
          {laidOutNodes.map((node) => {
            const isMachine = node.type === "machine";
            return (
              <TouchableOpacity
                onPress={() =>
                  setSelectedMachineId(
                    selectedMachineId === node.id ? null : node.id
                  )
                }
                key={node.id}
                style={[
                  styles.nodeBox,
                  {
                    position: "absolute",
                    left: node.x,
                    top: node.y,
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT,
                    borderColor: isMachine ? "#8d237bff" : "#aaa",
                    borderWidth: isMachine ? 2 : 1,
                  },
                ]}
              >
                <Text style={styles.nodeTitle}>{node.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    minHeight: 300,
    paddingVertical: 24,
  },
  nodeBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#0077cc",
  },
  nodeTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  nodeType: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  selectButton: {
    marginTop: 4,
    fontSize: 12,
    color: "#0077cc",
    textAlign: "center",
    textDecorationLine: "underline",
    fontWeight: "bold",
    padding: 2,
  },
});

export default ProgressionTree;
