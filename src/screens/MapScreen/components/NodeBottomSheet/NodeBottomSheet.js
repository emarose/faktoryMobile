import React from "react";
import { View, TouchableOpacity, Dimensions, Modal } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, IconContainer } from "../../../../components";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { items } from "../../../../data/items";
import ProgressBar from "../../../../components/ProgressBar";
import Colors from "../../../../constants/Colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOTTOM_SHEET_HEIGHT = 300;

const NodeBottomSheet = ({
  isVisible,
  node,
  placedMachines,
  playerPosition,
  onDepleteNode,
  onManualMine,
  onClose,
  discoveryRadius = 47,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const isClosingRef = React.useRef(false);

  React.useEffect(() => {
    if (isVisible && node) {
      isClosingRef.current = false;
      translateY.value = withSpring(SCREEN_HEIGHT - BOTTOM_SHEET_HEIGHT - insets.bottom, {
        damping: 20,
        stiffness: 300,
      });
      backdropOpacity.value = withTiming(0.5, { duration: 300 });
    } else {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
      backdropOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible, node]);

  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    onClose();
  };

  // Debounced close to prevent double triggers
  const debouncedClose = React.useCallback(() => {
    handleClose();
  }, []);

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Only render modal if visible and node exists
  if (!isVisible || !node) {
    return (
      <Modal transparent visible={false} animationType="none">
        {/* Empty modal */}
      </Modal>
    );
  }

  const { id: nodeId, name, x, y, type: nodeType } = node;
  const nodeDefinition = items[nodeType] || {};
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

  const nodeCapacity = node?.capacity || 1000;
  const nodeDepletionAmount =
    typeof node?.nodeDepletionAmount !== "undefined"
      ? node.nodeDepletionAmount
      : typeof node?.currentAmount !== "undefined"
      ? node.currentAmount
      : nodeCapacity;

  let canManualMine = false;
  if (
    playerPosition &&
    typeof playerPosition.x === "number" &&
    typeof playerPosition.y === "number"
  ) {
    const tileSize = 30; // TILE_SIZE from constants
    const discoveryRadiusTiles = Math.max(
      1,
      Math.floor(discoveryRadius / tileSize)
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
        onManualMine(nodeId);
      }
    }
  };

  return (
    <Modal transparent visible={isVisible && !!node} animationType="none">
      {/* Backdrop */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
          },
          animatedBackdropStyle,
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={debouncedClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            height: BOTTOM_SHEET_HEIGHT + insets.bottom,
            backgroundColor: Colors.backgroundPanel,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom,
            borderTopWidth: 1,
            borderTopColor: Colors.borderLight,
          },
          animatedSheetStyle,
        ]}
      >
        {/* Handle */}
        <View
          style={{
            width: 40,
            height: 4,
            backgroundColor: Colors.borderLight,
            borderRadius: 2,
            alignSelf: "center",
            marginBottom: 20,
          }}
        />

        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconContainer
                iconId={nodeType}
                size={32}
                iconSize={28}
                style={{ 
                  backgroundColor: 'transparent', 
                  borderWidth: 1,
                  borderColor: Colors.borderLight,
                  marginRight: 12
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: Colors.textPrimary }}>
                  {name}
                </Text>
                <Text style={{ fontSize: 14, color: Colors.textMuted, marginTop: 4 }}>
                  ({x}, {y}) • {producedItemName}
                </Text>
                {automatedProductionRate > 0 && (
                  <Text style={{ fontSize: 14, color: Colors.accentGreen, marginTop: 2 }}>
                    +{automatedProductionRate.toFixed(1)}/s
                  </Text>
                )}
              </View>
              {assignedMachineCount > 0 && (
                <Icon
                  name="factory"
                  size={18}
                  color={Colors.accentGreen}
                  style={{ marginLeft: 8, opacity: 0.8 }}
                />
              )}
            </View>
          </View>

          <TouchableOpacity onPress={debouncedClose} style={{ padding: 8 }}>
            <Icon name="close" size={24} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        {nodeDepletionAmount !== null && 
         typeof nodeDepletionAmount === 'number' && 
         !isNaN(nodeDepletionAmount) &&
         typeof nodeCapacity === 'number' &&
         !isNaN(nodeCapacity) &&
         nodeCapacity > 0 && (
          <View style={{ marginBottom: 16 }}>
            <ProgressBar
              value={nodeDepletionAmount}
              max={nodeCapacity}
            />
          </View>
        )}

        {/* Status and Info */}
        {isDepleted && (
          <Text style={{ color: Colors.textDanger, fontSize: 16, marginBottom: 12 }}>
            Node Depleted
          </Text>
        )}

        {machineRequired && (
          <Text style={{ fontSize: 13, color: Colors.accentGreen, marginBottom: 8 }}>
            Requires: {items[machineRequired]?.name || machineRequired}
          </Text>
        )}

        {assignedMachineCount > 0 && (
          <Text style={{ fontSize: 13, color: Colors.accentGreen, marginBottom: 16 }}>
            Machines: {assignedMachineCount}
          </Text>
        )}

        {/* Manual Mine Button */}
        {manualMineable && (
          <View style={{ alignItems: "center", marginTop: 8 }}>
            {canManualMine && !isDepleted ? (
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.accentGold,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
                onPress={handleManualMine}
              >
                <Icon name="pickaxe" size={20} color={Colors.background} />
                <Text style={{ color: Colors.background, fontWeight: "bold", fontSize: 16 }}>
                  Mine Resource
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ color: Colors.textDanger, fontSize: 14 }}>
                {isDepleted ? "Node Depleted" : "Move closer to mine"}
              </Text>
            )}
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

export default NodeBottomSheet;