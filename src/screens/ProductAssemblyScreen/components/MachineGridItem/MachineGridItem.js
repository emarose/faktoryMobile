import { TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { Text } from "../../../../components";
import { useMachineColors } from "../../../../hooks";
import Colors from "../../../../constants/Colors";
// Global assets
import { GameAssets } from "../../../../components/AppLoader";

const MachineGridItem = ({ machineId, machineType, machineName, currentRecipeId, onPress }) => {
  const { getMachineColor, getMachineColorWithOpacity } = useMachineColors();
  
  const machineColor = getMachineColor(machineType || machineId);
  const machineColorBackground = getMachineColorWithOpacity(machineType || machineId, 0.2);
  
  return (
    <TouchableOpacity
      style={[
        styles.container, 
        { 
          backgroundColor: machineColorBackground,
          borderWidth: 2,
          borderColor: machineColor
        }
      ]}
      onPress={() => onPress(machineId)}
    >
      {GameAssets.icons[machineId] ? (
        <Image 
          source={GameAssets.icons[machineId]}
          style={styles.icon}
        />
      ) : (
        <View style={[styles.iconPlaceholder, { backgroundColor: machineColor }]}>
          <Text style={styles.iconText}>{machineName.charAt(0)}</Text>
        </View>
      )}
      <Text style={[styles.name, { color: machineColor }]}>{machineName}</Text>
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
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.backgroundPanel,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  iconText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 8,
    resizeMode: "contain",
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  recipeText: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },
});

export default MachineGridItem;
