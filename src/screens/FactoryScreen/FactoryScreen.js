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
import { Text, CustomHeader } from "../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        ref={scrollRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <ResourceOverviewHeader />
        <View style={{}}>
          <MilestoneCard
            currentMilestone={currentMilestone}
            inventory={inventory}
            discoveredNodes={discoveredNodes}
            onPress={() => navigation.navigate("MilestonesScreen")}
          />
          <View style={styles.rowSplit}>
            <TouchableOpacity
              style={[styles.gridItem, styles.halfItem]}
              onPress={() => navigation.navigate("MapScreen")}
            >
              <Text style={styles.gridItemTitle}>World Map</Text>
              <Image
                source={require("../../../assets/images/UI/cardBg/worldMap.png")}
                style={{
                  width: 80,
                  height: 80,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridItem, styles.halfItem]}
              onPress={() => navigation.navigate("BuildScreen")}
            >
              <Text numberOfLines={2} style={styles.gridItemTitle}>
                Machine Builder
              </Text>
              <Image
                source={require("../../../assets/images/UI/cardBg/buildMachines.png")}
                style={{
                  width: 80,
                  height: 80,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          <DeployedMachinesCard
            placedMachines={placedMachines}
            ownedMachines={ownedMachines}
            craftingQueue={craftingQueue}
            allResourceNodes={allResourceNodes}
            onPress={() => navigation.navigate("DeployedMachinesScreen")}
          />

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("InventoryScreen")}
          >
            <Text style={styles.gridItemTitle}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ProductAssemblyScreen")}
          >
            <Text style={styles.gridItemTitle}>Product Assembly</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
