import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { Text } from "../../../../components";
import Colors from "../../../../constants/Colors";
import { getMachineIcon } from "../../hooks";

export default function MachineCard({
  item,
  inventory,
  getMachineColor,
  onBuild,
}) {
  const machineColor = getMachineColor(item.id);
  const isLocked = !item.isUnlocked;
  const canBuild = item.isUnlocked && item.canBuild;

  const buildTime = Number(item.buildTime) || 0; // seconds
  const [building, setBuilding] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const progress = buildTime > 0 ? Math.min(1, elapsed / buildTime) : 0;

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!building) return;
    // tick every 100ms for smoothness
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 0.1);
    }, 50);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [building]);

  useEffect(() => {
    if (!building) return;
    if (elapsed >= buildTime) {
      // finish build
      setBuilding(false);
      setElapsed(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // call handler
      onBuild && onBuild(item.id);
    }
  }, [elapsed, buildTime, building, item.id, onBuild]);

  return (
    <View
      key={item.id}
      style={[
        styles.machineCard,
        isLocked && styles.lockedMachineCard,
        canBuild && styles.availableMachineCard,
      ]}
    >
      {/* Status Badge */}
      {isLocked && (
        <View style={styles.statusBadge}>
          <MaterialCommunityIcons name="lock" size={10} color="#fff" />
          <Text style={styles.statusBadgeText}>LOCKED</Text>
        </View>
      )}

      {/* Machine Header - Compact */}
      <View style={styles.machineHeader}>
        <View
          style={[
            styles.machineIcon,
            {
              backgroundColor: isLocked
                ? Colors.textMuted + "30"
                : machineColor + "20",
              borderColor: isLocked ? Colors.textMuted : machineColor,
            },
          ]}
        >
          <Text style={styles.machineIconText}>{getMachineIcon(item.id)}</Text>
        </View>

        <View style={styles.machineInfo}>
          <Text
            style={[styles.machineName, isLocked && styles.lockedMachineName]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
      </View>

      {/* Requirements Section - Compact */}
      {!isLocked && (
        <View style={styles.requirementsContainer}>
          {Object.keys(item.inputs || {}).length > 0 ? (
            <View style={styles.requirementsList}>
              {Object.entries(item.inputs || {}).map(
                ([inputId, requiredAmount]) => {
                  const currentAmount = Math.floor(
                    inventory[inputId]?.currentAmount || 0
                  );
                  const hasEnough = currentAmount >= requiredAmount;
                  return (
                    <View key={inputId} style={styles.requirementItem}>
                      <View
                        style={[
                          styles.requirementIndicator,
                          {
                            backgroundColor: hasEnough
                              ? Colors.accentGreen
                              : Colors.textDanger,
                          },
                        ]}
                      />
                      <Text style={styles.requirementText} numberOfLines={1}>
                        {inventory[inputId]?.name || inputId}
                      </Text>
                      <Text
                        style={[
                          styles.requirementAmount,
                          hasEnough
                            ? styles.hasEnoughAmount
                            : styles.needsAmount,
                        ]}
                      >
                        {currentAmount}/{requiredAmount}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>
          ) : (
            <View style={styles.noRequirementsContainer}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={12}
                color={Colors.accentGreen}
              />
              <Text style={styles.noRequirementsText}>
                No materials required
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Standard Build Button */}
      <TouchableOpacity
        onPress={() => {
          if (building) return; // already building
          if (!canBuild || isLocked) return;
          if (buildTime <= 0) {
            // instant build
            onBuild && onBuild(item.id);
            return;
          }
          setBuilding(true);
          setElapsed(0);
        }}
        disabled={(!canBuild && !isLocked) || building}
        style={[
          styles.buildButton,
         /*  isLocked && styles.lockedBuildButton,
          canBuild && styles.availableBuildButton,
          !canBuild && !isLocked && styles.disabledBuildButton,
          building && styles.buildingButton, */
        ]}
      >
       
        <Text style={styles.buildButtonText}>
          {isLocked
            ? "Locked"
            : building
            ? `Building...`
            : canBuild
            ? "Build"
            : "Missing Items"}
        </Text>
      </TouchableOpacity>

      {/* Building overlay (visual progress) */}
      {building && (
        <View
          pointerEvents="none"
          style={[
            styles.buildingOverlay,
            { height: `${progress * 100}%`, backgroundColor: machineColor },
          ]}
        />
      )}
    </View>
  );
}
