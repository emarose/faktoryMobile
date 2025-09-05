import { StyleSheet } from "react-native";
import Colors from "../../../../../constants/Colors";

export default styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: "100%",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.accentGreen,
    marginBottom: 10,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e0e0e0",
    marginTop: 5,
    marginBottom: 3,
  },
  resourceText: {
    fontSize: 14,
    color: "#cccccc",
    marginLeft: 10,
  },
  timerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    color: '#f0f0f0',
    marginBottom: 5,
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: Colors.borderLight,
    borderRadius: 5,
    overflow: 'hidden', // Ensures fill stays within bounds
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accentGreen,
    borderRadius: 5,
  },
  craftButton: {
    backgroundColor: Colors.accentGreen,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  craftButtonDisabled: {
    backgroundColor: Colors.borderLight,
  },
  craftButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});