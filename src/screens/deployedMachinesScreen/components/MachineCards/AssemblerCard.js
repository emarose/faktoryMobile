import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../../components';
import { GameAssets } from '../../../../components/AppLoader';
import ProgressBar from '../../../../components/ProgressBar';
import Colors from '../../../../constants/Colors';
import { useAssemblerCard } from '../../hooks';
import { getMachineIcon } from '../../hooks/useMachineCard';
import styles from '../../styles';

const AssemblerCard = ({ machine, navigation }) => {
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
  } = useAssemblerCard(machine);

  const openAssemblerScreen = () => {
    navigation.navigate("AssemblerScreen", {
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
      <View style={styles.rowAlignCenter}>
        <View style={styles.machineInfo}>
          <View style={styles.rowSpaceBetween}>
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
          </View>
        </View>

        {/* Assign Recipe Button */}
        <View style={styles.marginVertical10}>
          <TouchableOpacity
            onPress={openAssemblerScreen}
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
                  name="factory"
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
              <View style={[styles.selectedNodePill, { maxWidth: '65%' }]}>
                <Text style={styles.selectedNodePillText} numberOfLines={1} ellipsizeMode="tail">
                  Assembling: {currentProcess.itemName} (Queue: {machineProcesses ? machineProcesses.length : 1})
                </Text>
              </View>
              <Text style={[styles.machineStatus, { color: status.color, flex: 1, textAlign: 'right' }]} numberOfLines={1} ellipsizeMode="tail">
                {status.text}
              </Text>
            </View>

            <View style={styles.depletionSection}>
              <ProgressBar
                value={progress}
                max={currentProcess.processingTime || 1}
                label="Assembly Progress"
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
              Ready to assemble: {currentRecipe.name}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default AssemblerCard;