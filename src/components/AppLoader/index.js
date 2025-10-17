// src/components/AppLoader/index.js
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text, Image } from "react-native";
import * as Font from "expo-font";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import Colors from "../../constants/Colors";

// Global object to store all preloaded assets
export const GameAssets = {
  icons: {
    // Raw materials
    ironOre: require("../../../assets/images/icons/ironOre16x16.png"),
    copperOre: require("../../../assets/images/icons/copperOre16x16.png"),
    coal: require("../../../assets/images/icons/coal16x16.png"),
    limestone: require("../../../assets/images/icons/limestoneOre16x16.png"),
    cateriumOre: require("../../../assets/images/icons/cateriumOre16x16.png"),
    rawQuartz: require("../../../assets/images/icons/rawQuartz16x16.png"),

    // Processed materials
    ironIngot: require("../../../assets/images/icons/ironIngots16x16.png"),
    copperIngot: require("../../../assets/images/icons/copperIngots16x16.png"),
    steelIngot: require("../../../assets/images/icons/steelIngots16x16.png"),
    cateriumIngot: require("../../../assets/images/icons/cateriumIngots16x16.png"),
    compactedCoal: require("../../../assets/images/icons/compactedCoal16x16.png"),
    // Nodes
    ironOre_node: require("../../../assets/images/icons/ironOreNode16x16.png"),
    copperOre_node: require("../../../assets/images/icons/copperOreNode16x16.png"),
    limestone_node: require("../../../assets/images/icons/limestoneOreNode16x16.png"),
    cateriumOre_node: require("../../../assets/images/icons/cateriumOreNode16x16.png"),

    // Machines - These will be added when available
    // miner: require("../../../assets/images/icons/miner16x16.png"),
    // smelter: require("../../../assets/images/icons/smelter16x16.png"),

    // Default icon for fallback
    default: require("../../../assets/images/icons/ironOre16x16.png"),
  },
};

const AppLoader = ({ children, onLoaded, loadGameData }) => {
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState("Initializing...");
  const [showStartNewGameDialog, setShowStartNewGameDialog] = useState(false);

  useEffect(() => {
    preloadAllAssets();
  }, []);

  const preloadAllAssets = async () => {
    try {
      setLoadingStep("Loading fonts...");
      await Font.loadAsync({
        ...MaterialIcons.font,
        ...MaterialCommunityIcons.font,
        "SpaceMono-Regular": require("../../../assets/fonts/Space_Mono/SpaceMono-Regular.ttf"),
        "SpaceMono-Bold": require("../../../assets/fonts/Space_Mono/SpaceMono-Bold.ttf"),
        "SpaceMono-Italic": require("../../../assets/fonts/Space_Mono/SpaceMono-Italic.ttf"),
        "SpaceMono-BoldItalic": require("../../../assets/fonts/Space_Mono/SpaceMono-BoldItalic.ttf"),
      });

      setLoadingStep("Preloading images...");
      // Preload all image assets from GameAssets.icons
      const iconAssets = Object.values(GameAssets.icons).map((icon) =>
        Asset.fromModule(icon).downloadAsync()
      );
      await Promise.all(iconAssets);

      setLoadingStep("Preparing game data...");
      // Precalcular datos que necesites
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Load saved game data if available
      if (loadGameData) {
        setLoadingStep("Loading saved game...");
        try {
          await loadGameData();
        } catch (error) {
          console.error('Error loading game data:', error);
        }
      }

      setLoadingStep("Ready!");
      await new Promise((resolve) => setTimeout(resolve, 300));

      setLoading(false);
      onLoaded?.();
    } catch (error) {
      console.error("Error preloading assets:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.accentGreen} />
        <Text
          style={{
            color: Colors.textPrimary,
            marginTop: 20,
            fontSize: 16,
            fontFamily: "SpaceMono-Regular",
          }}
        >
          {loadingStep}
        </Text>
      </View>
    );
  }

  return children;
};

export default AppLoader;
