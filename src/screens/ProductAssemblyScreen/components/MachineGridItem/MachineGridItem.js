import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from "../../../../components";
import Colors from "../../../../constants/Colors";
const MachineGridItem = ({ machineId, machineType, machineName, currentRecipeId, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(machineId)}
    >
      <View style={styles.iconPlaceholder}>
        <Text style={styles.iconText}>{machineName.charAt(0)}</Text>
      </View>
      <Text style={styles.name}>{machineName}</Text>
      {currentRecipeId && (
        <Text style={styles.recipeText}>Recipe: {currentRecipeId}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "45%",
    aspectRatio: 1,
    margin: "2.5%",
    backgroundColor: Colors,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.backgroundPanel,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 8,
    resizeMode: "contain",
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MachineGridItem;
