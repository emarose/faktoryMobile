import { StyleSheet } from "react-native";
import Colors from "../../../../../../constants/Colors";

const styles = StyleSheet.create({
  assignNodeButton: {
    backgroundColor: Colors.success,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assignNodeText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default styles;
