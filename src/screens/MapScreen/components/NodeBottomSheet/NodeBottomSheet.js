import React from "react";
import { View, TouchableOpacity, Dimensions, Modal } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, IconContainer } from "../../../../components";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { items } from "../../../../data/items";
import ProgressBar from "../../../../components/ProgressBar";
import Colors from "../../../../constants/Colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOTTOM_SHEET_HEIGHT = 380;
const CHARGE_DURATION = 2000; // 2 seconds to charge

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
  
  // Charging state for manual mine
  const [isCharging, setIsCharging] = React.useState(false);
  const chargeProgress = useSharedValue(0);
  const chargeTimeoutRef = React.useRef(null);

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
  
  const chargeProgressStyle = useAnimatedStyle(() => ({
    width: `${chargeProgress.value * 100}%`,
  }));
  
  // Define mining functions before early return (used in useEffect)
  const handleManualMineCancel = React.useCallback(() => {
    if (chargeTimeoutRef.current) {
      clearTimeout(chargeTimeoutRef.current);
      chargeTimeoutRef.current = null;
    }
    setIsCharging(false);
    chargeProgress.value = withTiming(0, { duration: 200 });
  }, []);
  
  // Cleanup on unmount or when sheet closes
  React.useEffect(() => {
    if (!isVisible) {
      handleManualMineCancel();
    }
  }, [isVisible, handleManualMineCancel]);

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

  const handleManualMineStart = () => {
    if (isDepleted || !canManualMine) return;
    
    setIsCharging(true);
    
    // Animate progress bar
    chargeProgress.value = withTiming(1, {
      duration: CHARGE_DURATION,
      easing: Easing.linear,
    });
    
    // Set timeout to actually mine after charge completes
    chargeTimeoutRef.current = setTimeout(() => {
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
      setIsCharging(false);
      chargeProgress.value = 0;
    }, CHARGE_DURATION);
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
            marginBottom: 24,
          }}
        />

        {/* Header with prominent node icon */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "center",
            marginBottom: 12
          }}>
            <IconContainer
              iconId={nodeType}
              size={56}
              iconSize={48}
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                borderWidth: 2,
                borderColor: Colors.accentGold,
                marginRight: 16,
                shadowColor: Colors.accentGold,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 8,
              }}
            />
            <View style={{ alignItems: "center" }}>
              <Icon 
                name="arrow-right" 
                size={24} 
                color={Colors.textMuted} 
                style={{ marginBottom: 4 }}
              />
              <Text style={{ fontSize: 10, color: Colors.textMuted }}>produces</Text>
            </View>
            <IconContainer
              iconId={producedItemId}
              size={56}
              iconSize={48}
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                borderWidth: 2,
                borderColor: Colors.accentGreen,
                marginLeft: 16,
                shadowColor: Colors.accentGreen,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 8,
                elevation: 8,
              }}
            />
          </View>
          
          <Text style={{ fontSize: 20, fontWeight: "bold", color: Colors.textPrimary, textAlign: "center" }}>
            {name}
          </Text>
          <Text style={{ fontSize: 14, color: Colors.textMuted, marginTop: 4 }}>
            Location: ({x}, {y})
          </Text>
        </View>

        {/* Production Info Card */}
        <View style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: Colors.borderLight,
        }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="package-variant" size={20} color={Colors.accentGold} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.textPrimary, marginLeft: 8 }}>
                Resource
              </Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: Colors.accentGold }}>
              {producedItemName}
            </Text>
          </View>

          {automatedProductionRate > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="speedometer" size={20} color={Colors.accentGreen} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.textPrimary, marginLeft: 8 }}>
                  Production Rate
                </Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: Colors.accentGreen }}>
                +{automatedProductionRate.toFixed(1)}/s
              </Text>
            </View>
          )}

          {assignedMachineCount > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="factory" size={20} color={Colors.accentBlue} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.textPrimary, marginLeft: 8 }}>
                  Active Miners
                </Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: Colors.accentBlue }}>
                {assignedMachineCount}
              </Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        {nodeDepletionAmount !== null && 
         typeof nodeDepletionAmount === 'number' && 
         !isNaN(nodeDepletionAmount) &&
         typeof nodeCapacity === 'number' &&
         !isNaN(nodeCapacity) &&
         nodeCapacity > 0 && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                Remaining Resources
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: isDepleted ? Colors.textDanger : Colors.textPrimary }}>
                {Math.floor(nodeDepletionAmount)} / {nodeCapacity}
              </Text>
            </View>
            <ProgressBar
              value={nodeDepletionAmount}
              max={nodeCapacity}
            />
          </View>
        )}

        {/* Status and Info */}
        {isDepleted && (
          <View style={{
            backgroundColor: "rgba(220, 20, 60, 0.2)",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: Colors.textDanger,
          }}>
            <Text style={{ color: Colors.textDanger, fontSize: 16, fontWeight: "600", textAlign: "center" }}>
              ⚠️ Node Depleted
            </Text>
          </View>
        )}

        {machineRequired && !assignedMachineCount && (
          <View style={{
            backgroundColor: "rgba(255, 165, 0, 0.2)",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: Colors.accentGold,
          }}>
            <Text style={{ fontSize: 13, color: Colors.accentGold, textAlign: "center" }}>
              ⚙️ Requires: {items[machineRequired]?.name || machineRequired}
            </Text>
          </View>
        )}

        {/* Manual Mine Button */}
        {manualMineable && (
          <View style={{ alignItems: "center" }}>
            {canManualMine && !isDepleted ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: isCharging ? Colors.accentGreen : Colors.accentGold,
                    paddingHorizontal: 32,
                    paddingVertical: 16,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    width: '85%',
                    position: 'relative',
                    overflow: 'hidden',
                    shadowColor: isCharging ? Colors.accentGreen : Colors.accentGold,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.6,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                  onPressIn={handleManualMineStart}
                  onPressOut={handleManualMineCancel}
                  activeOpacity={0.9}
                >
                  {/* Charge progress bar background */}
                  <Animated.View
                    style={[
                      {
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      chargeProgressStyle,
                    ]}
                  />
                  <Icon name="pickaxe" size={24} color={Colors.background} style={{ zIndex: 1 }} />
                  <Text style={{ color: Colors.background, fontWeight: "bold", fontSize: 18, zIndex: 1 }}>
                    {isCharging ? "Mining..." : "Hold to Mine"}
                  </Text>
                </TouchableOpacity>
                {isCharging && (
                  <Text style={{ color: Colors.textSecondary, fontSize: 12, marginTop: 8 }}>
                    Release to cancel
                  </Text>
                )}
              </View>
            ) : (
              <View style={{
                backgroundColor: "rgba(100, 100, 100, 0.3)",
                borderRadius: 12,
                padding: 16,
                width: '85%',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.borderLight,
              }}>
                <Text style={{ color: Colors.textDanger, fontSize: 14, fontWeight: "600" }}>
                  {isDepleted ? "🚫 Node Depleted" : "📍 Move closer to mine"}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Close button - absolute positioned */}
        <TouchableOpacity 
          onPress={debouncedClose} 
          style={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            padding: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: Colors.borderLight,
          }}
        >
          <Icon name="close" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default NodeBottomSheet;