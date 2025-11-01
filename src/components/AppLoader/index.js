// src/components/AppLoader/index.js
import React, { useState, useEffect, createContext, useContext } from "react";
import { View, ActivityIndicator, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import Colors from "../../constants/Colors";

// Font Family context for easy switching
export const FontFamilyContext = createContext({
  currentFont: "BitcountGridSingle-Variable",
  setCurrentFont: () => {},
  availableFonts: {},
  fontFamilies: {},
  currentFontFamily: "BitcountGridSingle",
});

export const useFontFamily = () => useContext(FontFamilyContext);

// Global object to store all preloaded assets
export const GameAssets = {
  icons: {
    // Raw materials
    ironOre: require("../../../assets/images/icons/ironOre16x16.png"),
    copperOre: require("../../../assets/images/icons/copperOre16x16.png"),
    coal: require("../../../assets/images/icons/coal16x16.png"),
    limestone: require("../../../assets/images/icons/limestoneOre16x16.png"),
    cateriumOre: require("../../../assets/images/icons/cateriumOre16x16.png"),
    crudeOil: require("../../../assets/images/icons/crudeOil16x16.png"),
    bauxite: require("../../../assets/images/icons/bauxite16x16.png"),
    sulfur: require("../../../assets/images/icons/sulfur16x16.png"),
    rawQuartz: require("../../../assets/images/icons/rawQuartz16x16.png"),
    uranium: require("../../../assets/images/icons/uranium16x16.png"),

    // Processed materials
    ironIngot: require("../../../assets/images/icons/ironIngots16x16.png"),
    copperIngot: require("../../../assets/images/icons/copperIngots16x16.png"),
    steelIngot: require("../../../assets/images/icons/steelIngots16x16.png"),
    cateriumIngot: require("../../../assets/images/icons/cateriumIngots16x16.png"),
    compactedCoal: require("../../../assets/images/icons/compactedCoal16x16.png"),
    concrete: require("../../../assets/images/icons/concrete16x16.png"),
    fuel: require("../../../assets/images/icons/fuel16x16.png"),
    ironPlates: require("../../../assets/images/icons/ironPlates16x16.png"),
    ironRods: require("../../../assets/images/icons/ironRods16x16.png"),
    steelBeams: require("../../../assets/images/icons/steelBeams16x16.png"),
    steelPipes: require("../../../assets/images/icons/steelPipes16x16.png"),
    blackPowder: require("../../../assets/images/icons/blackPowder16x16.png"),
    sulfuricAcid: require("../../../assets/images/icons/sulfuricAcid16x16.png"),
    quartzCrystals: require("../../../assets/images/icons/quartzCrystals16x16.png"),

    // Nodes
    ironOre_node: require("../../../assets/images/icons/ironOreNode16x16.png"),
    copperOre_node: require("../../../assets/images/icons/copperOreNode16x16.png"),
    limestone_node: require("../../../assets/images/icons/limestoneOreNode16x16.png"),
    cateriumOre_node: require("../../../assets/images/icons/cateriumOreNode16x16.png"),
    bauxite_node: require("../../../assets/images/icons/bauxiteNode16x16.png"),
    coal_node: require("../../../assets/images/icons/coalNode16x16.png"),
    crudeOil_node: require("../../../assets/images/icons/crudeOilNode16x16.png"),
    rawQuartz_node: require("../../../assets/images/icons/rawQuartzNode16x16.png"),
    sulfur_node: require("../../../assets/images/icons/sulfurNode16x16.png"),
    uranium_node: require("../../../assets/images/icons/uraniumNode16x16.png"),

    // Machines
    smelter: require("../../../assets/images/icons/smelter.png"),
    miner: require("../../../assets/images/icons/smelter.png"), // TODO: Replace with actual miner icon
    constructor: require("../../../assets/images/icons/smelter.png"), // TODO: Replace with actual constructor icon
    assembler: require("../../../assets/images/icons/smelter.png"), // TODO: Replace with actual assembler icon
    manufacturer: require("../../../assets/images/icons/smelter.png"), // TODO: Replace with actual manufacturer icon
    foundry: require("../../../assets/images/icons/smelter.png"), // TODO: Replace with actual foundry icon
    refinery: require("../../../assets/images/icons/smelter.png"), // TODO: Replace with actual refinery icon
    oilExtractor: require("../../../assets/images/icons/smelter.png"), // TODO: Replace with actual oilExtractor icon

    // Default icon for fallback
    default: require("../../../assets/images/icons/ironOreNode16x16.png"),
  },
};

// All available fonts in the app
export const AVAILABLE_FONTS = {
  // Space Mono
  "SpaceMono-Regular": require("../../../assets/fonts/Space_Mono/SpaceMono-Regular.ttf"),
  "SpaceMono-Bold": require("../../../assets/fonts/Space_Mono/SpaceMono-Bold.ttf"),
  "SpaceMono-Italic": require("../../../assets/fonts/Space_Mono/SpaceMono-Italic.ttf"),
  "SpaceMono-BoldItalic": require("../../../assets/fonts/Space_Mono/SpaceMono-BoldItalic.ttf"),

  // Pixelify Sans
  "PixelifySans-Regular": require("../../../assets/fonts/Pixelify_Sans/static/PixelifySans-Regular.ttf"),
  "PixelifySans-Medium": require("../../../assets/fonts/Pixelify_Sans/static/PixelifySans-Medium.ttf"),
  "PixelifySans-SemiBold": require("../../../assets/fonts/Pixelify_Sans/static/PixelifySans-SemiBold.ttf"),
  "PixelifySans-Bold": require("../../../assets/fonts/Pixelify_Sans/static/PixelifySans-Bold.ttf"),
  "PixelifySans-Variable": require("../../../assets/fonts/Pixelify_Sans/PixelifySans-VariableFont_wght.ttf"),

  // Press Start 2P
  PressStart2P: require("../../../assets/fonts/Press_Start_2P/PressStart2P-Regular.ttf"),
  // BitcountGridSingle
  "BitcountGridSingle-Variable": require("../../../assets/fonts/BitcountGridSingle/BitcountGridSingle-VariableFont_CRSV,ELSH,ELXP,slnt,wght.ttf"),
};

// Group fonts by family for easier selection
export const FONT_FAMILIES = {
  "Space Mono": [
    "SpaceMono-Regular",
    "SpaceMono-Bold",
    "SpaceMono-Italic",
    "SpaceMono-BoldItalic",
  ],
  "Pixelify Sans": [
    "PixelifySans-Regular",
    "PixelifySans-Medium",
    "PixelifySans-SemiBold",
    "PixelifySans-Bold",
    "PixelifySans-Variable",
  ],
  "Press Start 2P": ["PressStart2P"],
  "BitcountGridSingle": ["BitcountGridSingle-Variable"],
};

const AppLoader = ({ children, onLoaded, loadGameData }) => {
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState("Initializing...");
  const [currentFont, setCurrentFont] = useState("BitcountGridSingle-Variable");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Determine the current font family based on the selected font
  const currentFontFamily =
    Object.keys(FONT_FAMILIES).find((family) =>
      FONT_FAMILIES[family].includes(currentFont)
    ) || "BitcountGridSingle";

  useEffect(() => {
    // Load saved font preference, then preload assets
    const init = async () => {
      try {
        const saved = await AsyncStorage.getItem("@faktory/selectedFont");
        if (saved) setCurrentFont(saved);
      } catch (e) {
        console.warn("Could not load saved font:", e);
      }

      await preloadAllAssets();
    };

    init();
  }, []);

  // Persist font selection
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem("@faktory/selectedFont", currentFont);
      } catch (e) {
        console.warn("Could not save selected font:", e);
      }
    };
    save();
  }, [currentFont]);

  const preloadAllAssets = async () => {
    try {
      setLoadingStep("Loading fonts...");
      await Font.loadAsync({
        ...MaterialIcons.font,
        ...MaterialCommunityIcons.font,
        ...AVAILABLE_FONTS,
      });

      setFontsLoaded(true);

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
          console.error("Error loading game data:", error);
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
        <ActivityIndicator size="large" color={Colors.accentBlue} />
        <Text
          style={{
            color: Colors.textPrimary,
            marginTop: 20,
            fontSize: 16,
            fontFamily: currentFont,
          }}
        >
          {loadingStep}
        </Text>
      </View>
    );
  }

  // Provide font context to all child components
  return (
    <FontFamilyContext.Provider
      value={{
        currentFont,
        setCurrentFont,
        availableFonts: AVAILABLE_FONTS,
        fontFamilies: FONT_FAMILIES,
        currentFontFamily,
        fontsLoaded,
      }}
    >
      {children}
    </FontFamilyContext.Provider>
  );
};

export default AppLoader;
