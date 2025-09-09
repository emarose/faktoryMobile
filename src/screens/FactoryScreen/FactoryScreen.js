import React, { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";
import milestones from "../../data/milestones";
import { StyleSheet, TouchableOpacity, ScrollView, View } from "react-native";
import { Text } from "../../components";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";
import ResourceOverviewHeader from "./components/ResourceOverviewHeader/ResourceOverviewHeader";
import { items } from "../../data/items";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function FactoryScreen() {
  const navigation = useNavigation();
  const { currentMilestone } = useContext(GameContext);
  // Busca el milestone completo para acceder a requirementsDescription
  const milestoneFull = currentMilestone
    ? milestones.find((m) => m.id === currentMilestone.id)
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ResourceOverviewHeader />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={{}}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("MilestonesScreen")}
          >
            <MaterialCommunityIcons name="star" size={28} />
            {currentMilestone && !currentMilestone.unlocked ? (
              <>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#fff",
                    fontWeight: "bold",
                    marginBottom: 2,
                  }}
                >
                  {currentMilestone.name}
                </Text>
                {milestoneFull?.requirementsDescription && (
                  <Text
                    style={{ color: "#ffd700", marginBottom: 6, fontSize: 15 }}
                  >
                    {milestoneFull.requirementsDescription}
                  </Text>
                )}
              </>
            ) : (
              <Text style={{ color: "#bfbfbf" }}>
                All milestones completed!
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("BuildScreen")}
          >
            <Text style={styles.gridItemTitle}>Build Machines</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("MapScreen")}
          >
            <Text style={styles.gridItemTitle}>World Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("DeployedMachinesScreen")}
          >
            <Text style={styles.gridItemTitle}>Deployed Machines</Text>
          </TouchableOpacity>

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
