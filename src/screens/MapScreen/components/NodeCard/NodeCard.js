// MapScreen/components/NodeCard.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { items } from "../../../../data/items";
import ProgressBar from "../../../../components/ProgressBar";

const NodeCard = React.memo(
  ({ node, inventory, onPlaceMachine, placedMachines, onMineResource, styles, playerPosition, discoveryRadius }) => {
    const { id: nodeId, name, x, y, type: nodeType } = node;
    const nodeDefinition = items[nodeType];
    if (!nodeDefinition) {
      console.warn(`Definition for node type ${nodeType} not found in items.js`);
      return null;
    }
    const { manualMineable, machineRequired, output } = nodeDefinition;
    const producedItemId = output ? Object.keys(output)[0] : null;
    const producedItemName = producedItemId
      ? items[producedItemId]?.name || producedItemId
      : "Unknown Resource";
    const assignedMachinesOnNode = placedMachines.filter(
      (m) => m.assignedNodeId === nodeId && m.type === machineRequired
    );
    const assignedMachineCount = assignedMachinesOnNode.length;
    const automatedProductionRate = assignedMachinesOnNode.reduce(
      (totalRate, machine) => {
        return (
          totalRate + (output[producedItemId] || 0) * (machine.efficiency || 1)
        );
      },
      0
    );
    const minerCountInInventory = inventory.miner?.currentAmount || 0;
    const oilExtractorCountInInventory = inventory.oilExtractor?.currentAmount || 0;
    // Miner can be placed on nodes that are manually mineable OR require a miner
    const canPlaceMiner =
      minerCountInInventory > 0 &&
      (machineRequired === "miner" || manualMineable) &&
      assignedMachineCount === 0;
    const canPlaceOilExtractor =
      oilExtractorCountInInventory > 0 &&
      machineRequired === "oilExtractor" &&
      assignedMachineCount === 0;
    const showManualMineButton = manualMineable;
    // Get node depletion amount if available
    const nodeDepletionAmount = typeof node.currentAmount !== "undefined" ? node.currentAmount : null;
    const nodeCapacity = typeof node.capacity !== "undefined" ? node.capacity : 50;
    // Calculate if player is within discovery radius (in grid units)
    let canManualMine = false;
    if (playerPosition && typeof playerPosition.x === 'number' && typeof playerPosition.y === 'number') {
      // Use Chebyshev (chessboard) distance for grid adjacency, so corners are included
      const tileSize = typeof global.TILE_SIZE === 'number' ? global.TILE_SIZE : 30;
      const discoveryRadiusTiles = Math.max(1, Math.floor((discoveryRadius || 0) / tileSize));
      const chebyshevDist = Math.max(Math.abs(playerPosition.x - x), Math.abs(playerPosition.y - y));
      canManualMine = chebyshevDist <= discoveryRadiusTiles;
    }
    return (
      <View style={styles.nodeCard}>
        <Text style={styles.nodeName}>{name}</Text>
        <Text style={styles.nodeDescription}>
          ({x}, {y}) - Produces: {producedItemName}
        </Text>
        {manualMineable && (
          <Text style={styles.nodeCapability}>Manually Mineable</Text>
        )}
        {machineRequired && (
          <Text style={styles.nodeCapability}>
            Automated Extraction: Requires{" "}
            <Text style={styles.requiredMachineText}>
              {items[machineRequired]?.name || machineRequired}
            </Text>
          </Text>
        )}
        {assignedMachineCount > 0 && (
          <View style={styles.assignedInfo}>
            <Text style={styles.assignedCount}>
              Machines Assigned: {assignedMachineCount}
            </Text>
            <Text style={styles.automatedRate}>
              Current Yield: +{automatedProductionRate.toFixed(1)}/s {producedItemName}
            </Text>
          </View>
        )}
        {/* Node depletion progress bar */}
        {nodeDepletionAmount !== null && (
          <ProgressBar
            value={nodeDepletionAmount}
            max={nodeCapacity}
            label={"Node Depletion"}
            style={{ marginTop: 8, marginBottom: 8 }}
          />
        )}
        <View style={styles.placementActions}>
          {showManualMineButton && (
            <>
              <TouchableOpacity
                style={[styles.mineButton, !canManualMine && { opacity: 0.5, backgroundColor: '#aaa' }]}
                onPress={() => canManualMine && onMineResource(nodeId)}
                disabled={!canManualMine}
              >
                <Text style={styles.mineButtonText}>Manual Mine</Text>
              </TouchableOpacity>
              {!canManualMine && (
                <Text style={[styles.mineButtonText, { color: '#c00', marginTop: 4, textAlign: 'center' }]}>Move closer to the node to manually mine (within discovery radius)</Text>
              )}
            </>
          )}
          {canPlaceMiner && (
            <TouchableOpacity
              style={styles.placeButton}
              onPress={() => onPlaceMachine("miner", nodeId)}
            >
              <Text style={styles.placeButtonText}>
                Place Miner ({minerCountInInventory} available)
              </Text>
            </TouchableOpacity>
          )}
          {machineRequired === "oilExtractor" && canPlaceOilExtractor && (
            <TouchableOpacity
              style={styles.placeButton}
              onPress={() => onPlaceMachine("oilExtractor", nodeId)}
            >
              <Text style={styles.placeButtonText}>
                Place Oil Extractor ({oilExtractorCountInInventory} available)
              </Text>
            </TouchableOpacity>
          )}
          {machineRequired &&
            assignedMachineCount === 0 &&
            !canPlaceMiner &&
            !canPlaceOilExtractor && (
              <Text style={styles.noMachineText}>
                Need {items[machineRequired]?.name || machineRequired} to automate this node
              </Text>
            )}
          {machineRequired && assignedMachineCount > 0 && (
            <Text style={styles.alreadyAssignedText}>
              {items[machineRequired]?.name || machineRequired} already assigned to this node.
            </Text>
          )}
        </View>
      </View>
    );
  }
);

export default NodeCard;
