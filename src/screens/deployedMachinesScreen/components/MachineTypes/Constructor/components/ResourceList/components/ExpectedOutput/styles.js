import { StyleSheet } from "react-native";

export default StyleSheet.create({
  outputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    backgroundColor: "#253625",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#395239",
  },
  outputIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a261a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  outputInfoContainer: {
    flex: 1,
    minWidth: 0, // Allows text truncation
  },
  outputAmount: {
    color: "#4CAF50",
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
    color: "#a5d6a7",
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  outputBadge: {
    backgroundColor: "#23233a",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#4CAF50",
    alignSelf: "flex-start",
    flexShrink: 0, // Prevents badge from shrinking
  },
  outputBadgeText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
  },
});
