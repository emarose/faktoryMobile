import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { IconContainer } from "../../../../../../components";
import styles from "./styles";

const RecipeCard = ({ recipe, machineColor, machineName }) => {

  let inputsToRender = Array.isArray(recipe.inputs) ? [...recipe.inputs] : [];

  if (Array.isArray(recipe.outputs)) {

    if (recipe.outputs.length === 1 && recipe.outputs[0].nodeInfo) {
      const output = recipe.outputs[0];
      const nodeId = `${output.id}_node`;
      inputsToRender = [
        {
          id: nodeId,
          name: `${output.name} node`,
          quantity: 1,
        },
      ];
    }
  }

  return (
    <Animated.View
      style={[styles.recipeCard, { borderColor: machineColor }]}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <View style={styles.recipeHeader}>
        <View style={styles.recipeTitleContainer}>
          {recipe.id ? (
            <IconContainer 
              iconId={recipe.id}
              size={32}
              iconSize={24}
              style={styles.recipeTitleIconContainer}
            />
          ) : recipe.outputs && recipe.outputs.length > 0 ? (
            <IconContainer 
              iconId={recipe.outputs[0].id}
              size={32}
              iconSize={24}
              style={styles.recipeTitleIconContainer}
            />
          ) : null}
          <Text style={styles.recipeTitle}>{recipe.name}</Text>
        </View>
      </View>

      <View style={styles.recipeContent}>
        {/* Standard recipe layout: Inputs -> Arrow -> Outputs */}
        <>
          {/* Inputs */}
          <View style={styles.recipeInputs}>
            {inputsToRender.map((input) => (
              <View key={input.id} style={styles.recipeItem}>
                <IconContainer
                  iconId={input.id}
                  size={40}
                  iconSize={32}
                />
                <Text style={styles.itemName}>{input.name}</Text>
                <Text style={styles.itemQuantity}>× {input.quantity}</Text>
              </View>
            ))}
          </View>

          {/* Arrow */}
          <View style={styles.recipeArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>

          {/* Outputs */}
          <View style={styles.recipeOutputs}>
            {recipe.outputs.map((output) => (
              <View key={output.id} style={styles.recipeItem}>
                <IconContainer
                  iconId={output.id}
                  size={32}
                  iconSize={24}
                  style={output.color ? { backgroundColor: output.color } : styles.itemIconContainer}
                />
                <Text style={styles.itemName}>{output.name}</Text>
                <Text style={styles.itemQuantity}>× {output.quantity}</Text>
              </View>
            ))}
          </View>
        </>
      </View>
    </Animated.View>
  );
};

export default RecipeCard;
