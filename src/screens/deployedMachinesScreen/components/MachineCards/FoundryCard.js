import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components';
import { GameAssets } from '../../../../components/AppLoader';
import ProgressBar from '../../../../components/ProgressBar';
import Colors from '../../../../constants/Colors';
import { useFoundryCard } from '../../hooks';
import { getMachineIcon } from '../../hooks/useMachineCard';
import styles from '../../styles';

const FoundryCard = ({ machine, navigation }) => {
  const {
    liveMachine,
    currentRecipe,
    currentProcess,
    progress,
    status,
    machineColor,
    displayName,
    actions,
  } = useFoundryCard(machine);

  const openFoundryScreen = () => {
    navigation.navigate("FoundryScreen", {
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
            onPress={openFoundryScreen}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#00ffff', '#ff00cc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.assignNodeButton}
            >
              <View style={styles.assignNodeButtonInner}>
                <MaterialCommunityIcons
                  name="anvil"
                  size={20}
                  color={Colors.textPrimary}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.assignNodeText}>
                  {status.isProcessing ? "Change" : liveMachine.currentRecipeId ? "Change" : "Assign"}
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
              <View style={styles.selectedNodePill}>
                <Text style={styles.selectedNodePillText}>
                  Forging: {currentProcess.itemName} (Queue: {currentProcess.queueLength || 1})
                </Text>
              </View>
              <Text style={[styles.machineStatus, { color: status.color }]}>
                {status.text}
              </Text>
            </View>

            <View style={styles.depletionSection}>
              <ProgressBar
                value={progress}
                max={currentProcess.processingTime}
                label="Forging Progress"
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
          <Text style={[styles.machineStatus, { color: status.color }]}>
            {status.text}
          </Text>
          {currentRecipe && (
            <Text style={styles.recipeInfo}>
              Ready to forge: {currentRecipe.name}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default FoundryCard;