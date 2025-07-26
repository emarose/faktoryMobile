import { useMemo, useState } from "react";
import { Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGame } from "../../contexts/GameContext";
import { items } from "../../data/items";
import MachineRecipeModal from "./components/MachineRecipeModal/MachineRecipeModal";
import styles from "./styles";
import MachineGridItem from "./components/MachineGridItem/MachineGridItem";

const ProductAssemblyScreen = () => {
  const { inventory, craftItem, ownedMachines } = useGame();

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
          keyExtractor={(item) => item} 
          numColumns={2}
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
        onClose={handleModalClose} 
        machineType={selectedMachineType}
        inventory={{ items: inventory, ownedMachines: ownedMachines }}
        craftItem={craftItem}
      />
    </SafeAreaView>
  );
};

export default ProductAssemblyScreen;
