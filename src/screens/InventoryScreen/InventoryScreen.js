import { View, ScrollView, TouchableOpacity, Image, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, CustomHeader } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameAssets } from "../../components/AppLoader";
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
      <CustomHeader 
        title="Inventory"
        rightIcon="package-variant"
        onRightIconPress={() => console.log("Inventory tools pressed")}
      />
      <ImageBackground
        source={require('../../../assets/images/backgrounds/background.png')}
        style={styles.backgroundImageContainer}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.4)", "rgba(58, 2, 66, 0.6)", "rgba(0, 0, 0, 0.5)"]}
          style={styles.gradientOverlay}
        >
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
                    {GameAssets.icons[item.id] ? (
                      <Image 
                        source={GameAssets.icons[item.id]} 
                        style={styles.itemIcon}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.iconText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    )}
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
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default InventoryScreen;
