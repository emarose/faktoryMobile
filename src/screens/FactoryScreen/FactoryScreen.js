import React, { useContext } from "react";
import { GameContext } from "../../contexts/GameContext";
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
import { items } from "../../data/items";

export default function FactoryScreen() {
  const navigation = useNavigation();
  const { currentMilestone } = useContext(GameContext);

  return (
    <SafeAreaView style={styles.container}>
      <ResourceOverviewHeader />
      <View
        style={{
          width: "100%",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          style={[
            styles.gridItem,
            {
              width: "98%",
              borderLeftWidth: 6,
              borderLeftColor: "#a0d911",
              backgroundColor: "#23233a",
              alignItems: "flex-start",
              paddingHorizontal: 20,
              paddingVertical: 16,
              marginBottom: 4,
              elevation: 2,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
          ]}
          onPress={() => navigation.navigate("MilestonesScreen")}
        >
          <Text
            style={{ color: "#a0d911", fontSize: 22, fontWeight: "bold", marginBottom: 2 }}
          >
            Milestones
          </Text>
          {currentMilestone && !currentMilestone.unlocked ? (
            <>
              <Text
                style={{ fontSize: 18, color: "#fff", fontWeight: "bold", marginBottom: 2 }}
              >
                {currentMilestone.name}
              </Text>
              <Text style={{ color: "#bfbfbf", marginBottom: 6 }}>
                {currentMilestone.description}
              </Text>
              {currentMilestone.requirements &&
                Object.keys(currentMilestone.requirements).length > 0 && (
                  <View style={{ marginTop: 8, backgroundColor: "#1a1a2a", borderRadius: 8, padding: 10, width: "100%" }}>
                    <Text
                      style={{ fontSize: 15, color: "#a0d911", fontWeight: "bold", marginBottom: 4 }}
                    >
                      Requirements:
                    </Text>
                    {Object.entries(currentMilestone.requirements).map(
                      ([req, val]) => {
                        // Show checkmark if requirement is met (for demo, always false; replace with real logic if available)
                        const met = false; // TODO: Replace with real check if you have inventory context
                        return (
                          <View key={req} style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                            <Text
                              style={{ color: met ? "#a0d911" : "#ffd700", fontSize: 14, marginRight: 6 }}
                            >
                              {met ? "✔ " : "• "}
                              {items[req]?.name || req}: {val} {req === "discoveredNodes" ? "(nodes)" : ""}
                            </Text>
                          </View>
                        );
                      }
                    )}
                  </View>
                )}
            </>
          ) : (
            <Text style={{ color: "#bfbfbf" }}>
              All milestones completed!
            </Text>
          )}
        </TouchableOpacity>
      </View>

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
         {/*  <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("MilestonesScreen")}
          >
            <Text style={styles.gridItemTitle}>Milestones</Text>
            {currentMilestone && !currentMilestone.unlocked ? (
              <>
                <Text
                  style={[
                    styles.gridItemTitle,
                    { fontSize: 16, color: "#a0d911" },
                  ]}
                >
                  {currentMilestone.name}
                </Text>
                <Text style={styles.gridItemDescription}>
                  {currentMilestone.description}
                </Text>
              </>
            ) : (
              <Text style={styles.gridItemDescription}>
                All milestones completed!
              </Text>
            )}
          </TouchableOpacity> */}

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
