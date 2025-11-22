import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "../../../../components";
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
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "column", gap: 12 }}>
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

          {/* Assign Recipe Button */}
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
        </View>
      </LinearGradient>

      {/* Crafting Progress */}
      {status.isProcessing && currentProcess && (
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
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: Colors.accentGreen,
                    },
                  ]}
                >
                  {currentProcess?.recipeId &&
                    GameAssets.icons[currentProcess.recipeId] && (
                      <Image
                        source={GameAssets.icons[currentProcess.recipeId]}
                        style={{ width: 16, height: 16 }}
                      />
                    )}
                </View>
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
      {!status.isProcessing && currentRecipe && (
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
            {GameAssets.icons[currentRecipe.id] && (
              <Image
                source={GameAssets.icons[currentRecipe.id]}
                style={{ width: 16, height: 16, marginRight: 4 }}
              />
            )}
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
