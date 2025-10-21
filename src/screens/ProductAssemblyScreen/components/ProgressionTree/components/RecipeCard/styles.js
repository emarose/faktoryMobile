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
    borderBottomColor: Colors.borderLight,
    paddingBottom: 8,
  },
  recipeTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recipeTitleIconContainer: {
    marginRight: 8,
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
    gap: 6,
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
    backgroundColor: "transparent",
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
