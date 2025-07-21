import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 5,
    alignItems: "center",
  },
  resourceLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 3,
  },
  resourceName: {
    fontSize: 16,
    color: "#cccccc",
    fontWeight: "bold",
  },
  resourceAmount: {
    fontSize: 16,
    color: "#a0d911",
    fontWeight: "bold",
  },
});

export default styles;
