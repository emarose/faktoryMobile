// MapScreen/components/NodeCard.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { items } from "../../../../data/items";
import ProgressBar from "../../../../components/ProgressBar";

const NodeCard = React.memo(
  ({ node, inventory, placedMachines, styles, playerPosition, discoveryRadius, onDepleteNode, placeMachine }) => {
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
    // Miners idle: los que no están asignados a ningún nodo
    const idleMiners = placedMachines.filter(
      (m) => m.type === "miner" && !m.assignedNodeId
    ).length;
    // Mostrar botón solo si hay miners, hay al menos uno idle, el nodo no está depleted, y no hay ya uno asignado aquí
    const canPlaceMiner =
      minerCountInInventory > 0 &&
      idleMiners > 0 &&
      (machineRequired === "miner" || manualMineable) &&
      assignedMachineCount === 0 &&
      !isDepleted;
    const canPlaceOilExtractor =
      oilExtractorCountInInventory > 0 &&
      machineRequired === "oilExtractor" &&
      assignedMachineCount === 0;
    const showManualMineButton = manualMineable;
    // Get node depletion amount if available
    // Use nodeDepletionAmount from props for all depletion logic
    const nodeDepletionAmount = typeof node.nodeDepletionAmount !== "undefined" ? node.nodeDepletionAmount : (typeof node.currentAmount !== "undefined" ? node.currentAmount : null);
  const nodeCapacity = typeof node.capacity !== "undefined" ? node.capacity : 1000;
    // Calculate if player is within discovery radius (in grid units)
    let canManualMine = false;
    if (playerPosition && typeof playerPosition.x === 'number' && typeof playerPosition.y === 'number') {
      // Use Chebyshev (chessboard) distance for grid adjacency, so corners are included
      const tileSize = typeof global.TILE_SIZE === 'number' ? global.TILE_SIZE : 30;
      const discoveryRadiusTiles = Math.max(1, Math.floor((discoveryRadius || 0) / tileSize));
      const chebyshevDist = Math.max(Math.abs(playerPosition.x - x), Math.abs(playerPosition.y - y));
      canManualMine = chebyshevDist <= discoveryRadiusTiles;
    }
    // Manual mining logic
    const isDepleted = nodeDepletionAmount === 0;
    const handleManualMine = () => {
      console.log(`Attempting to manually mine node ${nodeId}`);
      console.log(nodeDepletionAmount);

      if (!isDepleted && typeof nodeDepletionAmount === "number" && nodeDepletionAmount > 0) {
        console.log(`Current node depletion amount: ${nodeDepletionAmount}`);

        if (onDepleteNode) {
          console.log(`Depleting node ${nodeId}: ${nodeDepletionAmount} -> ${nodeDepletionAmount - 1}`);
          onDepleteNode(nodeId, nodeDepletionAmount - 1, true);
        }
      }
    };

    // Helper to update node amount for miner placement
    const handlePlaceMachine = (machineType, nodeId) => {
      if (placeMachine) {
        placeMachine(machineType, nodeId);
      }
    };
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
            style={{ marginTop: 8, marginBottom: 8, opacity: isDepleted ? 0.5 : 1 }}
          />
        )}
        {isDepleted && (
          <Text style={{ color: '#c00', fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
            Node Depleted
          </Text>
        )}
        <View style={styles.placementActions}>
          {showManualMineButton && (
            <>
              <TouchableOpacity
                style={[styles.mineButton, (!canManualMine || isDepleted) && { opacity: 0.5, backgroundColor: '#aaa' }]}
                onPress={() => canManualMine && !isDepleted && handleManualMine()}
                disabled={!canManualMine || isDepleted}
              >
                <Text style={styles.mineButtonText}>Manual Mine</Text>
              </TouchableOpacity>
              {!canManualMine && !isDepleted && (
                <Text style={[styles.mineButtonText, { color: '#c00', marginTop: 4, textAlign: 'center' }]}>Move closer to the node to manually mine (within discovery radius)</Text>
              )}
              {/* Mensaje de nodo depleted eliminado por requerimiento */}
            </>
          )}
          {canPlaceMiner && (
            <TouchableOpacity
              style={styles.placeButton}
              onPress={() => handlePlaceMachine("miner", nodeId)}
            >
              <Text style={styles.placeButtonText}>
                Place Miner ({minerCountInInventory} available)
              </Text>
            </TouchableOpacity>
          )}
          {machineRequired === "oilExtractor" && canPlaceOilExtractor && (
            <TouchableOpacity
              style={styles.placeButton}
              onPress={() => handlePlaceMachine("oilExtractor", nodeId)}
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
