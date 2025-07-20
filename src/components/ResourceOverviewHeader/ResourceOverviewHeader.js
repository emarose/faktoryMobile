import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useGame } from "../../contexts/GameContext";
import { useNavigation } from "@react-navigation/native";

const ResourceOverviewHeader = () => {
  const { inventory } = useGame();
  const navigation = useNavigation();

  const displayedResourceIds = ["ironOre", "copperOre", "coal", "limestone"];

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("BasicResourcesScreen")}
      style={styles.headerContainer}
    >
      {displayedResourceIds.map((resourceId) => {
        const item = inventory[resourceId];
        if (!item || item.currentAmount === undefined) {
          // If the item doesn't exist in inventory or has no amount (e.g., not yet discovered)
          return null;
        }
        return (
          <View key={item.id} style={styles.resourceItem}>
            {/* Placeholder for Icon (e.g., an Image component) */}
            <View style={styles.iconPlaceholder}>
              {/* You can replace this with actual images later, e.g.:
              <Image source={item.icon} style={styles.iconImage} />
              Make sure your 'items' data includes an 'icon' property with require('./path/to/image.png') */}
              <Text style={styles.iconText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.resourceAmount}>
              {Math.floor(item.currentAmount)}
            </Text>
          </View>
        );
      })}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around", 
    alignItems: "center",
    backgroundColor: "#333344", 
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#444455",
    marginTop:16,
    flexWrap: "wrap", // Allow items to wrap to the next line if too many
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 5, // For flexWrap
  },
  iconPlaceholder: {
    width: 24, // Size of your icon
    height: 24,
    borderRadius: 4, // Slightly rounded corners
    backgroundColor: "#5a5a7e", // Placeholder color
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  iconText: {
    color: "#e0e0e0", // Light text for placeholder initial
    fontSize: 16,
    fontWeight: "bold",
  },
  // If you use actual images:
  // iconImage: {
  //   width: 24,
  //   height: 24,
  //   resizeMode: 'contain',
  // },
  resourceAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a0d911", // Green for resource amounts
  },
});

export default ResourceOverviewHeader;
