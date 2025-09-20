import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { Text, CustomHeader } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGame } from "../../contexts/GameContext";
import { useMachineColors } from "../../hooks";
import Colors from "../../constants/Colors";
import styles from "./styles";

const { width } = Dimensions.get('window');

const BuildScreen = () => {
  const { buildableItems, buildItem, inventory, ownedMachines, unlockedMachineNames, milestones } = useGame();
  const { getMachineColor, getMachineColorWithOpacity } = useMachineColors();

  // Show all buildable items, but distinguish between locked and unlocked
  const allBuildableItems = buildableItems.map(item => {
    const isUnlocked = unlockedMachineNames.includes(item.name);
    const requiredMilestone = milestones.find(milestone =>
      milestone.unlockedMachines && milestone.unlockedMachines.includes(item.name)
    );

    return {
      ...item,
      isUnlocked,
      requiredMilestone: requiredMilestone || null
    };
  }).sort((a, b) => {
    // Define fixed order: Miner, Smelter, Constructor, Assembler, then natural order
    const fixedOrder = ['miner', 'smelter', 'constructor', 'assembler'];
    
    const aOrderIndex = fixedOrder.indexOf(a.id);
    const bOrderIndex = fixedOrder.indexOf(b.id);
    
    // If both machines are in fixed order, sort by fixed order
    if (aOrderIndex !== -1 && bOrderIndex !== -1) {
      return aOrderIndex - bOrderIndex;
    }
    
    // If only one is in fixed order, prioritize it
    if (aOrderIndex !== -1 && bOrderIndex === -1) return -1;
    if (aOrderIndex === -1 && bOrderIndex !== -1) return 1;
    
    // For machines not in fixed order, use milestone-based ordering
    if (aOrderIndex === -1 && bOrderIndex === -1) {
      // First: unlocked and can build
      const aCanBuild = a.isUnlocked && a.canBuild;
      const bCanBuild = b.isUnlocked && b.canBuild;

      if (aCanBuild && !bCanBuild) return -1;
      if (!aCanBuild && bCanBuild) return 1;

      // Second: unlocked but insufficient resources
      const aUnlockedOnly = a.isUnlocked && !a.canBuild;
      const bUnlockedOnly = b.isUnlocked && !b.canBuild;

      if (aUnlockedOnly && !bUnlockedOnly) return -1;
      if (!aUnlockedOnly && bUnlockedOnly) return 1;

      // Third: locked machines (by milestone order if available)
      const aLocked = !a.isUnlocked;
      const bLocked = !b.isUnlocked;

      if (!aLocked && bLocked) return -1;
      if (aLocked && !bLocked) return 1;

      // If both locked or both same status, order by milestone ID then name
      if (a.requiredMilestone && b.requiredMilestone) {
        const milestoneCompare = a.requiredMilestone.id - b.requiredMilestone.id;
        if (milestoneCompare !== 0) return milestoneCompare;
      }
      
      // Finally: alphabetical order within the same group
      return a.name.localeCompare(b.name);
    }
  });

  const handleBuild = (itemId) => {
    const itemToBuild = allBuildableItems.find((item) => item.id === itemId);
    if (!itemToBuild?.isUnlocked) {
      Alert.alert(
        "Machine Locked",
        `Complete the "${itemToBuild?.requiredMilestone?.title || 'required milestone'}" to unlock this machine.`
      );
      return;
    }
    const success = buildItem(itemId);
  };

  const getMachineIcon = (machineId) => {
    const icons = {
      'miner': '⛏️',
      'smelter': '🔥',
      'constructor': '🔧',
      'assembler': '⚙️',
      'foundry': '🏭',
      'manufacturer': '🏗️',
      'refinery': '⚗️',
      'oilExtractor': '🛢️'
    };
    return icons[machineId] || '🔧';
  };

  const renderMachineCard = (item) => {
    const machineColor = getMachineColor(item.id);
    const isLocked = !item.isUnlocked;
    const canBuild = item.isUnlocked && item.canBuild;

    return (
      <View key={item.id} style={[
        styles.machineCard,
        isLocked && styles.lockedMachineCard,
        canBuild && styles.availableMachineCard,
      ]}>
        {/* Status Badge */}
        {isLocked && (
          <View style={styles.statusBadge}>
            <MaterialCommunityIcons name="lock" size={12} color="#fff" />
            <Text style={styles.statusBadgeText}>LOCKED</Text>
          </View>
        )}
        

        {/* Machine Header */}
        <View style={styles.machineHeader}>
          <View style={[
            styles.machineIcon,
            { 
              backgroundColor: isLocked ? '#3a3a3a' : machineColor + '30',
              borderColor: isLocked ? '#555' : machineColor 
            }
          ]}>
            <Text style={styles.machineIconText}>
              {getMachineIcon(item.id)}
            </Text>
          </View>

          <View style={styles.machineInfo}>
            <Text style={[
              styles.machineName,
              isLocked && styles.lockedMachineName
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.machineDescription,
              isLocked && styles.lockedMachineDescription
            ]} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>

        {/* Requirements Section */}
        {!isLocked && (
          <View style={styles.requirementsContainer}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="package-variant" size={16} color="#6db4f0" />
              <Text style={styles.sectionTitle}>Required Materials</Text>
            </View>
            
            {Object.keys(item.inputs || {}).length > 0 ? (
              <View style={styles.requirementsList}>
                {Object.entries(item.inputs || {}).map(([inputId, requiredAmount]) => {
                  const currentAmount = Math.floor(inventory[inputId]?.currentAmount || 0);
                  const hasEnough = currentAmount >= requiredAmount;

                  return (
                    <View key={inputId} style={styles.requirementItem}>
                      <View style={[
                        styles.requirementIndicator,
                        { backgroundColor: hasEnough ? '#4CAF50' : '#ff6b47' }
                      ]} />
                      <Text style={styles.requirementText}>
                        {inventory[inputId]?.name || inputId}
                      </Text>
                      <Text style={[
                        styles.requirementAmount,
                        hasEnough ? styles.hasEnoughAmount : styles.needsAmount
                      ]}>
                        {currentAmount}/{requiredAmount}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.noRequirementsContainer}>
                <MaterialCommunityIcons name="check-circle-outline" size={16} color="#4CAF50" />
                <Text style={styles.noRequirementsText}>No materials required</Text>
              </View>
            )}
          </View>
        )}

        {/* Locked Information */}
        {isLocked && (
          <View style={styles.lockedContainer}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="lock-outline" size={16} color="#ff6b47" />
              <Text style={styles.sectionTitle}>Unlock Requirements</Text>
            </View>
            <Text style={styles.lockedText}>
              Complete milestone: "{item.requiredMilestone?.name || 'Unknown milestone'}"
            </Text>
          </View>
        )}

        {/* Build Button */}
        <TouchableOpacity
          style={[
            styles.buildButton,
            isLocked && styles.lockedBuildButton,
            canBuild && styles.availableBuildButton,
            !canBuild && !isLocked && styles.disabledBuildButton
          ]}
          onPress={() => handleBuild(item.id)}
          disabled={!canBuild && !isLocked}
        >
          <MaterialCommunityIcons 
            name={
              isLocked ? "lock" : 
              canBuild ? "hammer" : 
              "alert-circle"
            } 
            size={18} 
            color="#fff" 
          />
          <Text style={styles.buildButtonText}>
            {isLocked ? "Locked" : canBuild ? `Build ${item.name}` : "Insufficient Resources"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader 
        title="Machine Builder" 
        rightIcon="factory"
        onRightIconPress={() => console.log("Factory icon pressed")}
      />
      <View style={styles.container}>
        {/* Machine Cards List */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {allBuildableItems.map(item => renderMachineCard(item))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};


export default BuildScreen;
