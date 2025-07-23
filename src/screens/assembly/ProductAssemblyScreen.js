// screens/ProductAssemblyScreen.js
import React, { useMemo, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGame } from "../../contexts/GameContext";
import { items } from "../../data/items"; // Still needed to get machine names/definitions
import MachineGridItem from "../../components/MachineGridItem/MachineGridItem";
import MachineRecipeModal from "../../components/MachineRecipeModal/MachineRecipeModal";
import styles from "./styles"; // Assuming your styles are in a separate file

const ProductAssemblyScreen = () => {
  // Destructure everything you need from useGame
  const { inventory, craftItem, ownedMachines } = useGame(); // ownedMachines is correctly destructured
  console.log("🚀 ~ ProductAssemblyScreen ~ ownedMachines:", ownedMachines)

  // State for modal visibility and the currently selected machine
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMachineType, setSelectedMachineType] = useState(null);

  // Get unique machine types present in the player's ownedMachines list
  const ownedCraftingMachineTypes = useMemo(() => {
    // ownedMachines is an array of IDs like ["smelter", "constructor"]
    // We only want unique machine types. Since `ownedMachines` should already contain unique IDs,
    // we can just map these to their full definitions if needed, or use them directly.
    // The previous logic was trying to filter by counting machines in 'inventory'
    // but ownedMachines is the direct list.

    // If you only want to show unique *types* of machines (e.g., if you own 2 smelters, only show "Smelter" once)
    // then a Set is still useful.
    const uniqueOwnedMachineTypes = new Set(ownedMachines);

    // You might want to filter this list to only include machines that actually have recipes defined for them
    // (though your modal already does this, so it's optional here).
    // For now, let's just return the unique list of machine IDs.
    return Array.from(uniqueOwnedMachineTypes);
  }, [ownedMachines]); // This now correctly depends only on ownedMachines

  const handleMachinePress = (machineId) => {
    setSelectedMachineType(machineId);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedMachineType(null); // Clear selected machine when modal closes
  };

  // Helper to get the display name for the MachineGridItem
  // This helps ensure `MachineGridItem` can render a proper name from the ID
  const getMachineDisplayName = (machineId) => {
    return items[machineId]?.name || machineId; // Fallback to ID if name not found
  };

  const renderMachineGridItem = ({ item }) => (
    <MachineGridItem
      // Pass the actual machine ID, and its display name
      machineId={item} // item is the machineType ID (e.g., 'smelter')
      machineName={getMachineDisplayName(item)} // Pass the display name
      onPress={handleMachinePress}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Product Assembly</Text>

      {ownedCraftingMachineTypes.length > 0 ? (
        <FlatList
          data={ownedCraftingMachineTypes}
          renderItem={renderMachineGridItem}
          keyExtractor={(item) => item} // The item itself is the unique ID
          numColumns={2} // Display items in 2 columns
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <Text style={styles.noMachinesText}>
          You don't have any crafting machines in your inventory yet. Build some
          from the "Build" screen!
        </Text>
      )}

      {/* The Machine Recipe Modal */}
      <MachineRecipeModal
        isVisible={isModalVisible}
        onClose={handleModalClose} // Use the dedicated close handler
        machineType={selectedMachineType}
        inventory={{ items: inventory, ownedMachines: ownedMachines }} // Pass both items and ownedMachines
        craftItem={craftItem}
      />
    </SafeAreaView>
  );
};

export default ProductAssemblyScreen;
