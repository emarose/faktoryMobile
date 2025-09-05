import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "../../../../components";
import { useNavigation } from "@react-navigation/native";
import { useGame } from "../../../../contexts/GameContext";
import { getNodeColor } from "../../../../data/nodeTypes";
import Colors from "../../../../constants/Colors";

const ResourceOverviewHeader = () => {
  const { inventory } = useGame();
  const navigation = useNavigation();

  const displayedResourceIds = ["ironOre", "copperOre", "coal", "limestone"];

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate("BasicResourcesScreen")}
        style={styles.headerContainer}
      >
        <Text style={styles.title}>Basic Resources</Text>

        <View style={styles.resourcesWrapper}>
          {displayedResourceIds.map((resourceId) => {
            const item = inventory[resourceId];
            if (!item || item.currentAmount === undefined) {
              return null;
            }
            return (
              <View key={item.id} style={styles.resourceItem}>
                {/* Placeholder for Icon (e.g., an Image component) */}
                <View style={[styles.iconPlaceholder, { backgroundColor: getNodeColor(item.id + '_node') }]}>
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
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundPanel,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 10,
  },
  resourcesWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  iconText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  resourceAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textAccent,
  },
});

export default ResourceOverviewHeader;
