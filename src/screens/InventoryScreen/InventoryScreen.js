import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Text } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { items } from "../../data/items";
import { useGame } from "../../contexts/GameContext";
import styles from "./styles";

const InventoryScreen = () => {
  const { inventory } = useGame();

  const ownedCraftedItems = Object.values(inventory)
    .filter((item) => {
      const itemData = items[item.id];
      return (
        item.currentAmount > 0 &&
        itemData &&
        (itemData.type === "intermediateProduct" ||
          itemData.type === "finalProduct")
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Crafted Items</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {ownedCraftedItems.length > 0 ? (
          <View style={styles.inventoryGrid}>
            {ownedCraftedItems.map((item) => {
              const itemDetails = items[item.id] || {};

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => {
                    console.log(
                      `Tapped on ${item.name}. Description: ${itemDetails.description}`
                    );
                  }}
                >
                  <View style={styles.iconContainer}>
                    {/* <Image source={itemDetails.icon} style={styles.itemIcon} /> */}
                    <Text style={styles.iconText}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <Text style={styles.itemName}>{item.name}</Text>

                  <View style={styles.amountOverlay}>
                    <Text style={styles.itemAmount}>
                      {Math.floor(item.currentAmount)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyInventoryText}>
            Your inventory of crafted items is empty. Start building and
            crafting!
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InventoryScreen;
