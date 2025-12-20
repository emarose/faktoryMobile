import Colors from '../../../../../constants/Colors';
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  recipesScrollView: {
    marginBottom: 8,
  },
  recipesContainer: {
    paddingBottom: 8,
    paddingTop: 4,
  },
  recipeCard: {
    backgroundColor: Colors.backgroundPanel,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 100,
    maxWidth: 120,
    height: 100,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedRecipeCard: {
    backgroundColor: Colors.accentGreen,
    borderColor: Colors.accentGreenDark,
  },
  recipeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recipeText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  selectedRecipeText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
  }
});