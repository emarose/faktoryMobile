import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGame } from "../../contexts/GameContext";
import styles from "./styles";

const BuildScreen = () => {
  const { buildableItems, buildItem, inventory, ownedMachines } = useGame();

  const handleBuild = (itemId) => {
    const itemToBuild = buildableItems.find((item) => item.id === itemId);
    const success = buildItem(itemId);
    
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Build Machines</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {buildableItems.length > 0 ? (
          buildableItems.map((item) => (
            <View key={item.id} style={styles.buildCard}>
              <View style={styles.itemHeader}>
                {item.icon ? (
                  <Image source={item.icon} style={styles.itemIcon} />
                ) : (
                  <View style={styles.iconPlaceholder}>
                    <Text style={styles.iconText}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>

              <Text style={styles.requirementsTitle}>Requires:</Text>
              {Object.keys(item.inputs || {}).length > 0 ? (
                Object.entries(item.inputs || {}).map(
                  ([inputId, requiredAmount]) => (
                    <Text key={inputId} style={styles.requirementText}>
                      - {inventory[inputId]?.name || inputId}: {requiredAmount}{" "}
                      <Text
                        style={{ color: item.canBuild ? "#a0d911" : "#ff6347" }}
                      >
                        ({Math.floor(inventory[inputId]?.currentAmount || 0)} /{" "}
                        {requiredAmount})
                      </Text>
                      {item.missingResources[inputId] ? (
                        <Text style={styles.missingText}>
                          {" "}
                          (Need {Math.ceil(item.missingResources[inputId])})
                        </Text>
                      ) : null}
                    </Text>
                  )
                )
              ) : (
                <Text style={styles.requirementText}>
                  No resources required!
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.buildButton,
                  !item.canBuild && styles.buildButtonDisabled,
                ]}
                onPress={() => handleBuild(item.id)}
                disabled={!item.canBuild}
              >
                <Text style={styles.buildButtonText}>
                  {item.canBuild
                    ? `Build ${item.name}`
                    : "Not Enough Resources"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noItemsText}>
            No buildable machines available yet.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BuildScreen;
