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
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import ResourceOverviewHeader from "./components/ResourceOverviewHeader/ResourceOverviewHeader";

export default function FactoryScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ResourceOverviewHeader />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("InventoryScreen")}
          >
            <Text style={styles.gridItemTitle}>Full Inventory</Text>
            <Text style={styles.gridItemDescription}>
              View all your collected items
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("DeployedMachinesScreen")}
          >
            <Text style={styles.gridItemTitle}>Deployed Machines</Text>
            <Text style={styles.gridItemDescription}>
              Monitor & upgrade your factory machines
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Progression & Products</Text>
        <View style={styles.gridContainer}>
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
