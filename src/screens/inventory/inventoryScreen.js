// screens/InventoryScreen.js (Reworked to Minecraft-like Grid)
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity, // Keep if you want items to be clickable
  Image, // For future item icons
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGame } from '../../contexts/GameContext'; // Adjust path
// import { items } from '../../data/items'; // You might need this for item details/icons if not in inventory object

const InventoryScreen = () => {
  const { inventory } = useGame();

  // Filter for items the player actually possesses (amount > 0)
  // And sort them for consistent display, e.g., by name
  const ownedInventoryItems = Object.values(inventory)
    .filter(item => item.currentAmount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Inventory</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {ownedInventoryItems.length > 0 ? (
          <View style={styles.inventoryGrid}>
            {ownedInventoryItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={() => {
                  // Optional: Add a press handler for item details
                  // Alert.alert(item.name, item.description || "No description.");
                }}
              >
                {/* Placeholder for Item Icon */}
                <View style={styles.iconPlaceholder}>
                  {/* You can replace this with an actual Image component:
                  <Image source={item.icon} style={styles.itemIcon} />
                  Make sure your 'items' data in GameContext provides an 'icon' property. */}
                  <Text style={styles.iconText}>{item.name}</Text>
                </View>

                {/* Amount on top of/next to icon, Minecraft style */}
                <Text style={styles.itemAmount}>{Math.floor(item.currentAmount)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyInventoryText}>Your inventory is empty. Start mining!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a2e', // Dark background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e0e0e0', // Light text for titles
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center', // Center grid horizontally
    paddingBottom: 20,
  },
  inventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center items in the grid
    width: '100%', // Ensure it takes available width
    maxWidth: 400, // Optional: Limit max width for grid on larger screens
  },
  gridItem: {
    width: 80, // Size of each grid slot
    height: 80,
    margin: 5, // Spacing between items
    backgroundColor: '#2a2a4a', // Item slot background
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4a4a6e',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // For absolute positioning of amount
  },
  iconPlaceholder: {
    width: 60, // Icon size within the slot
    height: 60,
    backgroundColor: '#5a5a7e', // Placeholder color
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#e0e0e0',
    fontSize: 16, // Larger initial for placeholder
    fontWeight: 'bold',
  },
  // If you use actual images:
  // itemIcon: {
  //   width: 60,
  //   height: 60,
  //   resizeMode: 'contain',
  // },
  itemAmount: {
    position: 'absolute', // Position amount over the icon
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background for readability
    color: '#a0d911', // Green for amount
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  emptyInventoryText: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default InventoryScreen;