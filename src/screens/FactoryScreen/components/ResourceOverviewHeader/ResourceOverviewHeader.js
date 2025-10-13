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
        style={styles.headerContainer}
      >
        <NineSliceFrame
          width={widthPercentageToDP(90)}
          height={64}
          
        >
          <View style={styles.resourcesWrapper}>
            {displayedResourceIds.map((resourceId) => {
              const item = inventory[resourceId];
              if (!item || item.currentAmount === undefined) {
                return null;
              }
              return (
                <View key={item.id} style={styles.resourceItem}>
                  <View style={styles.iconContainer}>
                    <Image
                      source={GameAssets.icons[item.id]}
                      style={styles.iconImage}
                    />
                  </View>

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
    marginVertical: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  resourcesWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: '100%',
    paddingHorizontal: 4,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
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
