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

  const ownedCraftingMachineTypes = useMemo(() => {

    const uniqueOwnedMachineTypes = new Set(ownedMachines);


    return Array.from(uniqueOwnedMachineTypes);
  }, [ownedMachines]); 

  const handleMachinePress = (machineId) => {
    setSelectedMachineType(machineId);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedMachineType(null); 
  };

  const getMachineDisplayName = (machineId) => {
    return items[machineId]?.name || machineId;
  };

  const renderMachineGridItem = ({ item }) => (
    <MachineGridItem
      machineId={item} 
      machineName={getMachineDisplayName(item)} 
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
