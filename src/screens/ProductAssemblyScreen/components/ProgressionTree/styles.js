import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  // Tab navigation styles
  tabsContainer: {
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabsScrollContent: {
    paddingHorizontal: 8,
  },
  // Machine header styles
  machineHeader: {
    padding: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  machineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  machineDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
  },
  machineRequirements: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
  },
  machineRequirementsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  machineRequirementsItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  requiredItemChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  requiredItemName: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  requiredItemQuantity: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  // Recipe list container
  recipesContainer: {
    flex: 1,
    padding: 12,
  },
  // Common styling used in multiple components
  itemColorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});

export default styles;
