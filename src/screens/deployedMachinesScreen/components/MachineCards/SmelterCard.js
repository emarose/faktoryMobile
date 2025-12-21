import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, IconContainer } from "../../../../components";
import ProgressBar from "../../../../components/ProgressBar";
import Colors from "../../../../constants/Colors";
import { useSmelterCard } from "../../hooks";
import { getMachineIcon } from "../../hooks/useMachineCard";
import styles from "../../styles";
import { GameAssets } from "../../../../components/AppLoader";

const SmelterCard = ({ machine, navigation }) => {
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
  } = useSmelterCard(machine);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const openSmelterScreen = () => {
    navigation.navigate("SmelterScreen", { machine: liveMachine });
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
              onPress={openSmelterScreen}
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
              {currentProcess?.recipeId ? (
                <IconContainer
                  iconId={currentProcess.recipeId}
                  size={24}
                  iconSize={12}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: Colors.accentGreen,
                  }}
                />
              ) : currentRecipe ? (
                <IconContainer
                  iconId={currentRecipe.id}
                  size={24}
                  iconSize={12}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: Colors.accentBlue,
                  }}
                />
              ) : null}
              <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
                {currentProcess ? currentProcess.itemName : currentRecipe?.name}
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 12, color: Colors.textMuted }}>
              No recipe assigned
            </Text>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {(currentProcess || currentRecipe) && (
              <View
                style={[
                  styles.selectedNodePill,
                  {
                    backgroundColor: status.color + "20",
                    borderWidth: 1,
                    borderColor: status.color,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  },
                ]}
              >
                <Text style={{ fontSize: 10, color: status.color }}>
                  {status.isProcessing ? "Crafting" : "Ready"}
                </Text>
              </View>
            )}

            <TouchableOpacity onPress={openSmelterScreen} activeOpacity={0.7}>
              <LinearGradient
                colors={["#00ffff", "#ff00cc"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ borderRadius: 6, padding: 1 }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ fontSize: 10, color: Colors.textPrimary, fontWeight: "bold" }}>
                    {liveMachine.currentRecipeId ? "Change" : "Assign"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Expanded Crafting Progress */}
      {!isCollapsed && status.isProcessing && currentProcess && (
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: Colors.borderLight,
          }}
        >
          <View>
            <View
              style={[
                styles.headerRow,
                {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  marginBottom: 12,
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <IconContainer
                  iconId={currentProcess?.recipeId}
                  size={32}
                  iconSize={16}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: Colors.accentGreen,
                  }}
                />
                <Text
                  style={[
                    styles.selectedNodePillText,
                    { color: Colors.accentGreen, fontSize: 13, fontWeight: "600" },
                  ]}
                >
                  Crafting: {currentProcess.itemName}
                </Text>
              </View>
            </View>

            {/* Queue Info Badge */}
            <View style={{ marginBottom: 12, flexDirection: "row", gap: 8, alignItems: "center" }}>
              <View
                style={[
                  styles.selectedNodePill,
                  {
                    backgroundColor: Colors.accentBlue + "40",
                    borderWidth: 1,
                    borderColor: Colors.accentBlue,
                  },
                ]}
              >
                <Text
                  style={[styles.selectedNodePillText, { color: Colors.accentBlue, fontSize: 11 }]}
                >
                  Queue: {machineProcesses?.length || 1}
                </Text>
              </View>

              {/* Status Badge */}
              <View
                style={[
                  styles.selectedNodePill,
                  { backgroundColor: status.color + "40", borderWidth: 1, borderColor: status.color },
                ]}
              >
                <Text
                  style={[styles.selectedNodePillText, { color: status.color, fontSize: 11 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {status.text}
                </Text>
              </View>
            </View>

            <View style={styles.depletionSection}>
              <ProgressBar
                value={progress}
                max={currentProcess.processingTime}
                label="Crafting Progress"
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
                  style={[styles.craftingControlButton, styles.cancelButton]}
                  onPress={actions.handleCancelCrafting}
                >
                  <MaterialIcons name="stop" size={16} color="#fff" />
                  <Text style={styles.craftingControlText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      )}

      {/* Recipe Status (when not processing) */}
      {!isCollapsed && !status.isProcessing && currentRecipe && (
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.3)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 8,
            padding: 12,
            borderWidth: 1,
            borderColor: Colors.borderLight,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconContainer
              iconId={currentRecipe.id}
              size={24}
              iconSize={16}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.recipeInfo}>
              Ready to craft: {currentRecipe.name}
            </Text>
          </View>
        </LinearGradient>
      )}
    </View>
  );
};

export default SmelterCard;
