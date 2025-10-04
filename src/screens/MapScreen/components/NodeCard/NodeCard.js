import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { Text } from "../../../../components";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { items } from "../../../../data/items";
import ProgressBar from "../../../../components/ProgressBar";
import Colors from "../../../../constants/Colors";

const NodeCard = React.memo(
  ({
    node,
    inventory,
    placedMachines,
    styles,
    playerPosition,
    discoveryRadius,
    onDepleteNode,
    onManualMine,
    placeMachine,
    isExpanded,
    onPressExpand,
  }) => {
    const { id: nodeId, name, x, y, type: nodeType } = node;

    const nodeDefinition = items[nodeType];
    const [miningFeedback, setMiningFeedback] = useState(false);
    const rippleScale = useRef(new Animated.Value(1)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;
    const { manualMineable, machineRequired, output } = nodeDefinition;
    const producedItemId = output ? Object.keys(output)[0] : null;
    const producedItemName =
      (producedItemId && items[producedItemId]?.name) || producedItemId;
    const assignedMachinesOnNode = placedMachines.filter(
      (m) =>
        m.assignedNodeId === nodeId &&
        (m.type === "miner" || m.type === "oilExtractor")
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
      console.log("Manual mine node", nodeId);
      if (
        !isDepleted &&
        typeof nodeDepletionAmount === "number" &&
        nodeDepletionAmount > 0
      ) {
        if (onDepleteNode) {
          onDepleteNode(nodeId, nodeDepletionAmount - 1, true);

          // Trigger ripple animation en el icono
          rippleOpacity.setValue(0.5);
          rippleScale.setValue(0.9);

          Animated.parallel([
            // Animación del icono
            Animated.timing(rippleScale, {
              toValue: 1.8,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();

          onManualMine(nodeId);
        }
      }
    };

    const mineIcon = (
      <TouchableOpacity
        style={{
          marginLeft: 2,
          padding: 6,
          opacity: !canManualMine || isDepleted ? 0.4 : 1,
          width: 48,
          height: 48,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => canManualMine && !isDepleted && handleManualMine()}
        disabled={!canManualMine || isDepleted}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {/* Container for ripple effect - centered using flexbox */}
        <View
          style={{
            width: 56,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Ripple effect background */}
          <Animated.View
            style={{
              position: "absolute",
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: Colors.accentGold,
              opacity: rippleOpacity,
              transform: [{ scale: rippleScale }],
            }}
          />
          {/* Icon centered in the container */}
          <Icon name="pickaxe" size={24} color={Colors.accentGold} />
        </View>
      </TouchableOpacity>
    );

    return (
      <TouchableOpacity
        activeOpacity={0.93}
        onPress={onPressExpand}
        style={[styles.nodeCard, isExpanded && styles.selectedCard]}
      >
        {/* Fila principal */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
              {assignedMachineCount > 0 && (
                <Icon
                  name="factory"
                  size={isExpanded ? 18 : 16}
                  color={Colors.accentGreen}
                  style={{ marginLeft: 6, opacity: 0.8 }}
                />
              )}
            </View>
            <Text
              style={[
                styles.nodeDescription,
                { fontSize: isExpanded ? 13 : 11, color: Colors.textMuted },
              ]}
              numberOfLines={1}
            >
              ({x}, {y}) • {producedItemName}
            </Text>
            {assignedMachineCount > 0 && (
              <Text
                style={[
                  styles.automatedRate,
                  { fontSize: isExpanded ? 13 : 11, color: Colors.accentGreen },
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
              <Text
                style={{ color: Colors.textDanger, fontSize: 12, marginTop: 2 }}
              >
                Move closer to mine
              </Text>
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
              />
            )}
            {isDepleted && (
              <Text
                style={{
                  color: Colors.textDanger,
                }}
              >
                Node Depleted
              </Text>
            )}

            {machineRequired && (
              <Text
                style={[
                  styles.nodeCapability,
                  { fontSize: 11, color: Colors.accentGreen, marginTop: 2 },
                ]}
              >
                Requires: {items[machineRequired]?.name || machineRequired}
              </Text>
            )}
            {assignedMachineCount > 0 && (
              <Text
                style={[
                  styles.assignedCount,
                  { fontSize: 11, color: Colors.accentGreen, marginTop: 2 },
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
