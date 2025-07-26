import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image, // For future item icons
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import styles from "./styles";

const InventoryScreen = () => {
  const { inventory } = useGame();

  // Filter out raw materials and machines, keep only intermediate and final products
  // Also, only include items you actually possess (currentAmount > 0)
  const ownedCraftedItems = Object.values(inventory)
    .filter((item) => {
      const itemData = items[item.id]; // Get full item data from your JSON
      return (
        item.currentAmount > 0 &&
        itemData &&
        (itemData.type === "intermediateProduct" ||
          itemData.type === "finalProduct")
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Crafted Items</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {ownedCraftedItems.length > 0 ? (
          <View style={styles.inventoryGrid}>
            {ownedCraftedItems.map((item) => {
              // Get item details like description from rawGameData
              const itemDetails = items[item.id] || {};

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => {
                    // Optional: You can navigate to an item detail screen here
                    // For now, let's just log or show a simple alert
                    console.log(
                      `Tapped on ${item.name}. Description: ${itemDetails.description}`
                    );
                    // Example with Alert (remember to import Alert from 'react-native')
                    // Alert.alert(item.name, itemDetails.description || "No description available.");
                  }}
                >
                  {/* Item Icon or Placeholder */}
                  <View style={styles.iconContainer}>
                    {/* Replace with Image component if you have actual icons */}
                    {/* <Image source={itemDetails.icon} style={styles.itemIcon} /> */}
                    <Text style={styles.iconText}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  {/* Item Name (below icon) */}
                  <Text style={styles.itemName}>{item.name}</Text>

                  {/* Amount Overlay (Minecraft-style, bottom right of icon) */}
                  <View style={styles.amountOverlay}>
                    <Text style={styles.itemAmount}>
                      {Math.floor(item.currentAmount)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyInventoryText}>
            Your inventory of crafted items is empty. Start building and
            crafting!
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InventoryScreen;
