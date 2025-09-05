import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "../../../../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";

const RecipeSelector = ({ availableRecipes, selectedRecipeId, setSelectedRecipeId }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Select Recipe</Text>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.recipesScrollView}
        contentContainerStyle={styles.recipesContainer}
      >
        {availableRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={[
              styles.recipeCard,
              selectedRecipeId === recipe.id && styles.selectedRecipeCard
            ]}
            onPress={() => setSelectedRecipeId(recipe.id)}
            activeOpacity={0.8}
          >
            <View style={styles.recipeIconContainer}>
              <MaterialCommunityIcons 
                name={recipe.id.includes("metal") ? "anvil" : 
                      recipe.id.includes("circuit") ? "chip" : 
                      recipe.id.includes("plastic") ? "flask" : "factory"}
                size={20} 
                color={selectedRecipeId === recipe.id ? "#fff" : "#4CAF50"} 
              />
            </View>
            <Text 
              style={[
                styles.recipeText,
                selectedRecipeId === recipe.id && styles.selectedRecipeText
              ]}
              numberOfLines={2}
            >
              {recipe.name}
            </Text>
            {selectedRecipeId === recipe.id && (
              <View style={styles.selectedIndicator}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecipeSelector;