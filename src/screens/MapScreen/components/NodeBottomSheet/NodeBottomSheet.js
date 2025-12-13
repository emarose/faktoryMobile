import React from "react";
import { View, TouchableOpacity, Dimensions, Modal, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
const BOTTOM_SHEET_MAX_HEIGHT = Math.min(SCREEN_HEIGHT * 0.6, 450);
const CHARGE_DURATION = 2000;

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
      translateY.value = withSpring(SCREEN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT - insets.bottom, {
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

      {/* Bottom Sheet with gradient border */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            height: BOTTOM_SHEET_MAX_HEIGHT + insets.bottom,
          },
          animatedSheetStyle,
        ]}
      >
        <LinearGradient
          colors={['#00ffff', '#ff00cc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            flex: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 2,
          }}
        >
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.backgroundPanel,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            paddingTop: 16,
          }}
        >
        <ScrollView 
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: Math.max(insets.bottom, 12) + 16,
          }}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
        {/* Handle */}
        <View
          style={{
            width: 40,
            height: 4,
            backgroundColor: Colors.cyan,
            borderRadius: 2,
            alignSelf: "center",
            marginBottom: 12,
          }}
        />

        {/* Header - compact node info */}
        <View style={{ alignItems: "center", marginBottom: 10, paddingHorizontal: 16 }}>
          <View style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            marginBottom: 8
          }}>
            <IconContainer
              iconId={nodeType}
              size={48}
              iconSize={40}
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                borderWidth: 2,
                borderColor: Colors.cyan,
                shadowColor: Colors.cyan,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 6,
                elevation: 4,
              }}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: Colors.textPrimary }}>
                {name}
              </Text>
              <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 2 }}>
                Location: ({x}, {y})
              </Text>
            </View>
          </View>
        </View>

        {/* Production Info Card */}
        <View style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: Colors.accentGreen,
          shadowColor: Colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="package-variant" size={18} color={Colors.cyan} />
              <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.textPrimary, marginLeft: 8 }}>
                Resource
              </Text>
            </View>
            <Text style={{ fontSize: 13, fontWeight: "bold", color: Colors.cyan }}>
              {producedItemName}
            </Text>
          </View>

          {automatedProductionRate > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="speedometer" size={18} color={Colors.accentGreen} />
                <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.textPrimary, marginLeft: 8 }}>
                  Production Rate
                </Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: "bold", color: Colors.accentGreen }}>
                +{automatedProductionRate.toFixed(1)}/s
              </Text>
            </View>
          )}

          {assignedMachineCount > 0 && (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="factory" size={18} color={Colors.accentBlue} />
                <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.textPrimary, marginLeft: 8 }}>
                  Active Miners
                </Text>
              </View>
              <Text style={{ fontSize: 13, fontWeight: "bold", color: Colors.accentBlue }}>
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
          <View style={{ marginBottom: 12, paddingHorizontal: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: Colors.textSecondary, fontWeight: '600' }}>
                Remaining Resources
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "700", color: isDepleted ? Colors.textDanger : Colors.accentGreen }}>
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
            backgroundColor: "rgba(220, 20, 60, 0.25)",
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            marginHorizontal: 16,
            borderWidth: 2,
            borderColor: Colors.textDanger,
            shadowColor: Colors.textDanger,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ color: Colors.textDanger, fontSize: 14, fontWeight: "700", textAlign: "center" }}>
              ⚠️ Node Depleted
            </Text>
          </View>
        )}

        {machineRequired && !assignedMachineCount && (
          <View style={{
            backgroundColor: "rgba(0, 255, 255, 0.15)",
            borderRadius: 8,
            padding: 10,
            marginBottom: 12,
            marginHorizontal: 16,
            borderWidth: 2,
            borderColor: Colors.cyan,
            shadowColor: Colors.cyan,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text style={{ fontSize: 13, color: Colors.cyan, textAlign: "center", fontWeight: '600' }}>
              ⚙️ Requires: {items[machineRequired]?.name || machineRequired}
            </Text>
          </View>
        )}

        {/* Manual Mine Button */}
        {manualMineable && (
          <View style={{ alignItems: "center", marginBottom: 8, paddingHorizontal: 16 }}>
            {canManualMine && !isDepleted ? (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <LinearGradient
                  colors={isCharging ? ['#27ae60', '#27ae60'] : ['#ff00cc', '#00ffff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 8,
                    padding: 2,
                    width: '100%',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      position: 'relative',
                      overflow: 'hidden',
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
                          backgroundColor: isCharging ? 'rgba(39, 174, 96, 0.5)' : 'rgba(0, 255, 255, 0.3)',
                        },
                        chargeProgressStyle,
                      ]}
                    />
                    <Icon name="pickaxe" size={20} color={Colors.textPrimary} style={{ zIndex: 1 }} />
                    <Text style={{ color: Colors.textPrimary, fontWeight: "600", fontSize: 14, zIndex: 1 }}>
                      {isCharging ? "Mining..." : "Hold to Mine"}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                {isCharging && (
                  <Text style={{ color: Colors.textSecondary, fontSize: 11, marginTop: 6, fontWeight: '600' }}>
                    Release to cancel
                  </Text>
                )}
              </View>
            ) : (
              <View style={{
                backgroundColor: "rgba(100, 100, 100, 0.4)",
                borderRadius: 12,
                padding: 14,
                width: '90%',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: Colors.borderLight,
              }}>
                <Text style={{ color: Colors.textDanger, fontSize: 13, fontWeight: "700" }}>
                  {isDepleted ? "🚫 Node Depleted" : "📍 Move closer to mine"}
                </Text>
              </View>
            )}
          </View>
        )}

        </ScrollView>

        {/* Close button - absolute positioned */}
        <TouchableOpacity 
          onPress={debouncedClose} 
          style={{ 
            position: 'absolute',
            top: 12,
            right: 12,
            padding: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: Colors.cyan,
            shadowColor: Colors.cyan,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 1000,
          }}
        >
          <Icon name="close" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        </View>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
};

export default NodeBottomSheet;