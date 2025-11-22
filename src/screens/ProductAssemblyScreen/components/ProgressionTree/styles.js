import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  // Search header styles
  searchHeader: {
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.3)',
    borderRadius: 8,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.4)',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    color: '#ffffff',
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: 'rgba(255, 0, 204, 0.3)',
    borderRadius: 8,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: '#ff00cc',
    fontWeight: "bold",
  },
  searchSummary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.3)',
    borderRadius: 8,
    marginBottom: 8,
  },
  searchSummaryText: {
    fontSize: 13,
    color: '#00ffff',
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  // Tab navigation styles
  tabsContainer: {
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 8,
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
    borderColor: 'rgba(0, 255, 255, 0.4)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  machineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#00ffff',
    textShadowColor: 'rgba(0, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  machineDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  machineRequirements: {
    marginTop: 8,
  },
  machineRequirementsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: '#00ffff',
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
    backgroundColor: 'rgba(0, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  requiredItemName: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: "500",
  },
  requiredItemQuantity: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 4,
  },
  // Recipe list container
  recipesContainer: {
    flex: 1,
    paddingBottom: 100,
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
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: "center",
    marginBottom: 16,
  },
  clearSearchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 255, 255, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.4)',
  },
  clearSearchButtonText: {
    fontSize: 14,
    color: '#00ffff',
    fontWeight: "500",
  },
});

export default styles;
