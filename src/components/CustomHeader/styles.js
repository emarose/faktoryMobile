import Colors from '../../constants/Colors';
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
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
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundAccent,
  },
  rightButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundAccent,
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