// screens/map/MapScreen.js (Refactored UI for placing multiple machines)
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert, // Keep Alert for general feedback, or replace with custom toast
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGame } from '../../contexts/GameContext';
import { items } from '../../data/items'; // Import items for full node info
import styles from "./styles"; // Assuming styles.js is in the same directory

// --- NodeDisplayForPlacement Component ---
const NodeDisplayForPlacement = ({
  node, // Now passing the full node object from allResourceNodes
  inventory,
  onPlaceMachine,
}) => {
  const {
    id: nodeId,
    name,
    description,
    manualMineable,
    machineRequired,
    isAssigned,
    assignedMachineCount,
    automatedProductionRate,
  } = node;

  const minerCountInInventory = inventory.miner?.currentAmount || 0;
  const oilExtractorCountInInventory = inventory.oilExtractor?.currentAmount || 0;

  // Determine if a specific machine type can be placed on this node
  // A machine can be placed if:
  // 1. Player has the machine in inventory.
  // 2. The node explicitly requires this machine type.
  const canPlaceMiner = minerCountInInventory > 0 && machineRequired === "miner";
  const canPlaceOilExtractor = oilExtractorCountInInventory > 0 && machineRequired === "oilExtractor";

  // Determine the produced item name for display (e.g., "Iron Ore" from "ironOre_node")
  const producedItemId = Object.keys(node.output)[0];
  const producedItemName = items[producedItemId]?.name || producedItemId;

  return (
    <View style={styles.nodeCard}>
      <Text style={styles.nodeName}>{name}</Text>
      <Text style={styles.nodeDescription}>{description}</Text>

      {manualMineable && (
        <Text style={styles.nodeCapability}>Manually Mineable</Text>
      )}
      {machineRequired && (
        <Text style={styles.nodeCapability}>
          Automated Extraction: Requires <Text style={styles.requiredMachineText}>{items[machineRequired]?.name}</Text>
        </Text>
      )}

      {isAssigned && (
        <View style={styles.assignedInfo}>
          <Text style={styles.assignedCount}>
            Machines Assigned: {assignedMachineCount}
          </Text>
          <Text style={styles.automatedRate}>
            Current Yield: +{automatedProductionRate.toFixed(1)}/s {producedItemName}
          </Text>
        </View>
      )}

      <View style={styles.placementActions}>
        {canPlaceMiner && (
          <TouchableOpacity
            style={styles.placeButton}
            onPress={() => onPlaceMachine("miner", nodeId)}
          >
            <Text style={styles.placeButtonText}>
              Place Miner ({minerCountInInventory})
            </Text>
          </TouchableOpacity>
        )}
        {canPlaceOilExtractor && (
          <TouchableOpacity
            style={styles.placeButton}
            onPress={() => onPlaceMachine("oilExtractor", nodeId)}
          >
            <Text style={styles.placeButtonText}>
              Place Oil Extractor ({oilExtractorCountInInventory})
            </Text>
          </TouchableOpacity>
        )}

        {/* Display messages if machines are needed but not available */}
        {machineRequired && !canPlaceMiner && !canPlaceOilExtractor && (
          <Text style={styles.noMachineText}>
            Need {items[machineRequired]?.name} to automate this node
          </Text>
        )}
      </View>
    </View>
  );
};

// --- MapScreen Component ---
const MapScreen = () => {
  const { inventory, allResourceNodes, placeMachine } = useGame();

  const handlePlaceMachine = (machineType, nodeId) => {
    const success = placeMachine(machineType, nodeId);
    if (!success) {
      // GameContext already logs warnings to console, but you could add a toast/alert here
      // Alert.alert("Placement Failed", "You might not have enough machines or this node isn't suitable.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Resource Nodes</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inventorySummary}>
          <Text style={styles.inventoryStatus}>Miners Available: {inventory.miner?.currentAmount || 0}</Text>
          <Text style={styles.inventoryStatus}>Oil Extractors Available: {inventory.oilExtractor?.currentAmount || 0}</Text>
        </View>
        {allResourceNodes.length > 0 ? (
          allResourceNodes.map((node) => (
            <NodeDisplayForPlacement
              key={node.id}
              node={node} // Pass the entire node object
              inventory={inventory}
              onPlaceMachine={handlePlaceMachine}
            />
          ))
        ) : (
          <Text style={styles.noNodesText}>No resource nodes found on the map.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MapScreen;