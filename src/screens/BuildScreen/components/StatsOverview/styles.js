import { StyleSheet } from "react-native";
import Colors from "../../../../constants/Colors";

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "rgba(0, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
});

export default styles;
