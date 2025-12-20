import { StyleSheet } from "react-native";
import Colors from "../../../../../../../constants/Colors";

export default StyleSheet.create({
  outputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  outputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  outputInfoContainer: {
    flex: 1,
    minWidth: 0, // Allows text truncation
  },
  outputAmount: {
    color: Colors.success,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  outputDetailsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    minWidth: 0,
  },
  outputDescription: {
    color: Colors.textSecondary,
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  outputBadge: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: Colors.success,
    alignSelf: "flex-start",
    flexShrink: 0, // Prevents badge from shrinking
  },
  outputBadgeText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: "bold",
  },
});
