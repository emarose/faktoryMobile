import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "../components/Themed";
import BasicResources from "../components/BasicResources";

export default function FactoryScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Factory</Text>

      <View style={styles.gridContainer}>
        {/* Full width row 1 */}
        <TouchableOpacity
          onPress={() => navigation.navigate("BasicResourcesScreen")}
        >
          <View style={[styles.gridItem, styles.fullRow]}>
            <BasicResources />
          </View>
        </TouchableOpacity>
        {/* Full width row 2 */}
        <View style={[styles.gridItem, styles.fullRow]}>
          <Text style={styles.gridItemText}>Milestones</Text>
        </View>
        {/* 2x2 Grid starts here (2 items per row) */}
        <View style={styles.gridItem}>
          <Text style={styles.gridItemText}>Machine Builder</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridItemText}>Built Machines</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridItemText}>Available Products</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.gridItemText}>Product builder</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "90%", // Slightly wider grid container for better spacing
  },
  gridItem: {
    backgroundColor: "#f0f0f0",
    padding: 15, // Slightly reduced padding for smaller items if needed
    marginBottom: 10,
    marginHorizontal: 5,
    width: "50%",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80, // Slightly reduced minHeight if items are smaller
  },
  fullRow: {
    width: "100%",
  },
  gridItemText: {
    fontSize: 16,
    textAlign: "center",
  },
});
