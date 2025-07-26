import { StyleSheet } from "react-native";

export default cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#3a3a5a",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#5a5a7e",
    width: "100%",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a0d911",
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
    backgroundColor: '#555',
    borderRadius: 5,
    overflow: 'hidden', // Ensures fill stays within bounds
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#a0d911', // Green progress bar
    borderRadius: 5,
  },
  craftButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  craftButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  craftButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});