import React, { useState, useRef, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { items } from "../data/items";
import Svg, { Line, Defs, Marker, Path } from "react-native-svg";
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedRef,
  useAnimatedStyle,
  withTiming
} from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";

// Constants for layout
const NODE_WIDTH = 120;
const NODE_HEIGHT = 60;
const NODE_MARGIN_X = 60;
const NODE_MARGIN_Y = 60;
const VIEWPORT_PADDING = 200; // Extra buffer for viewport calculations

// Machine color mapping (similar to your design)
const MACHINE_COLORS = {
  smelter: "#E57373", // Reddish
  constructor: "#64B5F6", // Light blue
  foundry: "#FFD54F", // Yellow
  refinery: "#AB47BC", // Purple
  assembler: "#26A69A", // Teal
  manufacturer: "#FF7043", // Orange
  miner: "#81C784", // Green
  oilExtractor: "#5D4037", // Brown
  // Default color for any missing machines
  default: "#90A4AE", // Grey blue
};

// Helper to build tech tree nodes and edges - memoized to avoid recalculation
const useTechTree = () => {
  return useMemo(() => {
    console.log("Building tech tree data (should happen once)");
    
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

    // Map to track which machine produces each item (for coloring)
    const producedByMachine = {};
    
    // First identify all machines that produce items
    itemIds.forEach((id) => {
      const item = items[id];
      if (item.type !== "machine" && item.machine) {
        producedByMachine[id] = item.machine;
      }
    });

    // Nodes: all items and machines with additional metadata
    const nodes = itemIds.map((id) => {
      const item = items[id];
      const isMachine = item.type === "machine";
      
      // Set color based on machine type or the machine that produces this item
      let color = "#aaaaaa"; // Default gray
      
      if (isMachine) {
        // Machine gets its defined color
        color = MACHINE_COLORS[id] || MACHINE_COLORS.default;
      } else if (producedByMachine[id]) {
        // Products get the color of their producing machine
        color = MACHINE_COLORS[producedByMachine[id]] || MACHINE_COLORS.default;
      } else if (item.type === "rawMaterial") {
        // Raw materials get a natural green color
        color = "#8BC34A";
      }
      
      return {
        id,
        name: items[id].name,
        type: items[id].type,
        machine: item.machine, // The machine that produces this item
        color,
      };
    });

    // Edges: connect inputs to outputs for each recipe
    const edges = [];
    itemIds.forEach((id) => {
      const item = items[id];
      // If this item has inputs, connect each input to this item
      if (item.inputs) {
        Object.keys(item.inputs).forEach((inputId) => {
          if (items[inputId]) {
            edges.push({ 
              from: inputId, 
              to: id, 
              type: item.type === "machine" ? "buildCost" : "productionInput" 
            });
          }
        });
      }
    });

    // More natural layout: rawMaterials on left, machines on right
    const typeOrder = [
      "rawMaterial",
      "intermediateProduct", 
      "finalProduct",
      "machine",
    ];
    
    // Group nodes by type for layout
    const nodesByType = {};
    typeOrder.forEach(type => {
      nodesByType[type] = nodes.filter(n => n.type === type);
    });
    
    // Function to find raw material position in column
    const positionInColumns = () => {
      // Start with raw materials on left
      let columnIndex = 0;
      let currentY = NODE_MARGIN_Y;
      
      // Position each type in its column
      typeOrder.forEach(type => {
        const nodesOfType = nodesByType[type];
        let rowIndex = 0;
        
        nodesOfType.forEach(node => {
          node.x = NODE_MARGIN_X + columnIndex * (NODE_WIDTH + NODE_MARGIN_X);
          node.y = NODE_MARGIN_Y + rowIndex * (NODE_HEIGHT + NODE_MARGIN_Y);
          rowIndex++;
        });
        
        columnIndex++;
      });
    };
    
    // Position nodes
    positionInColumns();
    
    const laidOutNodes = nodes;
    
    // Create a node position lookup for fast access
    const nodePos = {};
    laidOutNodes.forEach((n) => {
      nodePos[n.id] = { x: n.x, y: n.y };
    });
    
    // Calculate canvas size with padding
    const width = Math.max(...laidOutNodes.map((n) => n.x)) + NODE_WIDTH + NODE_MARGIN_X * 2;
    const height = Math.max(...laidOutNodes.map((n) => n.y)) + NODE_HEIGHT + NODE_MARGIN_Y * 2;
    
    // Get machine nodes for filtering
    const machineNodes = laidOutNodes.filter(n => n.type === "machine");
    
    // Build a map of producer-consumer relationships
    const productionChains = {};
    machineNodes.forEach(machine => {
      productionChains[machine.id] = {
        inputs: new Set(),
        outputs: new Set()
      };
    });
    
    // Add inputs and outputs to each machine's production chain
    edges.forEach(edge => {
      const fromNode = laidOutNodes.find(n => n.id === edge.from);
      const toNode = laidOutNodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        // If to node is a machine, it's an input to that machine
        if (toNode.type === "machine") {
          productionChains[toNode.id]?.inputs.add(edge.from);
        }
        
        // If from node was produced by a machine, track that relationship
        if (fromNode.machine && productionChains[fromNode.machine]) {
          productionChains[fromNode.machine].outputs.add(edge.to);
        }
      }
    });
    
    return { 
      nodes: laidOutNodes,
      edges,
      nodePos,
      width,
      height,
      machineNodes,
      productionChains
    };
  }, []);
};

// Memoized node component to prevent unnecessary re-renders
const Node = React.memo(({ node, onPress, selectedMachineId, relatedIds }) => {
  const isMachine = node.type === "machine";
  const isRawMaterial = node.type === "rawMaterial";
  const isSelected = node.id === selectedMachineId;
  const isRelated = relatedIds?.has(node.id);
  
  // Determine opacity based on selection state
  const opacity = !selectedMachineId || isSelected || isRelated ? 1 : 0.3;
  
  // Calculate border and background colors
  const backgroundColor = node.color ? `${node.color}33` : "#fff"; // Apply light version of node color
  const borderColor = node.color || (isMachine ? "#8d237bff" : "#aaa");
  
  return (
    <TouchableOpacity
      onPress={() => onPress(node.id)}
      style={[
        styles.nodeBox,
        {
          position: "absolute",
          left: node.x,
          top: node.y,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          opacity,
          borderColor,
          backgroundColor,
          borderWidth: isMachine ? 2 : 1,
        },
      ]}
    >
      <Text 
        style={[
          styles.nodeTitle,
          { color: isRawMaterial ? "#006400" : "#333" }
        ]}
      >
        {node.name}
      </Text>
      
      {/* Only show machine badge for non-machine nodes that have a producing machine */}
      {!isMachine && node.machine && (
        <View style={[styles.machineBadge, { backgroundColor: node.color || "#aaa" }]}>
          <Text style={styles.machineBadgeText}>
            {items[node.machine]?.name || node.machine}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

// Memoized edge component to prevent unnecessary re-renders
const EdgeLine = React.memo(({ edge, nodePos, visible = true, nodes }) => {
  const from = nodePos[edge.from];
  const to = nodePos[edge.to];
  
  if (!from || !to) return null;
  
  // Find the nodes for this edge
  const fromNode = nodes.find(n => n.id === edge.from);
  const toNode = nodes.find(n => n.id === edge.to);
  
  if (!fromNode || !toNode) return null;
  
  // Draw line from right of 'from' to left of 'to'
  const startX = from.x + NODE_WIDTH;
  const startY = from.y + NODE_HEIGHT / 2;
  const endX = to.x;
  const endY = to.y + NODE_HEIGHT / 2;
  
  // Get color based on edge type and nodes
  let strokeColor = "#0077cc";
  
  // If the destination is a machine, use machine color for "build cost" lines
  if (toNode.type === "machine") {
    strokeColor = toNode.color || "#0077cc";
  } 
  // Otherwise, use the color of the source node (which represents the producing machine's color)
  else if (fromNode.color) {
    strokeColor = fromNode.color;
  }
  
  return (
    <Line
      x1={startX}
      y1={startY}
      x2={endX}
      y2={endY}
      stroke={strokeColor}
      strokeWidth={1.5}
      markerEnd={`url(#arrow-${strokeColor.replace('#', '')})`}
      opacity={visible ? 1 : 0.2}
    />
  );
});

// Memoized collection of edges
const Edges = React.memo(({ edges, nodePos, selectedMachineId, nodes, productionChains }) => {
  // Create color-specific markers for arrows
  const uniqueColors = new Set([
    "#0077cc", // Default blue
    ...Object.values(MACHINE_COLORS)
  ]);
  
  // Get all relevant edges based on selected machine and its production chain
  const getVisibleEdges = () => {
    if (!selectedMachineId) return edges;
    
    // If a machine is selected, find all related edges in its production chain
    const relatedNodeIds = new Set([selectedMachineId]);
    const productionChain = productionChains[selectedMachineId];
    
    // Add direct inputs and outputs
    if (productionChain) {
      productionChain.inputs.forEach(id => relatedNodeIds.add(id));
      productionChain.outputs.forEach(id => relatedNodeIds.add(id));
      
      // Get transitive dependencies - follow edges to get the full chain
      edges.forEach(edge => {
        if (relatedNodeIds.has(edge.from) || relatedNodeIds.has(edge.to)) {
          relatedNodeIds.add(edge.from);
          relatedNodeIds.add(edge.to);
        }
      });
    }
    
    // Return only edges that connect related nodes
    return edges.filter(edge => 
      relatedNodeIds.has(edge.from) && relatedNodeIds.has(edge.to)
    );
  };
  
  const visibleEdges = getVisibleEdges();
  
  return (
    <>
      <Defs>
        {/* Create arrow markers for each color */}
        {Array.from(uniqueColors).map(color => (
          <Marker
            key={color}
            id={`arrow-${color.replace('#', '')}`}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <Path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </Marker>
        ))}
      </Defs>
      
      {visibleEdges.map((edge, idx) => {
        const visible = !selectedMachineId || 
                      edge.from === selectedMachineId || 
                      edge.to === selectedMachineId;
        
        return (
          <EdgeLine 
            key={`${edge.from}-${edge.to}-${idx}`} 
            edge={edge} 
            nodePos={nodePos}
            nodes={nodes}
            visible={visible}
          />
        );
      })}
    </>
  );
});

// Main component with optimized rendering
const ProgressionTree = () => {
  const { nodes, edges, nodePos, width, height, machineNodes, productionChains } = useTechTree();
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  
  // Create a set of related node IDs for efficient lookup
  const relatedIds = useMemo(() => {
    if (!selectedMachineId) return null;
    
    const relatedSet = new Set([selectedMachineId]);
    
    // Add direct connections
    edges.forEach(edge => {
      if (edge.from === selectedMachineId || edge.to === selectedMachineId) {
        relatedSet.add(edge.from);
        relatedSet.add(edge.to);
      }
    });
    
    // Add production chain nodes if this is a machine
    if (productionChains[selectedMachineId]) {
      const chain = productionChains[selectedMachineId];
      
      // Add inputs and their inputs recursively
      const addInputs = (inputId) => {
        relatedSet.add(inputId);
        
        // Find edges where this input is the destination
        edges.filter(e => e.to === inputId).forEach(e => {
          if (!relatedSet.has(e.from)) {
            addInputs(e.from);
          }
        });
      };
      
      // Add outputs and their outputs recursively
      const addOutputs = (outputId) => {
        relatedSet.add(outputId);
        
        // Find edges where this output is the source
        edges.filter(e => e.from === outputId).forEach(e => {
          if (!relatedSet.has(e.to)) {
            addOutputs(e.to);
          }
        });
      };
      
      // Process all direct inputs and outputs
      chain.inputs.forEach(addInputs);
      chain.outputs.forEach(addOutputs);
    }
    
    return relatedSet;
  }, [selectedMachineId, edges, productionChains]);
  
  // Scroll position tracking with Reanimated
  const scrollX = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const horizontalScrollRef = useAnimatedRef();
  const verticalScrollRef = useAnimatedRef();
  
  // Handle scroll events with Reanimated for better performance
  const horizontalScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  
  const verticalScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  // Select/deselect machine node handler with memoization
  const handleNodePress = useCallback((nodeId) => {
    // If clicking on a non-machine node that has a producing machine,
    // select that machine instead
    const node = nodes.find(n => n.id === nodeId);
    
    if (node && !node.type === "machine" && node.machine) {
      setSelectedMachineId(prevId => prevId === node.machine ? null : node.machine);
    } else {
      setSelectedMachineId(prevId => prevId === nodeId ? null : nodeId);
    }
  }, [nodes]);
  
  // Add a machine filter section at the top with color indicators
  const renderMachineFilters = () => {
    return (
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, !selectedMachineId && styles.filterButtonActive]}
          onPress={() => setSelectedMachineId(null)}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {machineNodes.map(machine => (
            <TouchableOpacity 
              key={machine.id}
              style={[
                styles.filterButton, 
                { backgroundColor: machine.color || "#f0f0f0" },
                selectedMachineId === machine.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedMachineId(
                selectedMachineId === machine.id ? null : machine.id
              )}
            >
              <Text style={[
                styles.filterButtonText, 
                { color: machine.color ? "#fff" : "#333" }
              ]}>
                {machine.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {renderMachineFilters()}
      
      {/* Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Leyenda:</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendItem, { backgroundColor: "#8BC34A33", borderColor: "#8BC34A" }]}>
            <Text style={styles.legendText}>Materia Prima</Text>
          </View>
          <View style={[styles.legendItem, { backgroundColor: "#64B5F633", borderColor: "#64B5F6" }]}>
            <Text style={styles.legendText}>Producto del Constructor</Text>
          </View>
          <View style={[styles.legendItem, { backgroundColor: "#E5737333", borderColor: "#E57373" }]}>
            <Text style={styles.legendText}>Producto del Fundidor</Text>
          </View>
        </View>
      </View>
      
      <Animated.ScrollView
        ref={horizontalScrollRef}
        horizontal
        onScroll={horizontalScrollHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Animated.ScrollView
          ref={verticalScrollRef}
          onScroll={verticalScrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ width, height }}
        >
          {/* SVG for connections */}
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <Edges 
              edges={edges} 
              nodePos={nodePos} 
              nodes={nodes}
              selectedMachineId={selectedMachineId}
              productionChains={productionChains}
            />
          </Svg>
          
          {/* Nodes */}
          {nodes.map(node => (
            <Node
              key={node.id}
              node={node}
              onPress={handleNodePress}
              selectedMachineId={selectedMachineId}
              relatedIds={relatedIds}
            />
          ))}
        </Animated.ScrollView>
      </Animated.ScrollView>
    </View>
  );
};

// Extract all styles to StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#0077cc',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 3,
  },
  filterButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  nodeType: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },
  machineBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#0077cc',
  },
  machineBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  legendContainer: {
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 10,
  },
});

export default ProgressionTree;
