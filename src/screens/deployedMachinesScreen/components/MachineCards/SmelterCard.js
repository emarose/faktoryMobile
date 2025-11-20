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
          backgroundColor: Colors.backgroundPanel,
        },
      ]}
    >
      {/* Machine Header */}
      <View style={styles.rowAlignCenter}>
        <View style={styles.machineInfo}>
          <View style={styles.rowSpaceBetween}>
            <View style={styles.rowAlignCenterGap}>
              <View style={styles.machineIconContainer}>
                {getMachineIcon(machine.type, Colors.textPrimary)}
              </View>
              <Text style={[styles.machineName, { color: machineColor }]}>
                {displayName}
              </Text>
            </View>
          </View>
        </View>

        {/* Assign Recipe Button */}
        <View>
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
      </View>

      {/* Crafting Progress */}
      {status.isProcessing && currentProcess && (
        <View style={styles.extraInfoContainer}>
          <View>
            <View style={styles.headerRow}>
              <View
                style={[
                  styles.selectedNodePill,
                  {
                    maxWidth: "70%",
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                {currentProcess?.itemId &&
                  GameAssets.icons[currentProcess.itemId] && (
                    <Image
                      source={GameAssets.icons[currentProcess.itemId]}
                      style={{ width: 16, height: 16, marginRight: 4 }}
                    />
                  )}
                <Text
                  style={styles.selectedNodePillText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Crafting: {currentProcess.itemName} (Queue:{" "}
                  {machineProcesses?.length || 1})
                </Text>
              </View>
              <Text
                style={[styles.machineStatus, { color: status.color }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {status.text}
              </Text>
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
        </View>
      )}

      {/* Recipe Status (when not processing) */}
      {!status.isProcessing && currentRecipe && (
        <View style={styles.extraInfoContainer}>
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
        </View>
      )}
    </View>
  );
};

export default SmelterCard;
