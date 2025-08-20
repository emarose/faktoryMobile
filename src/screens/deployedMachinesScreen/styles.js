import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2a",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  emptyStateText: {
    color: "#b0b0b0",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  machineGroup: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#a0d911",
    marginBottom: 10,
    marginLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#444455",
    paddingBottom: 5,
  },
  machineCard: {
    backgroundColor: "#2a2a3a",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#444455",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  machineInfo: {
    flex: 1,
    marginRight: 10,
  },
  machineStatus: {
    fontSize: 16,
    color: "#ffffff",
    marginVertical: 8,
  },
  machineName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  machineDescription: {
    fontSize: 13,
    color: "#b0b0b0",
    marginBottom: 5,
  },
  machineDetail: {
    fontSize: 14,
    color: "#e0e0e0",
    marginBottom: 2,
  },
  upgradeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  upgradeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default styles;
