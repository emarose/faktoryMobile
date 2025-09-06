import { useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGame } from "../../contexts/GameContext";
import { items } from "../../data/items";
import MachineRecipeModal from "./components/MachineRecipeModal/MachineRecipeModal";
import styles from "./styles";
import MachineGridItem from "./components/MachineGridItem/MachineGridItem";
import ProgressionTree from "./components/ProgressionTree/ProgressionTree";

const ProductAssemblyScreen = () => {
  const { inventory, craftItem, ownedMachines, assignRecipeToMachine } =
    useGame();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMachineType, setSelectedMachineType] = useState(null);
  const [selectedMachineId, setSelectedMachineId] = useState(null);

  const ownedCraftingMachineTypes = useMemo(() => {
    // Filter only machine objects of type 'machine'
    return ownedMachines.filter(
      (machine) =>
        inventory[machine.type] && inventory[machine.type].type === "machine"
    );
  }, [ownedMachines, inventory]);

  const handleMachinePress = (machineId) => {
    setSelectedMachineId(machineId);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedMachineId(null);
  };

  const getMachineDisplayName = (machineId) => {
    return items[machineId]?.name || machineId;
  };

  const renderMachineGridItem = ({ item }) => (
    <MachineGridItem
      machineId={item.id}
      machineType={item.type}
      machineName={getMachineDisplayName(item.type)}
      currentRecipeId={item.currentRecipeId}
      onPress={() => handleMachinePress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ProgressionTree />
      {/* 
      {ownedCraftingMachineTypes.length > 0 ? (
        <FlatList
          data={ownedCraftingMachineTypes}
          renderItem={renderMachineGridItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <Text style={styles.noMachinesText}>
          You don't have any crafting machines in your inventory yet. Build some
          from the "Build" screen!
        </Text>
      )}
 */}
      {/* The Machine Recipe Modal */}
     {/*  <MachineRecipeModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
        machineId={selectedMachineId}
        ownedMachines={ownedMachines}
        assignRecipeToMachine={assignRecipeToMachine}
        inventory={inventory}
        craftItem={craftItem}
      /> */}
    </SafeAreaView>
  );
};

export default ProductAssemblyScreen;
