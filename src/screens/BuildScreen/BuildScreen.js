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

const { width } = Dimensions.get("window");

const BuildScreen = () => {
  const {
    buildableItems,
    buildItem,
    inventory,
    ownedMachines,
    unlockedMachineNames,
    milestones,
  } = useGame();
  const { getMachineColor, getMachineColorWithOpacity } = useMachineColors();

  // Show all buildable items, but distinguish between locked and unlocked
  const allBuildableItems = buildableItems
    .map((item) => {
      const isUnlocked = unlockedMachineNames.includes(item.name);
      const requiredMilestone = milestones.find(
        (milestone) =>
          milestone.unlockedMachines &&
          milestone.unlockedMachines.includes(item.name)
      );

      return {
        ...item,
        isUnlocked,
        requiredMilestone: requiredMilestone || null,
      };
    })
    .sort((a, b) => {
      // Define fixed order: Miner, Smelter, Constructor, Assembler, then natural order
      const fixedOrder = [
        "miner",
        "smelter",
        "constructor",
        "foundry",
        "assembler",
      ];

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
          const milestoneCompare =
            a.requiredMilestone.id - b.requiredMilestone.id;
          if (milestoneCompare !== 0) return milestoneCompare;
        }

        // Finally: alphabetical order within the same group
        return a.name.localeCompare(b.name);
      }
    });

  const handleBuild = (itemId) => {
    const itemToBuild = allBuildableItems.find((item) => item.id === itemId);
    console.log("🚀 ~ handleBuild ~ unlockedMachineNames:", unlockedMachineNames)
    if (!itemToBuild?.isUnlocked) {
      Alert.alert(
        "Machine Locked",
        `Complete the "${
          itemToBuild?.requiredMilestone?.title || "required milestone"
        }" to unlock this machine.`
      );
      return;
    }
    const success = buildItem(itemId);
  };

  const getMachineIcon = (machineId) => {
    const icons = {
      miner: "⛏️",
      smelter: "🔥",
      constructor: "🔧",
      assembler: "⚙️",
      foundry: "🏭",
      manufacturer: "🏗️",
      refinery: "⚗️",
      oilExtractor: "🛢️",
    };
    return icons[machineId] || "🔧";
  };

  const renderMachineCard = (item) => {
    const machineColor = getMachineColor(item.id);
    const isLocked = !item.isUnlocked;
    const canBuild = item.isUnlocked && item.canBuild;

    return (
      <View
        key={item.id}
        style={[
          styles.machineCard,
          isLocked && styles.lockedMachineCard,
          canBuild && styles.availableMachineCard,
        ]}
      >
        {/* Status Badge */}
        {isLocked && (
          <View style={styles.statusBadge}>
            <MaterialCommunityIcons name="lock" size={10} color="#fff" />
            <Text style={styles.statusBadgeText}>LOCKED</Text>
          </View>
        )}

        {/* Machine Header - Compact */}
        <View style={styles.machineHeader}>
          <View
            style={[
              styles.machineIcon,
              {
                backgroundColor: isLocked
                  ? Colors.textMuted + "30"
                  : machineColor + "20",
                borderColor: isLocked ? Colors.textMuted : machineColor,
              },
            ]}
          >
            <Text style={styles.machineIconText}>
              {getMachineIcon(item.id)}
            </Text>
          </View>

          <View style={styles.machineInfo}>
            <Text
              style={[styles.machineName, isLocked && styles.lockedMachineName]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>
        </View>

        {/* Requirements Section - Compact */}
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
                      <View key={inputId} style={styles.requirementItem}>
                        <View
                          style={[
                            styles.requirementIndicator,
                            {
                              backgroundColor: hasEnough
                                ? Colors.accentGreen
                                : Colors.textDanger,
                            },
                          ]}
                        />
                        <Text style={styles.requirementText} numberOfLines={1}>
                          {inventory[inputId]?.name || inputId}
                        </Text>
                        <Text
                          style={[
                            styles.requirementAmount,
                            hasEnough
                              ? styles.hasEnoughAmount
                              : styles.needsAmount,
                          ]}
                        >
                          {currentAmount}/{requiredAmount}
                        </Text>
                      </View>
                    );
                  }
                )}
              </View>
            ) : (
              <View style={styles.noRequirementsContainer}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={12}
                  color={Colors.accentGreen}
                />
                <Text style={styles.noRequirementsText}>
                  No materials required
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Standard Build Button */}
        <TouchableOpacity
          onPress={() => handleBuild(item.id)}
          disabled={!canBuild && !isLocked}
          activeOpacity={0.7}
          style={[
            styles.buildButton,
            isLocked && styles.lockedBuildButton,
            canBuild && styles.availableBuildButton,
            !canBuild && !isLocked && styles.disabledBuildButton,
          ]}
        >
          <MaterialCommunityIcons
            name={isLocked ? "lock" : canBuild ? "hammer" : "alert-circle"}
            size={14}
            color="#fff"
          />
          <Text style={styles.buildButtonText}>
            {isLocked ? "Locked" : canBuild ? "Build" : "Need Items"}
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
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="hammer-wrench"
              size={24}
              color={Colors.accentBlue}
            />
            <Text style={styles.statNumber}>
              {allBuildableItems.filter((item) => item.canBuild).length}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="lock"
              size={24}
              color={Colors.textDanger}
            />
            <Text style={styles.statNumber}>
              {allBuildableItems.filter((item) => !item.isUnlocked).length}
            </Text>
            <Text style={styles.statLabel}>Locked</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons
              name="cog"
              size={24}
              color={Colors.accentGreen}
            />
            <Text style={styles.statNumber}>
              {Object.keys(ownedMachines).length}
            </Text>
            <Text style={styles.statLabel}>Owned</Text>
          </View>
        </View>

        {/* Machine Cards Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridContainer}>
            {allBuildableItems.map((item) => renderMachineCard(item))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default BuildScreen;
