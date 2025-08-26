import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { items } from "../../../../data/items";
import ProgressBar from "../../../../components/ProgressBar";

const NodeCard = React.memo(
  ({
    node,
    inventory,
    placedMachines,
    styles,
    playerPosition,
    discoveryRadius,
    onDepleteNode,
    placeMachine,
    isExpanded,
    onPressExpand,
  }) => {
    const { id: nodeId, name, x, y, type: nodeType } = node;

    const nodeDefinition = items[nodeType];
    const [miningFeedback, setMiningFeedback] = useState(false);
    const { manualMineable, machineRequired, output } = nodeDefinition;
    const producedItemId = output ? Object.keys(output)[0] : null;
    const producedItemName =
      (producedItemId && items[producedItemId]?.name) || producedItemId;
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

    const oilExtractorCountInInventory =
      inventory.oilExtractor?.currentAmount || 0;

    const idleMiners = placedMachines.filter(
      (m) => m.type === "miner" && !m.assignedNodeId
    ).length;

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
    const nodeCapacity = node.capacity || 1000;
    const nodeDepletionAmount =
      typeof node.nodeDepletionAmount !== "undefined"
        ? node.nodeDepletionAmount
        : typeof node.currentAmount !== "undefined"
          ? node.currentAmount
          : nodeCapacity;

    let canManualMine = false;

    if (
      playerPosition &&
      typeof playerPosition.x === "number" &&
      typeof playerPosition.y === "number"
    ) {
      const tileSize =
        typeof global.TILE_SIZE === "number" ? global.TILE_SIZE : 30;
      const discoveryRadiusTiles = Math.max(
        1,
        Math.floor((discoveryRadius || 0) / tileSize)
      );
      const chebyshevDist = Math.max(
        Math.abs(playerPosition.x - x),
        Math.abs(playerPosition.y - y)
      );
      canManualMine = chebyshevDist <= discoveryRadiusTiles;
    }
    const isDepleted = nodeDepletionAmount === 0;

    const handleManualMine = () => {
      if (
        !isDepleted &&
        typeof nodeDepletionAmount === "number" &&
        nodeDepletionAmount > 0
      ) {
        if (onDepleteNode) {
          onDepleteNode(nodeId, nodeDepletionAmount - 1, true);
          setMiningFeedback(true);
          setTimeout(() => setMiningFeedback(false), 100);
          // trigger feedback to user momentarily changing the node border color
        }
      }
    };

    // Helper to update node amount for miner placement
    const handlePlaceMachine = (machineType, nodeId) => {
      if (placeMachine) {
        placeMachine(machineType, nodeId);
      }
    };

    const mineIcon = (
      <TouchableOpacity
        style={{
          marginLeft: 2,
          padding: 6,
          opacity: !canManualMine || isDepleted ? 0.4 : 1,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => canManualMine && !isDepleted && handleManualMine()}
        disabled={!canManualMine || isDepleted}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Icon name="pickaxe" size={24} color="#FFD700" />
      </TouchableOpacity>
    );

    return (
      <TouchableOpacity
        activeOpacity={0.93}
        onPress={onPressExpand}
        style={[
          styles.nodeCard,
          isExpanded && styles.selectedCard,
          miningFeedback && { borderColor: '#FFD700', borderWidth: 4, shadowColor: '#FFD700', shadowOpacity: 0.7, shadowRadius: 10 }
        ]}
      >
        {/* Fila principal */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={[
                styles.nodeName,
                {
                  fontSize: isExpanded ? 17 : 14,
                  fontWeight: isExpanded ? "bold" : "normal",
                },
              ]}
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text
              style={[
                styles.nodeDescription,
                { fontSize: isExpanded ? 13 : 11, color: "#aaa" },
              ]}
              numberOfLines={1}
            >
              ({x}, {y}) • {producedItemName}
            </Text>
            {assignedMachineCount > 0 && (
              <Text
                style={[
                  styles.automatedRate,
                  { fontSize: isExpanded ? 13 : 11, color: "#27ae60" },
                ]}
              >
                +{automatedProductionRate.toFixed(1)}/s
              </Text>
            )}
          </View>
          {/* Acciones a la derecha */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 8,
            }}
          >
            {isExpanded &&
              !isDepleted &&
              showManualMineButton &&
              canManualMine &&
              mineIcon}
            {!isDepleted && showManualMineButton && !canManualMine && (
              <Text style={{ color: "#c00", fontSize: 12, marginTop: 2 }}>
                Move closer to mine
              </Text>
            )}
            {canPlaceMiner && (
              <TouchableOpacity
                style={{
                  marginLeft: 8,
                  padding: 6,
                  backgroundColor: "#232",
                  borderRadius: 6,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => handlePlaceMachine("miner", nodeId)}
              >
                <Icon name="cogs" size={18} color="#fff" />
                {isExpanded && (
                  <Text style={{ color: "#fff", fontSize: 13, marginLeft: 4 }}>
                    Miner
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {machineRequired === "oilExtractor" && canPlaceOilExtractor && (
              <TouchableOpacity
                style={{
                  marginLeft: 8,
                  padding: 6,
                  backgroundColor: "#234",
                  borderRadius: 6,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => handlePlaceMachine("oilExtractor", nodeId)}
              >
                <Icon name="tint" size={18} color="#fff" />
                {isExpanded && (
                  <Text style={{ color: "#fff", fontSize: 13, marginLeft: 4 }}>
                    Extractor
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Detalles y barra solo si expandido */}
        {isExpanded && (
          <View>
            {nodeDepletionAmount !== null && (
              <ProgressBar
                value={nodeDepletionAmount}
                max={nodeCapacity}
                label={null}
                style={{
                  marginTop: 6,
                  marginBottom: 4,
                  height: 10,
                  opacity: isDepleted ? 0.5 : 1,
                }}
              />
            )}
            {isDepleted && (
              <Text
                style={{
                  color: "#c00",
                  fontWeight: "bold",
                  fontSize: 13,
                  marginBottom: 2,
                }}
              >
                Depleted
              </Text>
            )}


            {machineRequired && (
              <Text
                style={[
                  styles.nodeCapability,
                  { fontSize: 11, color: "#00BFFF", marginTop: 2 },
                ]}
              >
                Requires: {items[machineRequired]?.name || machineRequired}
              </Text>
            )}
            {assignedMachineCount > 0 && (
              <Text
                style={[
                  styles.assignedCount,
                  { fontSize: 11, color: "#27ae60", marginTop: 2 },
                ]}
              >
                Machines: {assignedMachineCount}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

export default NodeCard;
