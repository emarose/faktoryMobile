import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

const styles = StyleSheet.create({
  // Main container styles - Screen version (no modal overlay)
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Header with industrial styling (no close button needed)
  header: {
    backgroundColor: Colors.backgroundPanel,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundPanel,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  activeTabButton: {
    backgroundColor: Colors.backgroundAccent,
    borderBottomWidth: 3,
    borderBottomColor: Colors.backgroundAccent,
  },
  tabButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  activeTabButtonText: {
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  
  // Main content layout
  contentContainer: {
    flex: 1,
    backgroundColor: 'rgba(17, 25, 40, 0.85)',
  },

  // Recipe Tab Styles - Simplified for screen
  recipeTab: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel,
    margin: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  
  panelHeader: {
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  
  panelTitle: {
    color: Colors.textPrimary,
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
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedRecipeCard: {
    borderColor: Colors.backgroundAccent,
    borderWidth: 2,
    backgroundColor: 'rgba(41, 49, 71, 0.8)',
  },
  recipeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recipeIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recipeItemIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  recipeInfo: {
    flex: 1,
  },
  recipeCardTitle: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  selectedRecipeCardTitle: {
    color: Colors.textPrimary,
  },
  recipeCardTime: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: "400",
  },
  
  recipeDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
    color: Colors.backgroundAccent,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recipeDetailText: {
    color: Colors.textSecondary,
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
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  flowLabelText: {
    color: Colors.textPrimary,
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
    borderColor: Colors.border,
  },
  slotItemIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  slotAmount: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  slotName: {
    color: Colors.textSecondary,
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
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  machineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  machineIcon: {
    width: 48,
    height: 48,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  machineItemIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  machineInfo: {
    flex: 1,
  },
  machineTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  recipeTitle: {
    color: Colors.backgroundAccent,
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
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  productionStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    borderRadius: 6,
    padding: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },

  // Progress Section
  progressSection: {
    marginBottom: 16,
  },

  // Controls Section
  controlsSection: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  quantityControls: {
    marginBottom: 16,
  },
  controlLabel: {
    color: Colors.textPrimary,
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
    backgroundColor: Colors.backgroundAccent,
    borderWidth: 1,
    borderColor: Colors.backgroundAccent,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  startProductionButtonDisabled: {
    backgroundColor: Colors.backgroundSecondary,
    borderColor: Colors.border,
  },
  startProductionButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  startProductionButtonTextDisabled: {
    color: Colors.textMuted,
  },
});

export default styles;