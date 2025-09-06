import { StyleSheet } from "react-native";
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.backgroundPanel,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  buildCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    // Enhanced shadow for better visual separation
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: "contain",
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.backgroundPill,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    // Enhanced styling for machine color integration
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconText: {
    color: Colors.textSecondary,
    fontSize: 18,
    fontWeight: "bold",
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textAccent,
    flex: 1,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  requirementText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 10,
    marginBottom: 3,
  },
  missingText: {
    color: Colors.backgroundWarning,
    fontStyle: "italic",
    fontSize: 13,
  },
  buildButton: {
    backgroundColor: Colors.accentBlue,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
    // Enhanced button styling
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  buildButtonDisabled: {
    backgroundColor: Colors.fallback,
  },
  buildButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  noItemsText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 50,
  },
});

export default styles;