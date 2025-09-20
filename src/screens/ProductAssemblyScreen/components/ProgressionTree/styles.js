import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  // Search header styles
  searchHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#2a3441",
    borderBottomWidth: 2,
    borderBottomColor: "#4a5866",
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: "#e8f4fd",
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#1f2935",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4a5866",
    paddingHorizontal: 4,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#e8f4fd",
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: "#4a5866",
    borderRadius: 8,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: "#e8f4fd",
    fontWeight: 'bold',
  },
  searchSummary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#1f2935",
    borderBottomWidth: 1,
    borderBottomColor: "#4a5866",
  },
  searchSummaryText: {
    fontSize: 13,
    color: "#6db4f0",
    fontWeight: '600',
    letterSpacing: 0.5,
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
    fontWeight: '500',
  },
});

export default styles;
