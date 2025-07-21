// screens/FactoryScreen.js (Updated)
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import ResourceOverviewHeader from "../components/ResourceOverviewHeader/ResourceOverviewHeader"; // Assuming this path is correct
import { SafeAreaView } from "react-native-safe-area-context";

export default function FactoryScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Resource Overview Header (at the very top) */}
      <ResourceOverviewHeader />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Removed "Current Resources" section as it's redundant with the header */}
        {/* --- Section 1: Core Production & Management --- */}
        <Text style={styles.sectionTitle}>Production & Construction</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("BuildScreen")}
          >
            <Text style={styles.gridItemTitle}>Build Machines</Text>
            <Text style={styles.gridItemDescription}>
              Craft Smelters, Miners & more
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("MapScreen")}
          >
            <Text style={styles.gridItemTitle}>World Map</Text>
            <Text style={styles.gridItemDescription}>
              Place machines on resource nodes
            </Text>
          </TouchableOpacity>

          {/* Dedicated Inventory Button */}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("InventoryScreen")} // Navigate to the new InventoryScreen
          >
            <Text style={styles.gridItemTitle}>Full Inventory</Text>
            <Text style={styles.gridItemDescription}>
              View all your collected items
            </Text>
          </TouchableOpacity>

          {/* Future: Machine Management (what was "Built Machines" & "Machine Builder" ideas) */}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => alert("Coming Soon: Manage your deployed machines!")}
          >
            <Text style={styles.gridItemTitle}>Deployed Machines</Text>
            <Text style={styles.gridItemDescription}>
              Monitor & upgrade your factory
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- Section 2: Progression & Research (Milestones, Products) --- */}
        <Text style={styles.sectionTitle}>Progression & Products</Text>
        <View style={styles.gridContainer}>
          {/* Milestones */}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() =>
              alert("Coming Soon: Track your progress & unlock new tech!")
            }
          >
            <Text style={styles.gridItemTitle}>Milestones</Text>
            <Text style={styles.gridItemDescription}>
              Unlock new items and tech
            </Text>
          </TouchableOpacity>

          {/* Product Builder / Available Products */}
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("ProductAssemblyScreen")}
          >
            <Text style={styles.gridItemTitle}>Product Assembly</Text>
            <Text style={styles.gridItemDescription}>
              Combine parts into finished goods
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#1a1a2e",
    paddingTop: 0, // No specific padding from this screen, header handles it
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#a0d911",
    marginTop: 25,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#4a4a6e",
    paddingBottom: 5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  gridItem: {
    width: "48%", // Roughly half width, allowing for spacing
    backgroundColor: "#2a2a4a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4a4a6e",
  },
  gridItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f0f0f0",
    textAlign: "center",
    marginBottom: 5,
  },
  gridItemDescription: {
    fontSize: 12,
    color: "#cccccc",
    textAlign: "center",
  },
});
