// screens/BuildScreen.js
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

const BuildScreen = () => {
  const { buildableItems, buildItem, inventory, ownedMachines } = useGame();
  console.log("🚀 ~ BuildScreen ~ ownedMachines:", ownedMachines);

  const handleBuild = (itemId) => {
    // We can get the item name from buildableItems array directly
    const itemToBuild = buildableItems.find((item) => item.id === itemId);
    const success = buildItem(itemId);
    if (success) {
      Alert.alert(
        "Success!",
        `${itemToBuild?.name} has been built and added to your inventory!`
      );
    } else {
      Alert.alert(
        "Cannot Build",
        "You don't have enough resources for this item."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Build Machines & Components</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {buildableItems.length > 0 ? (
          buildableItems.map((item) => (
            <View key={item.id} style={styles.buildCard}>
              <View style={styles.itemHeader}>
                {/* Ensure the icon path is correctly handled as a require() in items.js */}
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
              {/* Ensure item.inputs is always an object, even if empty */}
              {Object.keys(item.inputs || {}).length > 0 ? (
                Object.entries(item.inputs || {}).map(
                  ([inputId, requiredAmount]) => (
                    <Text key={inputId} style={styles.requirementText}>
                      {/* Access item name from `item` object provided by buildableItems, or inventory if needed. */}
                      {/* For items from `items.js`, GameContext already initialized their names in inventory */}
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
            No buildable items available yet.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1a1a2e",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e0e0e0",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  buildCard: {
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#4a4a6e",
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#5a5a7e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  iconText: {
    color: "#e0e0e0",
    fontSize: 20,
    fontWeight: "bold",
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a0d911",
  },
  itemDescription: {
    fontSize: 14,
    color: "#cccccc",
    marginBottom: 10,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 5,
  },
  requirementText: {
    fontSize: 14,
    color: "#cccccc",
    marginLeft: 10,
    marginBottom: 3,
  },
  missingText: {
    color: "#ffc107",
    fontStyle: "italic",
    fontSize: 13,
  },
  buildButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  buildButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  buildButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noItemsText: {
    fontSize: 16,
    color: "#aaaaaa",
    textAlign: "center",
    marginTop: 50,
  },
});

export default BuildScreen;
