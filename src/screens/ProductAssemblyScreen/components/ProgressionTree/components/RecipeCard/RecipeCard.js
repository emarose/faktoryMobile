import React from "react";
import { View, Text, Image } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Colors from "../../../../../../constants/Colors";
import styles from "./styles";
// Global assets
import { GameAssets } from "../../../../../../components/AppLoader";

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
          {GameAssets.icons && GameAssets.icons[recipe.id] ? (
            <Image 
              source={GameAssets.icons[recipe.id]} 
              style={styles.recipeTitleIcon} 
            />
          ) : recipe.outputs && recipe.outputs.length > 0 && GameAssets.icons[recipe.outputs[0].id] ? (
            <Image 
              source={GameAssets.icons[recipe.outputs[0].id]} 
              style={styles.recipeTitleIcon} 
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
                      {GameAssets.icons[`${output.id}_node`] ? (
                        <Image 
                          source={GameAssets.icons[`${output.id}_node`]} 
                          style={styles.nodeIcon} 
                        />
                      ) : null}
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
                  {GameAssets.icons[input.id] ? (
                    <Image
                      source={GameAssets.icons[input.id]}
                      style={styles.itemIcon}
                    />
                  ) : (
                    <View
                      style={[
                        styles.itemColorIndicator,
                        { backgroundColor: input.color },
                      ]}
                    />
                  )}
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
                  {GameAssets.icons[output.id] ? (
                    <Image
                      source={GameAssets.icons[output.id]}
                      style={styles.itemIcon}
                    />
                  ) : (
                    <View
                      style={[
                        styles.itemColorIndicator,
                        { backgroundColor: output.color },
                      ]}
                    />
                  )}
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
