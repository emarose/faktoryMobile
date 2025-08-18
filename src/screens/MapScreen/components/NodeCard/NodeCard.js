// MapScreen/components/NodeCard.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { items } from "../../../../data/items";
import ProgressBar from "../../../../components/ProgressBar";

const NodeCard = React.memo(
  ({ node, inventory, placedMachines, styles, playerPosition, discoveryRadius, onDepleteNode, placeMachine, isExpanded: isExpandedProp }) => {
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
    // Si no hay currentAmount, usar siempre la capacidad máxima
    const nodeCapacity = typeof node.capacity !== "undefined" ? node.capacity : 1000;
    const nodeDepletionAmount = typeof node.nodeDepletionAmount !== "undefined"
      ? node.nodeDepletionAmount
      : (typeof node.currentAmount !== "undefined" ? node.currentAmount : nodeCapacity);
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
    // Estado local para expansión
    const [isExpanded, setIsExpanded] = React.useState(!!isExpandedProp);

    // Icono y label para minado manual
    const mineIcon = (
      <TouchableOpacity
        style={{ marginLeft: 2, padding: 6, opacity: (!canManualMine || isDepleted) ? 0.4 : 1, flexDirection: 'row', alignItems: 'center' }}
        onPress={() => canManualMine && !isDepleted && handleManualMine()}
        disabled={!canManualMine || isDepleted}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon name="industry" size={20} color="#FFD700" />
        {isExpanded && <Text style={{ color: '#FFD700', fontSize: 13, marginLeft: 4 }}>Mine</Text>}
      </TouchableOpacity>
    );

    return (
      <TouchableOpacity
        activeOpacity={0.93}
        onPress={() => setIsExpanded((v) => !v)}
        style={[
          styles.nodeCard,
          {
            flexDirection: 'column',
            paddingVertical: isExpanded ? 12 : 6,
            paddingHorizontal: isExpanded ? 16 : 8,
            marginVertical: isExpanded ? 6 : 2,
            backgroundColor: isExpanded ? '#23233a' : '#181825',
            borderWidth: isExpanded ? 2 : 1,
            borderColor: isExpanded ? '#FFD700' : '#333',
          },
        ]}
      >
        {/* Fila principal */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[styles.nodeName, { fontSize: isExpanded ? 17 : 14, fontWeight: isExpanded ? 'bold' : 'normal' }]} numberOfLines={1}>{name}</Text>
            <Text style={[styles.nodeDescription, { fontSize: isExpanded ? 13 : 11, color: '#aaa' }]} numberOfLines={1}>
              ({x}, {y}) • {producedItemName}
            </Text>
            {assignedMachineCount > 0 && (
              <Text style={[styles.automatedRate, { fontSize: isExpanded ? 13 : 11, color: '#27ae60' }]}>+{automatedProductionRate.toFixed(1)}/s</Text>
            )}
          </View>
          {/* Acciones a la derecha */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
            {showManualMineButton && mineIcon}
            {canPlaceMiner && (
              <TouchableOpacity
                style={{ marginLeft: 8, padding: 6, backgroundColor: '#232', borderRadius: 6, flexDirection: 'row', alignItems: 'center' }}
                onPress={() => handlePlaceMachine("miner", nodeId)}
              >
                <Icon name="cogs" size={18} color="#fff" />
                {isExpanded && <Text style={{ color: '#fff', fontSize: 13, marginLeft: 4 }}>Miner</Text>}
              </TouchableOpacity>
            )}
            {machineRequired === "oilExtractor" && canPlaceOilExtractor && (
              <TouchableOpacity
                style={{ marginLeft: 8, padding: 6, backgroundColor: '#234', borderRadius: 6, flexDirection: 'row', alignItems: 'center' }}
                onPress={() => handlePlaceMachine("oilExtractor", nodeId)}
              >
                <Icon name="tint" size={18} color="#fff" />
                {isExpanded && <Text style={{ color: '#fff', fontSize: 13, marginLeft: 4 }}>Extractor</Text>}
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Detalles y barra solo si expandido */}
        {isExpanded && (
          <>
            {nodeDepletionAmount !== null && (
              <ProgressBar
                value={nodeDepletionAmount}
                max={nodeCapacity}
                label={null}
                style={{ marginTop: 6, marginBottom: 4, height: 10, opacity: isDepleted ? 0.5 : 1 }}
              />
            )}
            {isDepleted && (
              <Text style={{ color: '#c00', fontWeight: 'bold', fontSize: 13, marginBottom: 2 }}>Depleted</Text>
            )}
            {!isDepleted && showManualMineButton && !canManualMine && (
              <Text style={{ color: '#c00', fontSize: 12, marginTop: 2 }}>Move closer to mine</Text>
            )}
            {manualMineable && (
              <Text style={[styles.nodeCapability, { fontSize: 11, color: '#FFD700', marginTop: 2 }]}>Manually Mineable</Text>
            )}
            {machineRequired && (
              <Text style={[styles.nodeCapability, { fontSize: 11, color: '#00BFFF', marginTop: 2 }]}>Requires: {items[machineRequired]?.name || machineRequired}</Text>
            )}
            {assignedMachineCount > 0 && (
              <Text style={[styles.assignedCount, { fontSize: 11, color: '#27ae60', marginTop: 2 }]}>Machines: {assignedMachineCount}</Text>
            )}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

export default NodeCard;
