import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native";
import { items } from "../../../../data/items";

const MachineGridItem = ({ machineId, onPress }) => {
  const machine = items[machineId];
  if (!machine) {
    return null;
  }

  // const icon = machine.icon || require('../../assets/icons/default_machine.png');

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(machineId)}
    >
      {/* <Image source={icon} style={styles.icon} /> */}
      <View style={styles.iconPlaceholder}>
        <Text style={styles.iconText}>{machine.name.charAt(0)}</Text>
      </View>
      <Text style={styles.name}>{machine.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "45%",
    aspectRatio: 1,
    margin: "2.5%",
    backgroundColor: "#3a3a3a",
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
    backgroundColor: "#555",
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
