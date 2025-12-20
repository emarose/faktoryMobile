import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, IconContainer } from '../../../../components';
import ProgressBar from '../../../../components/ProgressBar';
import Colors from '../../../../constants/Colors';
import { useConstructorCard } from '../../hooks';
import { getMachineIcon } from '../../hooks/useMachineCard';
import styles from '../../styles';
import { GameAssets } from '../../../../components/AppLoader';

const ConstructorCard = ({ machine, navigation }) => {
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
  } = useConstructorCard(machine);

  const [isCollapsed, setIsCollapsed] = useState(true);

  const openConstructorScreen = () => {
    navigation.navigate("ConstructorScreen", {
      machine: liveMachine,
      recipe: liveMachine.currentRecipeId ? { id: liveMachine.currentRecipeId } : null,
    });
  };

  const hasRecipe = currentRecipe || currentProcess;

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
      <View
        style={{
          borderRadius: 8,
          padding: hasRecipe ? 6 : 4,
          marginBottom: (hasRecipe && isCollapsed) ? 0 : (hasRecipe ? 12 : 0),
        }}
      >
        <View style={{ flexDirection: "column", gap: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: hasRecipe ? 12 : 8 }}>
              <View
                style={[styles.machineIconContainer, { borderColor: machineColor }]}
              >
                {getMachineIcon(machine.type, machineColor, 64)}
              </View>
              <Text style={[styles.machineName, { color: machineColor, fontSize: 16 }]}>
                {displayName}
              </Text>
            </View>

            {/* Show collapse toggle only when recipe is assigned */}
            {hasRecipe ? (
              <TouchableOpacity
                onPress={() => setIsCollapsed(!isCollapsed)}
                style={{ padding: 8 }}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name={isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                  size={32}
                  color={machineColor}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={openConstructorScreen} activeOpacity={0.7} style={{ marginLeft: 8 }}>
                <LinearGradient
                  colors={["#00ffff", "#ff00cc"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 6, padding: 1.5 }}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      borderRadius: 5,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 12, color: Colors.textPrimary, fontWeight: "bold" }}>
                      Assign
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Assign Recipe Button - only show when expanded and has recipe */}
          {hasRecipe && !isCollapsed && (
            <TouchableOpacity
              onPress={openConstructorScreen}
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
      </View>

      {/* Collapsed View - only show when has recipe and is collapsed */}
      {hasRecipe && isCollapsed && (
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
                  size={32}
                  iconSize={24}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: Colors.accentGreen,
                  }}
                />
              ) : currentRecipe?.id ? (
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
              <>
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
                
                {machineProcesses && machineProcesses.length > 0 && (
                  <View
                    style={[
                      styles.selectedNodePill,
                      {
                        backgroundColor: Colors.accentBlue + "40",
                        borderWidth: 1,
                        borderColor: Colors.accentBlue,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 10, color: Colors.accentBlue }}>
                      Queue: {machineProcesses.length}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      )}

      {/* Expanded Crafting Progress */}
      {hasRecipe && !isCollapsed && status.isProcessing && currentProcess && (
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
                {currentProcess?.recipeId && (
                  <IconContainer
                    iconId={currentProcess.recipeId}
                    size={32}
                    iconSize={16}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: Colors.accentGreen,
                    }}
                  />
                )}
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
      {hasRecipe && !isCollapsed && !status.isProcessing && currentRecipe && (
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
            {currentRecipe?.id && (
              <IconContainer
                iconId={currentRecipe.id}
                size={24}
                iconSize={16}
                style={{ marginRight: 4 }}
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

export default ConstructorCard;