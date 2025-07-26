import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#1a1a2e",
    paddingTop: 0,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#a0d911",
    marginTop: 25,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#4a4a6e",
    paddingBottom: 5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#2a2a4a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4a4a6e",
  },
  gridItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f0f0f0",
    textAlign: "center",
    marginBottom: 5,
  },
  gridItemDescription: {
    fontSize: 12,
    color: "#cccccc",
    textAlign: "center",
  },
});