import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

export default StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    borderRadius: 12,
    margin: 8,
    padding: 16,
    minWidth: 100,
    minHeight: 120,
    elevation: 2,
  },
  selectedCard: {
    borderColor: "#FFD700",
    borderWidth: 2,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  amount: {
    color: "#aaa",
    fontSize: 14,
  },
});
