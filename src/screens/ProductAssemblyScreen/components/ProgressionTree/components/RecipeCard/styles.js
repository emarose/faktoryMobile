import { StyleSheet } from "react-native";
import Colors from "../../../../../../constants/Colors";

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  recipeHeader: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom:8
  },
  recipeTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeTitleIconContainer: {
    marginRight: 8,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  recipeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  // Special layout for miners and oil extractors
  miningRecipeContent: {
    flex: 1,
  },
  miningOutputItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  miningOutputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  nodeInfoContainer: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
  },
  nodeInfoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  nodeIconContainer: {
    marginRight: 8,
    marginTop: 2,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  nodeInfoDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontStyle: "italic",
    lineHeight: 18,
    flex: 1,
  },
  nodeInfoDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  nodeInfoTagContainer: {
    marginRight: 8,
    marginBottom: 6,
  },
  nodeInfoTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 2,
    overflow: "hidden",
  },
  nodeInfoText: {
    fontSize: 12,
    color: Colors.accentGreen,
    marginRight: 8,
    marginBottom: 4,
  },
  recipeInputs: {
    flex: 1,
    paddingRight: 6,
  },
  recipeArrow: {
    paddingHorizontal: 12,
  },
  arrowText: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  recipeOutputs: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
    paddingLeft: 12,
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  itemColorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  itemIconContainer: {
    width: 20,
    height: 20,
    marginRight: 6,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  itemName: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});

export default styles;
