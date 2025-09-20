import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
    handleMachineSelect,
    machineRecipes
  } = useProgressionTree();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Filter recipes based on search query
  const filteredRecipes = useMemo(() => {
    if (!selectedMachine || !searchQuery.trim()) {
      return selectedMachine?.recipes || [];
    }

    const query = searchQuery.toLowerCase().trim();
    return selectedMachine.recipes.filter(recipe => {
      // Search in recipe name
      if (recipe.name.toLowerCase().includes(query)) return true;
      
      // Search in input materials
      const hasInputMatch = recipe.inputs.some(input => 
        input.name.toLowerCase().includes(query)
      );
      if (hasInputMatch) return true;
      
      // Search in output products
      const hasOutputMatch = recipe.outputs.some(output => 
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
    return machineList.filter(machine => {
      const machineData = machineRecipes[machine.id];
      
      // Search in machine name
      if (machine.name.toLowerCase().includes(query)) return true;
      
      // Search in any recipes for this machine
      return machineData.recipes.some(recipe => {
        return recipe.name.toLowerCase().includes(query) ||
               recipe.inputs.some(input => input.name.toLowerCase().includes(query)) ||
               recipe.outputs.some(output => output.name.toLowerCase().includes(query));
      });
    });
  }, [machineList, machineRecipes, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearch(false);
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        {showSearch ? (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes, materials, products..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerControls}>
            <Text style={styles.screenTitle}>Assembly Recipes</Text>
            <TouchableOpacity style={styles.searchButton} onPress={() => setShowSearch(true)}>
              <Text style={styles.searchButtonText}>🔍</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Search Results Summary */}
      {searchQuery.trim() && (
        <View style={styles.searchSummary}>
          <Text style={styles.searchSummaryText}>
            Found {filteredRecipes.length} recipes in {filteredMachineList.length} machines
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
                : "No recipes available for this machine."
              }
            </Text>
            {searchQuery.trim() && (
              <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
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
