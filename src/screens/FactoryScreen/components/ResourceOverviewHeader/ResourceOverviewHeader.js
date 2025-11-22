import { View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text, IconContainer } from "../../../../components";
import { useNavigation } from "@react-navigation/native";
import { useGame } from "../../../../contexts/GameContext";
import Colors from "../../../../constants/Colors";
import { heightPercentageToDP } from "react-native-responsive-screen";

const ResourceOverviewHeader = () => {
  const { inventory } = useGame();
  const navigation = useNavigation();

  const displayedResourceIds = ["ironOre", "copperOre", "coal", "limestone"];

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate("BasicResourcesScreen")}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0.3)", "rgba(0, 0, 0, 0.6)"]}
          start={{ x: 1, y:0 }}
          end={{ x: 0, y: 0 }}
          style={styles.headerContainer}
        >
        <Text style={styles.headerTitle}>Basic Resources</Text>
        <View style={styles.resourcesWrapper}>
          {displayedResourceIds.map((resourceId) => {
            const item = inventory[resourceId];
            if (!item || item.currentAmount === undefined) {
              return null;
            }
            return (
              <View key={item.id} style={styles.resourceItem}>
                <IconContainer 
                  iconId={item.id} 
                  size={30}
                  iconSize={24}
                />
                <Text style={styles.resourceName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.counterContainer}>
                  <Text style={styles.resourceAmount}>
                    {Math.floor(item.currentAmount)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    paddingVertical: heightPercentageToDP(2),
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  resourcesWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 8,
    gap: 6,
  },
  resourceItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 3,
  },
  resourceName: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
  counterContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  resourceAmount: {
    fontSize: 11,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
  },
});

export default ResourceOverviewHeader;
