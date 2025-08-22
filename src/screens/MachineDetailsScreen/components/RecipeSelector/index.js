import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "../../styles";

const RecipeSelector = ({ availableRecipes, selectedRecipeId, setSelectedRecipeId }) => {
  return (
    <View>
      <Text style={styles.detailsText}>Select Recipe:</Text>
      <Picker
        selectedValue={selectedRecipeId}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedRecipeId(itemValue)}
      >
        {availableRecipes.map((recipe) => (
          <Picker.Item
            key={recipe.id}
            label={recipe.name}
            value={recipe.id}
          />
        ))}
      </Picker>
    </View>
  );
};

export default RecipeSelector;