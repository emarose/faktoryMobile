import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components';
import { GameAssets } from '../../../../components/AppLoader';
import ProgressBar from '../../../../components/ProgressBar';
import Colors from '../../../../constants/Colors';
import { useRefineryCard } from '../../hooks';
import { getMachineIcon } from '../../hooks/useMachineCard';
import styles from '../../styles';

const RefineryCard = ({ machine, navigation }) => {
  const {
    liveMachine,
    currentRecipe,
    machineProcesses,
    currentProcess,
    progress,
    status,
    machineColor,
    displayName,
    actions,
  } = useRefineryCard(machine);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const openRefineryScreen = () => {
    navigation.navigate("RefineryScreen", {
      machine: liveMachine,
      recipe: liveMachine.currentRecipeId ? { id: liveMachine.currentRecipeId } : null,
    });
  };

  return (
    <View
      style={[
        styles.machineCard,
        {
          borderColor: machineColor,
        },
      ]}
    >
      {/* Machine Header */}
      <LinearGradient
        colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.6)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 8,
          padding: 12,
          marginBottom: isCollapsed ? 0 : 12,
        }}
      >
        <View style={{ flexDirection: "column", gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={styles.rowAlignCenterGap}>
              <View
                style={[
                  styles.machineIconContainer,
                  { borderColor: machineColor, borderWidth: 2 },
                ]}
              >
                {getMachineIcon(machine.type, machineColor)}
              </View>
              <Text style={[styles.machineName, { color: machineColor }]}>
                {displayName}
              </Text>
            </View>

            {/* Collapse Toggle */}
            <TouchableOpacity
              onPress={() => setIsCollapsed(!isCollapsed)}
              style={{ padding: 8 }}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                size={24}
                color={machineColor}
              />
            </TouchableOpacity>
          </View>

          {/* Assign Recipe Button - only show when expanded */}
          {!isCollapsed && (
            <TouchableOpacity
              onPress={openRefineryScreen}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#00ffff', '#ff00cc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.assignNodeButton}
              >
                <View style={styles.assignNodeButtonInner}>
                  <Text style={styles.assignNodeText}>
                    {status.isProcessing
                      ? "Change"
                      : liveMachine.currentRecipeId
                      ? "Change"
                      : "Assign"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Collapsed View */}
      {isCollapsed && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          {(currentProcess || currentRecipe) ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {currentProcess?.recipeId && GameAssets.icons[currentProcess.recipeId] ? (
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: Colors.accentGreen,
                      width: 24,
                      height: 24,
                    },
                  ]}
                >
                  <Image
                    source={GameAssets.icons[currentProcess.recipeId]}
                    style={{ width: 12, height: 12 }}
                  />
                </View>
              ) : currentRecipe && GameAssets.icons[currentRecipe.id] ? (
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: Colors.accentBlue,
                      width: 24,
                      height: 24,
                    },
                  ]}
                >
                  <Image
                    source={GameAssets.icons[currentRecipe.id]}
                    style={{ width: 12, height: 12 }}
                  />
                </View>
              ) : null}
              <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                {currentProcess?.itemName || currentRecipe?.name}
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 12, color: Colors.textMuted }}>
              No recipe assigned
            </Text>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {status.isProcessing && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: Colors.accentGreen,
                }}
              />
            )}
            <Text
              style={{
                fontSize: 10,
                color: status.color,
                textTransform: "uppercase",
              }}
            >
              {status.isProcessing ? "Active" : "Idle"}
            </Text>
          </View>
        </View>
      )}

      {/* Collapsed View */}
      {isCollapsed && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          {(currentProcess || currentRecipe) ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {currentProcess?.recipeId && GameAssets.icons[currentProcess.recipeId] ? (
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: Colors.accentGreen,
                      width: 24,
                      height: 24,
                    },
                  ]}
                >
                  <Image
                    source={GameAssets.icons[currentProcess.recipeId]}
                    style={{ width: 12, height: 12 }}
                  />
                </View>
              ) : currentRecipe && GameAssets.icons[currentRecipe.id] ? (
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: Colors.accentBlue,
                      width: 24,
                      height: 24,
                    },
                  ]}
                >
                  <Image
                    source={GameAssets.icons[currentRecipe.id]}
                    style={{ width: 12, height: 12 }}
                  />
                </View>
              ) : null}
              <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                {currentProcess?.itemName || currentRecipe?.name}
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 12, color: Colors.textMuted }}>
              No recipe assigned
            </Text>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {status.isProcessing && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: Colors.accentGreen,
                }}
              />
            )}
            <Text
              style={{
                fontSize: 10,
                color: status.color,
                textTransform: "uppercase",
              }}
            >
              {status.isProcessing ? "Active" : "Idle"}
            </Text>
          </View>
        </View>
      )}

      {/* Expanded View - Crafting Progress */}
      {!isCollapsed && status.isProcessing && currentProcess && (
        <View style={styles.extraInfoContainer}>
          <View>
            <View style={styles.headerRow}>
              <View style={styles.selectedNodePill}>
                <Text style={styles.selectedNodePillText}>
                  Refining: {currentProcess.itemName} (Queue: {machineProcesses ? machineProcesses.length : 1})
                </Text>
              </View>
              <Text style={[styles.machineStatus, { color: status.color }]}>
                {status.text}
              </Text>
            </View>

            <View style={styles.depletionSection}>
              <ProgressBar
                value={progress}
                max={currentProcess.processingTime || 1}
                label="Refining Progress"
                color={
                  currentProcess.status === "paused"
                    ? Colors.accentBlue
                    : Colors.accentGreen
                }
              />

              <View style={styles.craftingControlsContainer}>
                <TouchableOpacity
                  style={[
                    styles.craftingControlButton,
                    currentProcess.status === "paused"
                      ? styles.resumeButton
                      : styles.pauseButton,
                  ]}
                  onPress={actions.handlePauseResume}
                >
                  <MaterialIcons
                    name={
                      currentProcess.status === "paused"
                        ? "play-arrow"
                        : "pause"
                    }
                    size={16}
                    color="#fff"
                  />
                  <Text style={styles.craftingControlText}>
                    {currentProcess.status === "paused" ? "Resume" : "Pause"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.craftingControlButton,
                    styles.cancelButton,
                  ]}
                  onPress={actions.handleCancelCrafting}
                >
                  <MaterialIcons name="stop" size={16} color="#fff" />
                  <Text style={styles.craftingControlText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Expanded View - Recipe Status (when not processing) */}
      {!isCollapsed && !status.isProcessing && (
        <View style={styles.extraInfoContainer}>
          <Text style={[styles.machineStatus, { color: status.color }]}>
            {status.text}
          </Text>
          {currentRecipe && (
            <Text style={styles.recipeInfo}>
              Ready to refine: {currentRecipe.name}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default RefineryCard;