import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components';
import ProgressBar from '../../../../components/ProgressBar';
import Colors from '../../../../constants/Colors';
import { useConstructorCard } from '../../hooks';
import { getMachineIcon } from '../../hooks/useMachineCard';
import styles from '../../styles';

const ConstructorCard = ({ machine, navigation }) => {
  const {
    liveMachine,
    currentRecipe,
    currentProcess,
    progress,
    status,
    machineColor,
    displayName,
    actions,
  } = useConstructorCard(machine);

  const openConstructorScreen = () => {
    navigation.navigate("ConstructorScreen", {
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
          backgroundColor: Colors.backgroundPanel,
        },
      ]}
    >
      {/* Machine Header */}
      <View style={styles.rowAlignCenter}>
        <View style={styles.machineInfo}>
          <View style={styles.rowSpaceBetween}>
            <View style={styles.rowAlignCenterGap}>
              <View
                style={[
                  styles.machineIconContainer,
                  { backgroundColor: machineColor },
                ]}
              >
                {getMachineIcon(machine.type, Colors.textPrimary)}
              </View>
              <Text style={[styles.machineName, { color: machineColor }]}>
                {displayName}
              </Text>
            </View>
          </View>
        </View>

        {/* Assign Recipe Button */}
        <View style={styles.marginVertical10}>
          <TouchableOpacity
            style={styles.assignNodeButton}
            onPress={openConstructorScreen}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="cog"
              size={28}
              color={Colors.textPrimary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.assignNodeText}>
              {status.isProcessing ? "Change" : liveMachine.currentRecipeId ? "Change" : "Assign"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Crafting Progress */}
      {status.isProcessing && currentProcess && (
        <View style={styles.extraInfoContainer}>
          <View>
            <View style={styles.headerRow}>
              <View style={[styles.selectedNodePill, { maxWidth: '65%' }]}>
                <Text style={styles.selectedNodePillText} numberOfLines={1} ellipsizeMode="tail">
                  Crafting: {currentProcess.itemName} (Queue: {currentProcess.queueLength || 1})
                </Text>
              </View>
              <Text style={[styles.machineStatus, { color: status.color, flex: 1, textAlign: 'right' }]} numberOfLines={1} ellipsizeMode="tail">
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

      {/* Recipe Status (when not processing) */}
      {!status.isProcessing && (
        <View style={styles.extraInfoContainer}>
          <Text style={[styles.machineStatus, { color: status.color }]} numberOfLines={1} ellipsizeMode="tail">
            {status.text}
          </Text>
          {currentRecipe && (
            <Text style={styles.recipeInfo} numberOfLines={1} ellipsizeMode="tail">
              Ready to craft: {currentRecipe.name}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default ConstructorCard;