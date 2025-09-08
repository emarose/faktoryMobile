import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  detailsContent: {
    paddingBottom: 10,
  },
  detailsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
    textAlign: "center",
    textTransform: "capitalize",
  },
  detailsText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  assignNodeButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  assignNodeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inventoryButton: {
    backgroundColor: "#2c2c44",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 12,
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
  },
});
