import React from "react";
import {
  View,
  Text,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styles from "./styles";

// Import componentized subcomponents
import RecipeCard from "./components/RecipeCard";
import MachineTab from "./components/MachineTab";

// Import custom hooks
import { useProgressionTree } from "./hooks";

// Main component with tabbed machine recipes
const ProgressionTree = () => {
  const {
    machineList,
    selectedMachineId,
    selectedMachine,
    handleMachineSelect
  } = useProgressionTree();

  return (
    <View style={styles.container}>
      {/* Machine Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {machineList.map((machine) => (
            <MachineTab
              key={machine.id}
              machine={machine}
              isSelected={selectedMachineId === machine.id}
              onPress={handleMachineSelect}
            />
          ))}
        </ScrollView>
      </View>

      {/* Machine Header */}
      {selectedMachine && (
        <View
          style={[
            styles.machineHeader,
            { backgroundColor: `${selectedMachine.color}33` },
          ]}
        >
          <Text style={styles.machineTitle}>{selectedMachine.name}</Text>
          <Text style={styles.machineDescription}>
            {selectedMachine.description}
          </Text>
          
          {/* Machine Requirements */}
          {selectedMachine.recipes.length > 0 && selectedMachine.recipes[0].inputs.length > 0 && (
            <View style={styles.machineRequirements}>
              <Text style={styles.machineRequirementsTitle}>Machine Requirements:</Text>
              <View style={styles.machineRequirementsItems}>
                {selectedMachine.recipes[0].inputs.map((input) => (
                  <View key={input.id} style={styles.requiredItemChip}>
                    <View
                      style={[
                        styles.itemColorIndicator,
                        { backgroundColor: input.color },
                      ]}
                    />
                    <Text style={styles.requiredItemName}>{input.name}</Text>
                    <Text style={styles.requiredItemQuantity}>× {input.quantity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Recipe List */}
      <ScrollView style={styles.recipesContainer}>
        {selectedMachine?.recipes.length > 0 ? (
          selectedMachine.recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              machineColor={selectedMachine.color}
              machineName={selectedMachine.name}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No recipes available for this machine.
            </Text>
          </View>
        )}

        {/* Add some padding at the bottom for better scrolling */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

export default ProgressionTree;
