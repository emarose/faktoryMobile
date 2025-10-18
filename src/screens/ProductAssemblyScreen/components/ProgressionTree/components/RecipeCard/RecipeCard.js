import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Colors from "../../../../../../constants/Colors";
import { IconContainer } from "../../../../../../components";
import styles from "./styles";

/**
 * Recipe card component to show a single recipe
 * @param {Object} recipe - The recipe data
 * @param {string} machineColor - The machine's color
 * @param {string} machineName - The machine's name
 */
const RecipeCard = ({ recipe, machineColor, machineName }) => {
  const isMiningMachine =
    machineName === "Miner" || machineName === "Oil Extractor";
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
              size={24}
              iconSize={20}
              style={styles.recipeTitleIconContainer}
            />
          ) : recipe.outputs && recipe.outputs.length > 0 ? (
            <IconContainer 
              iconId={recipe.outputs[0].id}
              size={24}
              iconSize={20}
              style={styles.recipeTitleIconContainer}
            />
          ) : null}
          <Text style={styles.recipeTitle}>{recipe.name}</Text>
        </View>
      </View>

      <View style={styles.recipeContent}>
        {isMiningMachine ? (
          // Special layout for miners and oil extractors
          <View style={styles.miningRecipeContent}>
            {recipe.outputs.map((output) => (
              <View key={output.id} style={styles.miningOutputItem}>
                {output.nodeInfo && (
                  <View style={[styles.nodeInfoContainer, { borderLeftColor: machineColor }]}>
                    <View style={styles.nodeInfoHeader}>
                      <IconContainer 
                        iconId={`${output.id}_node`}
                        size={24}
                        iconSize={20}
                        style={styles.nodeIconContainer}
                      />
                      <Text style={styles.nodeInfoDescription}>
                        "{output.nodeInfo.description}"
                      </Text>
                    </View>
                    <View style={styles.nodeInfoDetails}>
                      <View style={styles.nodeInfoTagContainer}>
                        <Text
                          style={[
                            styles.nodeInfoTag,
                            {
                              backgroundColor: output.nodeInfo.manualMineable
                                ? Colors.accentGreen
                                : Colors.backgroundSecondary,
                            },
                          ]}
                        >
                          {output.nodeInfo.manualMineable
                            ? "Manually Mineable"
                            : "Machine Required"}
                        </Text>
                      </View>
                      <Text style={styles.nodeInfoText}>
                        Processing time: {output.nodeInfo.processingTime}s
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          // Standard recipe layout for other machines
          <>
            {/* Inputs */}
            <View style={styles.recipeInputs}>
              {recipe.inputs.map((input) => (
                <View key={input.id} style={styles.recipeItem}>
                  <IconContainer 
                    iconId={input.id}
                    size={24}
                    iconSize={20}
                    style={input.color ? { backgroundColor: input.color } : styles.itemIconContainer}
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
                    size={24}
                    iconSize={20}
                    style={output.color ? { backgroundColor: output.color } : styles.itemIconContainer}
                  />
                  <Text style={styles.itemName}>{output.name}</Text>
                  <Text style={styles.itemQuantity}>× {output.quantity}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </Animated.View>
  );
};

export default RecipeCard;
