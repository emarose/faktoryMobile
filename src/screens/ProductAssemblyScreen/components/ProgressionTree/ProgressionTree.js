import React, { useState, useMemo, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "../../../../components";
import styles from "./styles";
import Colors from "../../../../constants/Colors";
import { GameAssets } from "../../../../components/AppLoader";

// Import componentized subcomponents
import RecipeCard from "./components/RecipeCard";
import MachineTab from "./components/MachineTab";

// Import custom hooks
import { useProgressionTree } from "./hooks";

// Main component with tabbed machine recipes
const ProgressionTree = ({ searchVisible = false }) => {
  const {
    machineList,
    selectedMachineId,
    selectedMachine,
    handleMachineSelect,
    machineRecipes,
    autoSelectMachineWithResults,
  } = useProgressionTree();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!selectedMachine || !searchQuery.trim()) {
      return selectedMachine?.recipes || [];
    }

    const query = searchQuery.toLowerCase().trim();
    return selectedMachine.recipes.filter((recipe) => {
      // Search in recipe name
      if (recipe.name.toLowerCase().includes(query)) return true;

      // Search in input materials
      const hasInputMatch = recipe.inputs.some((input) =>
        input.name.toLowerCase().includes(query)
      );
      if (hasInputMatch) return true;

      // Search in output products
      const hasOutputMatch = recipe.outputs.some((output) =>
        output.name.toLowerCase().includes(query)
      );
      if (hasOutputMatch) return true;

      return false;
    });
  }, [selectedMachine, searchQuery]);

  // Also filter machines that have matching recipes
  const filteredMachineList = useMemo(() => {
    if (!searchQuery.trim()) {
      return machineList;
    }

    const query = searchQuery.toLowerCase().trim();
    return machineList.filter((machine) => {
      const machineData = machineRecipes[machine.id];

      // Search in machine name
      if (machine.name.toLowerCase().includes(query)) return true;

      // Search in any recipes for this machine
      return machineData.recipes.some((recipe) => {
        return (
          recipe.name.toLowerCase().includes(query) ||
          recipe.inputs.some((input) =>
            input.name.toLowerCase().includes(query)
          ) ||
          recipe.outputs.some((output) =>
            output.name.toLowerCase().includes(query)
          )
        );
      });
    });
  }, [machineList, machineRecipes, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  // Auto-select first machine with results when searching
  useEffect(() => {
    if (searchQuery.trim() && filteredMachineList.length > 0) {
      autoSelectMachineWithResults(filteredMachineList);
    }
  }, [searchQuery, filteredMachineList, autoSelectMachineWithResults]);

  return (
    <View style={styles.container}>
      {searchVisible && (
        <View style={styles.searchHeader}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes or materials..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Search Results Summary */}
      {searchQuery.trim() && (
        <View style={styles.searchSummary}>
          <Text style={styles.searchSummaryText}>
            {filteredMachineList.length === 0
              ? `No results found for "${searchQuery}"`
              : `Found ${filteredRecipes.length} recipe${
                  filteredRecipes.length !== 1 ? "s" : ""
                } in ${filteredMachineList.length} machine${
                  filteredMachineList.length !== 1 ? "s" : ""
                }`}
          </Text>
        </View>
      )}

      {/* Machine Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {filteredMachineList.map((machine) => (
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
        <View style={styles.machineHeader}>
          <Text style={styles.machineTitle}>{selectedMachine.name}</Text>
          <Text style={styles.machineDescription}>
            {selectedMachine.description}
          </Text>

          {/* Machine Requirements */}
          {selectedMachine.recipes.length > 0 &&
            selectedMachine.recipes[0].inputs.length > 0 && (
              <View style={styles.machineRequirements}>
                <Text style={styles.machineRequirementsTitle}>
                  Machine Requirements:
                </Text>
                <View style={styles.machineRequirementsItems}>
                  {selectedMachine.recipes[0].inputs.map((input) => (
                    <View key={input.id} style={styles.requiredItemChip}>
                      {GameAssets.icons[input.id] ? (
                        <Image
                          source={GameAssets.icons[input.id]}
                          style={styles.requiredItemIcon}
                        />
                      ) : (
                        <View
                          style={[
                            styles.itemColorIndicator,
                            {
                              backgroundColor: input.color || Colors.accentBlue,
                            },
                          ]}
                        />
                      )}
                      <Text style={styles.requiredItemName}>{input.name}</Text>
                      <Text style={styles.requiredItemQuantity}>
                        × {input.quantity}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
        </View>
      )}

      {/* Recipe List */}
      <ScrollView style={styles.recipesContainer}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
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
              {searchQuery.trim()
                ? `No recipes found for "${searchQuery}"`
                : "No recipes available for this machine."}
            </Text>
            {searchQuery.trim() && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearSearchButtonText}>Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Add some padding at the bottom for better scrolling */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

export default ProgressionTree;
