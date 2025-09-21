import { StyleSheet } from "react-native";
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel,
  },
  header: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.backgroundWarning,
    shadowColor: Colors.backgroundWarning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    textShadowColor: Colors.backgroundWarning,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Tab navigation styles
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: Colors.backgroundPill,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  activeTabButton: {
    backgroundColor: Colors.backgroundWarning,
    borderColor: Colors.backgroundWarning,
    shadowColor: Colors.backgroundWarning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  activeTabButtonText: {
    color: Colors.textPrimary,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Content container
  contentContainer: {
    flex: 1,
  },

  // Recipe tab styles
  recipeTab: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel,
  },
  panelHeader: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  recipeList: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel,
  },
  recipeListContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  recipeCard: {
    backgroundColor: Colors.backgroundSecondary,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedRecipeCard: {
    backgroundColor: Colors.backgroundPill,
    borderColor: Colors.backgroundWarning,
    borderWidth: 2,
    shadowColor: Colors.backgroundWarning,
    shadowOpacity: 0.3,
  },
  recipeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  recipeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  selectedRecipeCardTitle: {
    color: Colors.textPrimary,
    textShadowColor: Colors.backgroundWarning,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  recipeCardTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  recipeDetails: {
    marginTop: 8,
  },
  recipeInputsOutputs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recipeInputs: {
    flex: 1,
  },
  recipeOutputs: {
    flex: 1,
    alignItems: "flex-end",
  },
  recipeDetailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.backgroundWarning,
    marginBottom: 4,
  },
  recipeDetailText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  arrowIcon: {
    marginHorizontal: 12,
  },

  // Production tab styles
  productionTab: {
    flex: 1,
    backgroundColor: Colors.backgroundPanel,
  },
  productionMainArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Flow section styles
  flowSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    padding: 20,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.backgroundWarning,
    shadowColor: Colors.backgroundWarning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  flowLabel: {
    backgroundColor: Colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.backgroundWarning,
  },
  flowLabelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.backgroundWarning,
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
    marginVertical: 8,
    padding: 12,
    backgroundColor: Colors.backgroundPill,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minWidth: 100,
  },
  slotIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  slotAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  slotName: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 4,
  },
  slotInventory: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },

  // Machine status section
  machineStatusSection: {
    marginVertical: 16,
  },
  machineInfoCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  machineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  machineIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.backgroundPill,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.backgroundWarning,
  },
  machineInfo: {
    flex: 1,
  },
  machineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  recipeTitle: {
    fontSize: 14,
    color: Colors.backgroundWarning,
    fontWeight: "500",
  },
  machineStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  productionStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.backgroundWarning,
  },

  // Progress section
  progressSection: {
    marginVertical: 12,
  },

  // Controls section
  controlsSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  quantityControls: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  quantityInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: Colors.backgroundPill,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  quantityLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 12,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.backgroundWarning,
    minWidth: 40,
    textAlign: "center",
  },
  quickButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  startProductionButton: {
    backgroundColor: Colors.backgroundWarning,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: Colors.backgroundWarning,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  startProductionButtonDisabled: {
    backgroundColor: Colors.borderLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  startProductionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginLeft: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  startProductionButtonTextDisabled: {
    color: Colors.textMuted,
    textShadowOpacity: 0,
  },
});