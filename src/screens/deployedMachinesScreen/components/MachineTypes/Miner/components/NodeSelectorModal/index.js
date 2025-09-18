import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGame } from "../../../../../../../contexts/GameContext";
import { items } from "../../../../../../../data/items";

const NodeSelectorModal = ({ visible, onClose, machine }) => {
  const {
    allResourceNodes,
    discoveredNodes,
    nodeAmounts,
    setPlacedMachines,
    playerMapPosition, 
    placedMachines,
    ownedMachines,
    updateOwnedMachine
  } = useGame();

  const [selectedResourceType, setSelectedResourceType] = useState(null);

  // Filter discovered and available nodes
  const discoveredNodeOptions = allResourceNodes.filter(
    (n) =>
      discoveredNodes[n.id] &&
      (typeof n.currentAmount !== "number" || n.currentAmount > 0)
  );

  // Group nodes by type
  const groupedNodes = discoveredNodeOptions.reduce((acc, node) => {
    const type = node.type || 'unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(node);
    return acc;
  }, {});

  const resourceTypes = Object.keys(groupedNodes);

  // Get the nodes to display (filtered by selected type)
  const nodesToDisplay = selectedResourceType
    ? groupedNodes[selectedResourceType] || []
    : discoveredNodeOptions;

  const handleSelectNode = (node) => {
    console.log(`Assigning node ${node.id} to machine ${machine.id}`);
    
    // Si la máquina ya está en placedMachines, actualizar su nodo
    const existingMachine = placedMachines.find(m => m.id === machine.id);
    if (existingMachine) {
      setPlacedMachines((prevPlaced) =>
        prevPlaced.map((m) =>
          m.id === machine.id
            ? { ...m, assignedNodeId: node.id, isIdle: false }
            : m
        )
      );
    } else {
      // Si no está en placedMachines, moverla de ownedMachines a placedMachines
      const machineToPlace = {
        ...machine,
        assignedNodeId: node.id,
        isIdle: false
      };
      
      // Agregar a placedMachines
      setPlacedMachines((prevPlaced) => [...prevPlaced, machineToPlace]);
      
      // Marcar como colocada en ownedMachines para evitar duplicados
      if (updateOwnedMachine) {
        updateOwnedMachine(machine.id, { isPlaced: true });
      }
    }
    
    onClose();
  };

  const calculateDistance = (node) => {
    if (!playerMapPosition || !node) return 0;
    const dx = node.x - playerMapPosition.x;
    const dy = node.y - playerMapPosition.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getResourceIcon = (type) => {
    const iconMap = {
      ironOre_node: "cube-outline",
      copperOre_node: "circle-outline",
      coal_node: "fire",
      limestone_node: "shape-outline",
      quartz_node: "diamond-stone",
      crudeOil_node: "oil",
      cateriumOre_node: "lightning-bolt",
    };
    return iconMap[type] || "help-circle-outline";
  };

  const getResourceColor = (type) => {
    const colorMap = {
      ironOre_node: "#8B7355",
      copperOre_node: "#B87333",
      coal_node: "#2C2C2C",
      limestone_node: "#F5F5DC",
      quartz_node: "#E6E6FA",
      crudeOil_node: "#1C1C1C",
      cateriumOre_node: "#FFD700",
    };
    return colorMap[type] || "#666";
  };

  const resourceTypeLabels = {
    ironOre_node: "Iron Ore",
    copperOre_node: "Copper Ore",
    coal_node: "Coal",
    limestone_node: "Limestone",
    quartz_node: "Quartz Crystal",
    crudeOil_node: "Crude Oil",
    cateriumOre_node: "Caterium Ore",
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={modalStyles.safeArea}>
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Select Resource Node</Text>
            <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={modalStyles.content}>
            {/* Resource Type Filter */}
            {resourceTypes.length > 1 && (
              <View style={modalStyles.filterSection}>
                <Text style={modalStyles.sectionTitle}>Filter by Resource</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={modalStyles.filterContainer}
                >
                  <TouchableOpacity
                    style={[
                      modalStyles.filterButton,
                      !selectedResourceType && modalStyles.filterButtonActive,
                    ]}
                    onPress={() => setSelectedResourceType(null)}
                  >
                    <Text style={[
                      modalStyles.filterButtonText,
                      !selectedResourceType && modalStyles.filterButtonTextActive,
                    ]}>
                      All
                    </Text>
                  </TouchableOpacity>

                  {resourceTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        modalStyles.filterButton,
                        selectedResourceType === type && modalStyles.filterButtonActive,
                      ]}
                      onPress={() => setSelectedResourceType(type)}
                    >
                      <MaterialCommunityIcons
                        name={getResourceIcon(type)}
                        size={16}
                        color={selectedResourceType === type ? "#fff" : "#bbb"}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[
                        modalStyles.filterButtonText,
                        selectedResourceType === type && modalStyles.filterButtonTextActive,
                      ]}>
                        {resourceTypeLabels[type] || type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Node List */}
            <View style={modalStyles.nodeListSection}>
              <Text style={modalStyles.sectionTitle}>
                Available Nodes ({nodesToDisplay.length})
              </Text>

              {nodesToDisplay.length === 0 ? (
                <Text style={modalStyles.noNodesText}>
                  No available nodes found for this resource type.
                </Text>
              ) : (
                nodesToDisplay.map((node) => {
                  const nodeDefinition = node.type ? items[node.type] : null;
                  const nodeAmount = nodeAmounts[node.id] ?? node.capacity ?? 1000;
                  const isAvailable = nodeAmount > 0;
                  const distance = calculateDistance(node);

                  return (
                    <TouchableOpacity
                      key={node.id}
                      style={[
                        modalStyles.nodeItem,
                        !isAvailable && modalStyles.nodeItemDisabled,
                      ]}
                      onPress={() => isAvailable && handleSelectNode(node)}
                      disabled={!isAvailable}
                      activeOpacity={0.7}
                    >
                      <View style={modalStyles.nodeIconContainer}>
                        <MaterialCommunityIcons
                          name={getResourceIcon(node.type)}
                          size={24}
                          color={getResourceColor(node.type)}
                        />
                      </View>

                      <View style={modalStyles.nodeInfo}>
                        <Text style={modalStyles.nodeName}>
                          {nodeDefinition?.name || node.type || "Unknown"}
                        </Text>
                        <Text style={modalStyles.nodeLocation}>
                          Location: ({node.x}, {node.y}) • Distance: {distance.toFixed(1)}
                        </Text>
                        <Text style={[
                          modalStyles.nodeAmount,
                          !isAvailable && modalStyles.nodeAmountDepleted
                        ]}>
                          Available: {nodeAmount} / {node.capacity || 1000}
                        </Text>
                      </View>

                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color={isAvailable ? "#4CAF50" : "#666"}
                      />
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  filterContainer: {
    gap: 8,
  },
  filterButton: {
    backgroundColor: "#35354a",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#4CAF50",
  },
  filterButtonText: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  nodeListSection: {
    flex: 1,
  },
  noNodesText: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  nodeItem: {
    backgroundColor: "#2a2a3e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  nodeItemDisabled: {
    opacity: 0.5,
    borderLeftColor: "#666",
  },
  nodeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#35354a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  nodeInfo: {
    flex: 1,
  },
  nodeName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  nodeLocation: {
    color: "#bbb",
    fontSize: 12,
    marginBottom: 2,
  },
  nodeAmount: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "500",
  },
  nodeAmountDepleted: {
    color: "#FF6B6B",
  },
});

export default NodeSelectorModal;
