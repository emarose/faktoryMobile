import React, { useContext, useRef, useCallback } from "react";
import { GameContext } from "../../contexts/GameContext";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  ImageBackground,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, CustomHeader } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
import Colors from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import ResourceOverviewHeader from "./components/ResourceOverviewHeader/ResourceOverviewHeader";
import MilestoneCard from "./components/MilestoneCard";
import DeployedMachinesCard from "./components/DeployedMachinesCard";

export default function FactoryScreen() {
  const navigation = useNavigation();
  const {
    currentMilestone,
    inventory,
    discoveredNodes,
    placedMachines,
    ownedMachines,
    craftingQueue,
    allResourceNodes,
  } = useContext(GameContext);

  const scrollRef = useRef(null);

  // Scroll to top whenever the screen receives focus
  useFocusEffect(
    useCallback(() => {
      if (scrollRef.current) {
        try {
          scrollRef.current.scrollTo({ y: 0, animated: true });
        } catch (e) {}
      }
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/backgrounds/background.png")}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          ref={scrollRef}
          contentContainerStyle={styles.scrollViewContent}
        >
          <ResourceOverviewHeader />
          <View style={styles.cardsContainer}>
            <MilestoneCard
              currentMilestone={currentMilestone}
              inventory={inventory}
              discoveredNodes={discoveredNodes}
              onPress={() => navigation.navigate("MilestonesScreen")}
            />
            <View style={styles.rowSplit}>
              <TouchableOpacity
                style={styles.halfItem}
                onPress={() => navigation.navigate("MapScreen")}
              >
                <LinearGradient
                  colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientCard}
                >
                  <Text style={styles.gridItemTitle}>World Map</Text>
                  <Image
                    source={require("../../../assets/images/UI/cardBg/worldMap.png")}
                    style={{
                      width: 100,
                      height: 100,
                    }}
                    resizeMode="cover"
                  />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.halfItem}
                onPress={() => navigation.navigate("BuildScreen")}
              >
                <LinearGradient
                  colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientCard}
                >
                  <Text numberOfLines={2} style={styles.gridItemTitle}>
                  Machine Builder
                  </Text>
                  <Image
                    source={require("../../../assets/images/UI/cardBg/buildMachines.png")}
                    style={{
                      width: 130,
                      height: 100,
                    }}
                    resizeMode="cover"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <DeployedMachinesCard
              placedMachines={placedMachines}
              ownedMachines={ownedMachines}
              craftingQueue={craftingQueue}
              allResourceNodes={allResourceNodes}
              onPress={() => navigation.navigate("DeployedMachinesScreen")}
            />

            <View style={styles.rowSplit}>
              <TouchableOpacity
                style={styles.halfItem}
                onPress={() => navigation.navigate("InventoryScreen")}
              >
                <LinearGradient
                  colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientCard}
                >
                  <Text style={styles.gridItemTitle}>Inventory</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.halfItem}
                onPress={() => navigation.navigate("ProductAssemblyScreen")}
              >
                <LinearGradient
                  colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.gradientCard}
                >
                  <Text style={styles.gridItemTitle}>Product Assembly</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
