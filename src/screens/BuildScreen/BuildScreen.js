import React, { useState } from "react";
import { View, ScrollView, Alert, Dimensions, ImageBackground, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
      <ImageBackground
        source={require("../../../assets/images/backgrounds/background.png")}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.4)", "rgba(58, 2, 66, 0.6)", "rgba(0, 0, 0, 0.5)"]}
          style={styles.gradientOverlay}
        >
          {/* Stats Overview */}
          <StatsOverview
            allBuildableItems={allBuildableItems}
            ownedMachines={ownedMachines}
          />

          {/* Machine Cards List */}
          <FlatList
            data={allBuildableItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MachineCard
                item={item}
                inventory={inventory}
                getMachineColor={getMachineColor}
                onBuild={handleBuild}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default BuildScreen;
