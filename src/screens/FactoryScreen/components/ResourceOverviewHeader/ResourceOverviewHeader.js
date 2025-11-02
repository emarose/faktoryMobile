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
          colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.1)"]}
          start={{ x: 0, y:0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerContainer}
        >
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
                  iconSize={20}
                  style={styles.iconContainerStyle}
                />

                <Text style={styles.resourceAmount}>
                  {Math.floor(item.currentAmount)}
                </Text>
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
    paddingVertical: heightPercentageToDP(3),
  },
  resourcesWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    gap: 8,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 8,
  },
  iconContainerStyle: {
    marginRight: 4,
  },
  resourceAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.accentGreen,
  },
});

export default ResourceOverviewHeader;
