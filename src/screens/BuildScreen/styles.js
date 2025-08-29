import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#1a1a2e",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e0e0e0",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  buildCard: {
    backgroundColor: "#2a2a4a",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#4a4a6e",
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
    borderRadius: 5,
    backgroundColor: "#5a5a7e",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  iconText: {
    color: "#e0e0e0",
    fontSize: 20,
    fontWeight: "bold",
  },
  itemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a0d911",
  },
  itemDescription: {
    fontSize: 14,
    color: "#cccccc",
    marginBottom: 10,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 5,
  },
  requirementText: {
    fontSize: 14,
    color: "#cccccc",
    marginLeft: 10,
    marginBottom: 3,
  },
  missingText: {
    color: "#ffc107",
    fontStyle: "italic",
    fontSize: 13,
  },
  buildButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  buildButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  buildButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noItemsText: {
    fontSize: 16,
    color: "#aaaaaa",
    textAlign: "center",
    marginTop: 50,
  },
});

export default styles;