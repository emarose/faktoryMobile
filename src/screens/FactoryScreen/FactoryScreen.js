import React, { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";
import { StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { Text, CustomHeader } from "../../components";
import { useNavigation } from "@react-navigation/native";
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ResourceOverviewHeader />
        <View style={{}}>
          <MilestoneCard
            currentMilestone={currentMilestone}
            inventory={inventory}
            discoveredNodes={discoveredNodes}
            onPress={() => navigation.navigate("MilestonesScreen")}
          />
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("MapScreen")}
          >
            <Text style={styles.gridItemTitle}>World Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("BuildScreen")}
          >
            <Text style={styles.gridItemTitle}>Machine Builder</Text>
          </TouchableOpacity>

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
