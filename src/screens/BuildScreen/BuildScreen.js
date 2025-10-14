import React, { useState } from "react";
import { View, ScrollView, Alert, Dimensions } from "react-native";
import { CustomHeader } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGame } from "../../contexts/GameContext";
import { useMachineColors } from "../../hooks";
import { getSortedBuildable } from "./hooks";
import styles from "./styles";
import { MachineCard, StatsOverview } from "./components";

const BuildScreen = () => {
  const {
    buildableItems,
    buildItem,
    inventory,
    ownedMachines,
    unlockedMachineNames,
    milestones,
  } = useGame();
  const { getMachineColor } = useMachineColors();

  // Build and sort items using helper
  const allBuildableItems = getSortedBuildable(
    buildableItems,
    unlockedMachineNames,
    milestones
  );

  const handleBuild = (itemId) => {
    const success = buildItem(itemId);
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
        <StatsOverview
          allBuildableItems={allBuildableItems}
          ownedMachines={ownedMachines}
        />

        {/* Machine Cards Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridContainer}>
            {allBuildableItems.map((item) => (
              <MachineCard
                key={item.id}
                item={item}
                inventory={inventory}
                getMachineColor={getMachineColor}
                onBuild={handleBuild}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default BuildScreen;
