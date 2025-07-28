import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    padding: 20,
    minWidth: 280,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
    textAlign: "left",
  },
  modalSubtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
    textAlign: "left",
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    textAlign: "left",
  },
  modalButton: {
    backgroundColor: "#27ae60",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginVertical: 4,
    alignItems: "center",
    alignSelf: "stretch",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  modalCloseButton: {
    backgroundColor: "#bbb",
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 18,
    marginTop: 10,
    alignItems: "center",
    alignSelf: "stretch",
  },
  modalCloseButtonText: {
    color: "#222",
    fontSize: 14,
    fontWeight: "bold",
  },
});
