import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  // Search header styles
  searchHeader: {
    paddingVertical: 8,
    backgroundColor: Colors.backgroundPanel,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: 8,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "bold",
  },
  searchSummary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchSummaryText: {
    fontSize: 13,
    color: Colors.accentGreen,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  // Tab navigation styles
  tabsContainer: {
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabsScrollContent: {
    paddingHorizontal: 8,
  },
  // Machine header styles
  machineHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
  },
  machineRequirements: {
    marginTop: 8,
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
    backgroundColor: Colors.backgroundAccent,
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
      },
  // Common styling used in multiple components
  itemColorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  requiredItemIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
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
    marginBottom: 16,
  },
  clearSearchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  clearSearchButtonText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
});

export default styles;
