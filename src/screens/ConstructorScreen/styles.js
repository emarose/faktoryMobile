import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Main container styles - Screen version (no modal overlay)
  safeArea: {
    flex: 1,
    backgroundColor: "#2a3441", // Industrial gray-blue background
  },
  container: {
    flex: 1,
    backgroundColor: "#2a3441",
  },
  
  // Header with industrial styling (no close button needed)
  header: {
    backgroundColor: "#1f2935", // Darker header background
    borderBottomWidth: 2,
    borderBottomColor: "#4a5866",
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e8f4fd", // Light blue-white text
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1f2935",
    borderBottomWidth: 2,
    borderBottomColor: "#4a5866",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#2a3441",
    borderRightWidth: 1,
    borderRightColor: "#4a5866",
  },
  activeTabButton: {
    backgroundColor: "#4a7fa7",
    borderBottomWidth: 3,
    borderBottomColor: "#6db4f0",
  },
  tabButtonText: {
    color: "#b8c7d1",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  activeTabButtonText: {
    color: "#e8f4fd",
    fontWeight: "700",
  },
  
  // Main content layout
  contentContainer: {
    flex: 1,
  },

  // Recipe Tab Styles - Simplified for screen
  recipeTab: {
    flex: 1,
    backgroundColor: "#1f2935",
    margin: 16,
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 4,
    overflow: "hidden",
  },
  
  panelHeader: {
    backgroundColor: "#3a4856",
    borderBottomWidth: 1,
    borderBottomColor: "#4a5866",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  
  panelTitle: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  
  recipeList: {
    flex: 1,
  },
  
  recipeListContent: {
    padding: 12,
  },
  
  recipeCard: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  selectedRecipeCard: {
    borderColor: "#6db4f0",
    borderWidth: 2,
    backgroundColor: "#2a3441",
  },
  recipeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recipeIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#3a4856",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeCardTitle: {
    color: "#b8c7d1",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  selectedRecipeCardTitle: {
    color: "#e8f4fd",
  },
  recipeCardTime: {
    color: "#8a9aa8",
    fontSize: 12,
    fontWeight: "400",
  },
  
  recipeDetails: {
    borderTopWidth: 1,
    borderTopColor: "#4a5866",
    paddingTop: 12,
  },
  recipeInputsOutputs: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  recipeInputs: {
    flex: 1,
  },
  recipeOutputs: {
    flex: 1,
  },
  arrowIcon: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  recipeDetailLabel: {
    color: "#6db4f0",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recipeDetailText: {
    color: "#b8c7d1",
    fontSize: 12,
    marginBottom: 2,
  },

  // Production Tab Styles
  productionTab: {
    flex: 1,
    padding: 16,
  },
  productionMainArea: {
    flex: 1,
  },
  
  // Flow Section Styles
  flowSection: {
    flexDirection: "row",
    backgroundColor: "#1f2935",
    borderWidth: 2,
    borderColor: "#4a5866",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  inputSection: {
    flex: 1,
    alignItems: "center",
  },
  outputSection: {
    flex: 1,
    alignItems: "center",
  },
  arrowSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  flowLabel: {
    backgroundColor: "#3a4856",
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  flowLabelText: {
    color: "#e8f4fd",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  inputSlots: {
    alignItems: "center",
  },
  outputSlots: {
    alignItems: "center",
  },
  resourceSlot: {
    alignItems: "center",
    marginBottom: 8,
  },
  slotIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 2,
    borderColor: "#4a5866",
  },
  slotAmount: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  slotName: {
    color: "#b8c7d1",
    fontSize: 11,
    textAlign: "center",
    marginBottom: 2,
  },
  slotInventory: {
    fontSize: 10,
    fontWeight: "600",
  },

  // Machine Status Section
  machineStatusSection: {
    marginBottom: 16,
  },
  machineInfoCard: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 8,
    padding: 16,
  },
  machineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  machineIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#3a4856",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  machineInfo: {
    flex: 1,
  },
  machineTitle: {
    color: "#e8f4fd",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  recipeTitle: {
    color: "#6db4f0",
    fontSize: 14,
    fontWeight: "500",
  },
  machineStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: "#b8c7d1",
    fontSize: 12,
    fontWeight: "500",
  },
  productionStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2a3441",
    borderRadius: 6,
    padding: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    color: "#8a9aa8",
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "600",
  },

  // Progress Section
  progressSection: {
    marginBottom: 16,
  },

  // Controls Section
  controlsSection: {
    backgroundColor: "#1f2935",
    borderWidth: 1,
    borderColor: "#4a5866",
    borderRadius: 8,
    padding: 16,
  },
  quantityControls: {
    marginBottom: 16,
  },
  controlLabel: {
    color: "#e8f4fd",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  startProductionButton: {
    backgroundColor: "#4a7fa7",
    borderWidth: 1,
    borderColor: "#6db4f0",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  startProductionButtonDisabled: {
    backgroundColor: "#3a4856",
    borderColor: "#4a5866",
  },
  startProductionButtonText: {
    color: "#e8f4fd",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  startProductionButtonTextDisabled: {
    color: "#6b7885",
  },
});