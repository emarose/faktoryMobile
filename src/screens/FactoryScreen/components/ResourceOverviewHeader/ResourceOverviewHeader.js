import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "../../../../components";
import { useNavigation } from "@react-navigation/native";
import { useGame } from "../../../../contexts/GameContext";
import { getNodeColor } from "../../../../data/nodeTypes";
import Colors from "../../../../constants/Colors";
import { GameAssets } from "../../../../components/AppLoader";
import NineSliceFrame from "../../../../utils/NineSliceFrame";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

const ResourceOverviewHeader = () => {
  const { inventory } = useGame();
  const navigation = useNavigation();

  const displayedResourceIds = ["ironOre", "copperOre", "coal", "limestone"];

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate("BasicResourcesScreen")}
     /*    style={styles.headerContainer} */
      >
        <NineSliceFrame
          width={widthPercentageToDP(90)}
          height={heightPercentageToDP(5)}
        >
          <View style={styles.resourcesWrapper}>
            {displayedResourceIds.map((resourceId) => {
              const item = inventory[resourceId];
              if (!item || item.currentAmount === undefined) {
                return null;
              }
              return (
                <View key={item.id} style={styles.resourceItem}>
                  {GameAssets.icons[item.id] ? (
                    <View style={styles.iconContainer}>
                      <Image
                        source={GameAssets.icons[item.id]}
                        style={styles.iconImage}
                      />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.iconPlaceholder,
                        { backgroundColor: getNodeColor(item.id + "_node") },
                      ]}
                    >
                      <Text style={styles.iconText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.resourceAmount}>
                    {Math.floor(item.currentAmount)}
                  </Text>
                </View>
              );
            })}
          </View>
        </NineSliceFrame>
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
    gap: 15,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    //marginHorizontal: 10,
  },

  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  iconText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  iconImage: {
    width: 16,
    height: 16,
  },
  resourceAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.accentGreen,
  },
});

export default ResourceOverviewHeader;
