import Colors from "../../constants/Colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.1)",

    minHeight: 60,
  },
  leftContainer: {
    width: 50,
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightContainer: {
    width: 50,
    alignItems: "flex-end",
  },
  backButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: " rgba(255, 255, 255, 0.1)",
  },
  rightButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
