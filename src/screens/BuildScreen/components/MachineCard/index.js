import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import { Text } from "../../../../components";
import Colors from "../../../../constants/Colors";
import { GameAssets } from "../../../../components/AppLoader";

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
      style={[
        styles.machineCard,
        isLocked && styles.lockedMachineCard,
        canBuild && styles.availableMachineCard,
      ]}
    >
      {/* Status Badge */}
      {isLocked && (
        <View style={styles.statusBadge}>
          <MaterialCommunityIcons name="lock" size={12} color="#fff" />
          <Text style={styles.statusBadgeText}>LOCKED</Text>
        </View>
      )}

      {/* Horizontal Layout */}
      <View style={styles.cardContent}>
        {/* Left: Machine Icon and Name */}
        <View style={styles.leftSection}>
          <View style={styles.machineIconLarge}>
            {GameAssets.icons[item.id] ? (
              <Image 
                source={GameAssets.icons[item.id]} 
                style={{ width: 56, height: 56 }}
                resizeMode="contain"
              />
            ) : (
              <MaterialCommunityIcons 
                name="cog" 
                size={56} 
                color={isLocked ? "rgba(255, 255, 255, 0.3)" : "#00ffff"}
              />
            )}
          </View>
          <Text
            style={[styles.machineName, isLocked && styles.lockedMachineName]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </View>

        {/* Right: Requirements and Button */}
        <View style={styles.rightSection}>
          {/* Requirements Section */}
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
                        <View key={inputId} style={[
                          styles.requirementItem,
                          !hasEnough && styles.requirementItemMissing
                        ]}>
                          <View style={styles.requirementHeader}>
                            {GameAssets.icons[inputId] && (
                              <Image 
                                source={GameAssets.icons[inputId]} 
                                style={{ width: 20, height: 20, marginRight: 8 }}
                                resizeMode="contain"
                              />
                            )}
                            <Text style={styles.requirementText}>
                              {inventory[inputId]?.name || inputId}
                            </Text>
                          </View>
                          <View style={styles.requirementAmounts}>
                            <View
                              style={[
                                styles.requirementAmountBadge,
                                hasEnough
                                  ? styles.hasEnoughAmount
                                  : styles.needsAmount,
                              ]}
                            >
                              <Text style={styles.requirementAmountText}>
                                {currentAmount} / {requiredAmount}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    }
                  )}
                </View>
              ) : (
                <View style={styles.noRequirementsContainer}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={16}
                    color="#4CAF50"
                  />
                  <Text style={styles.noRequirementsText}>
                    Free to build
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Build Button with Gradient */}
          {canBuild && !building ? (
            <LinearGradient
              colors={["#00ffff", "#ff00cc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buildButtonGradient}
            >
              <TouchableOpacity
                onPress={() => {
                  if (buildTime <= 0) {
                    onBuild && onBuild(item.id);
                    return;
                  }
                  setBuilding(true);
                  setElapsed(0);
                }}
                style={[styles.buildButton, styles.availableBuildButton]}
              >
                <MaterialCommunityIcons name="hammer" size={18} color="#fff" />
                <Text style={styles.buildButtonText}>Build</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (building) return;
                if (!canBuild || isLocked) return;
                if (buildTime <= 0) {
                  onBuild && onBuild(item.id);
                  return;
                }
                setBuilding(true);
                setElapsed(0);
              }}
              disabled={(!canBuild && !isLocked) || building}
              style={[
                styles.buildButton,
                isLocked && styles.lockedBuildButton,
                !canBuild && !isLocked && styles.disabledBuildButton,
                building && styles.buildingButton,
              ]}
            >
              <MaterialCommunityIcons 
                name={isLocked ? "lock" : building ? "cog" : "alert-circle"} 
                size={18} 
                color="#fff" 
              />
              <Text style={styles.buildButtonText}>
                {isLocked
                  ? "Locked"
                  : building
                  ? `Building... ${Math.floor(progress * 100)}%`
                  : "Missing Items"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Building overlay (visual progress) */}
      {building && (
        <View
          pointerEvents="none"
          style={[
            styles.buildingOverlay,
            { height: `${progress * 100}%` },
          ]}
        >
          <LinearGradient
            colors={["rgba(0, 255, 255, 0.3)", "rgba(255, 0, 204, 0.3)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      )}
    </View>
  );
}
