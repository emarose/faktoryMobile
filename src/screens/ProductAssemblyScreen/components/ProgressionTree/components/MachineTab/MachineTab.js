import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Colors from "../../../../../../constants/Colors";
import styles from "./styles";
import { GameAssets } from "../../../../../../components/AppLoader";

/**
 * Machine Tab component for the tab navigation
 * @param {Object} machine - The machine data
 * @param {boolean} isSelected - Whether this machine is currently selected
 * @param {Function} onPress - Function to call when tab is pressed
 */
const MachineTab = ({ machine, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.machineTab,
        {
          backgroundColor: isSelected ? machine.color : `${machine.color}33`,
          borderColor: machine.color,
        },
      ]}
      onPress={() => onPress(machine.id)}
    >
      {GameAssets.icons[machine.id] && (
        <Image
          source={GameAssets.icons[machine.id]}
          style={styles.machineIcon}
        />
      )}
      <Text
        style={[
          styles.machineTabText,
          { color: isSelected ? Colors.textPrimary : Colors.textSecondary },
        ]}
      >
        {machine.name}
      </Text>
      {machine.recipeCount > 0 && (
        <View
          style={[
            styles.recipeCounter,
            {
              backgroundColor: isSelected ? Colors.textPrimary : machine.color,
            },
          ]}
        >
          <Text
            style={[
              styles.recipeCounterText,
              { color: isSelected ? machine.color : Colors.textPrimary },
            ]}
          >
            {machine.recipeCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default MachineTab;
