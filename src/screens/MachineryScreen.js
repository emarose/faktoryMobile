import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

export default function MachineryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Machinery</Text>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
